"use client";

import { indexedDBService, SavedProject } from "./indexedDB";
import { useProjectStore } from "@/entities/project/useProjectStore";
import { useMediaStore } from "@/entities/media/useMediaStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import useMediaAssetStore, { initialCreateVideoData } from "@/entities/mediaAsset/useMediaAssetStore";

/**
 * 프로젝트 데이터 영속화(저장/불러오기/삭제/복제/생성)를 담당하는 서비스.
 * - 앱 상태(Zustand 스토어)와 IndexedDB 간 동기화 수행
 * - blob: URL 안전 처리(생성/해제) 및 복원 지원
 */
export class ProjectPersistenceService {
  /**
   * 현재 편집 중인 프로젝트를 IndexedDB에 저장합니다.
   * - 프로젝트/미디어/타임라인/미디어에셋 상태를 스냅샷으로 저장
   * - blob: URL로만 존재하는 오디오/TTS를 Blob으로 캡처해 함께 보관
   * @param customName 저장 시 프로젝트 이름을 덮어쓸 이름(선택)
   * @returns 저장된 프로젝트의 ID
   * @throws 필수 값 누락 또는 저장 실패 시 예외 발생
   */
  static async saveCurrentProject(customName?: string): Promise<string> {
    try {
      const projectStore = useProjectStore.getState();
      const mediaStore = useMediaStore.getState();
      const timelineStore = useTimelineStore.getState();
      const mediaAssetStore = useMediaAssetStore.getState();

      const projectId = projectStore.project.id;
      const projectName = (customName || projectStore.project.name).trim();

      if (!projectName) {
        throw new Error("Project name cannot be empty");
      }

      if (!projectId) {
        throw new Error("Project ID is required");
      }

      // 세션(새로고침/재시작) 이후에도 유지되도록 'blob:' URL의 TTS 오디오를 Blob으로 확보
      let ttsBlob: Blob | null = null;
      const currentTtsUrl = mediaAssetStore.initialCreateVideoData.ttsUrl;
      if (currentTtsUrl && currentTtsUrl.startsWith("blob:")) {
        try {
          ttsBlob = await fetch(currentTtsUrl).then((r) => r.blob());
        } catch (e) {
          console.warn("Failed to capture TTS blob", e);
        }
      }

      const audioBlobs: Record<string, Blob> = {};
      // 세션 종료 시 사라지는 'blob:' 오디오를 병렬로 fetch해 Blob(id→Blob)으로 수집
      await Promise.all(
        (mediaStore.media.audioElement || []).map(async (el) => {
          // 유효한 'blob:' URL만 처리
          if (el.url && el.url.startsWith("blob:")) {
            try {
              const b = await fetch(el.url).then((r) => r.blob());
              audioBlobs[el.id] = b;
            } catch (e) {
              // 실패해도 진행 계속; 디버깅을 위해 경고만 기록
              console.warn("Failed to capture audio blob", el.id, e);
            }
          }
        })
      );

      const savedProject: SavedProject = {
        id: projectId,
        name: projectName,
        createdAt: projectStore.project.createdAt,
        updatedAt: new Date(),
        projectData: {
          ...projectStore.project,
          name: projectName,
          updatedAt: new Date(),
        },
        mediaData: mediaStore.media,
        createVideoData: mediaAssetStore.initialCreateVideoData,
        timelineData: {
          currentTime: timelineStore.currentTime,
          zoom: timelineStore.zoom,
        },
        blobData: {
          tts: ttsBlob,
          audio: audioBlobs,
        },
      };

      await indexedDBService.saveProject(savedProject);

      // Update the current project with new name and updatedAt
      projectStore.setProject({
        ...projectStore.project,
        name: projectName,
        updatedAt: new Date(),
      });

      return projectId;
    } catch (error) {
      console.error("Failed to save project:", error);
      throw error;
    }
  }

  /**
   * 지정한 프로젝트 ID로부터 프로젝트를 불러옵니다.
   * - 저장된 Blob을 blob: URL로 재구성하여 재생 가능 상태로 복원
   * - 기존 blob: URL을 revoke하여 메모리 누수 방지
   * - 프로젝트/미디어/타임라인/미디어에셋 스토어 상태를 갱신
   * @param projectId 불러올 프로젝트 ID
   * @returns 불러오기 성공 여부
   */
  static async loadProject(projectId: string): Promise<boolean> {
    try {
      if (!projectId || projectId.trim() === "") {
        throw new Error("Project ID is required");
      }

      const savedProject = await indexedDBService.loadProject(projectId);

      if (!savedProject) {
        throw new Error("Project not found");
      }

      // Validate project data
      if (!savedProject.projectData || !savedProject.mediaData) {
        throw new Error("Project data is corrupted");
      }

      const projectStore = useProjectStore.getState();
      const mediaStore = useMediaStore.getState();
      const timelineStore = useTimelineStore.getState();
      const mediaAssetStore = useMediaAssetStore.getState();

      // Revoke existing blob: URLs in current stores to prevent leaks
      try {
        const prevTts = mediaAssetStore.initialCreateVideoData.ttsUrl;
        if (prevTts && prevTts.startsWith("blob:")) {
          URL.revokeObjectURL(prevTts);
        }
        for (const el of mediaStore.media.audioElement || []) {
          if (el.url && el.url.startsWith("blob:")) {
            URL.revokeObjectURL(el.url);
          }
        }
      } catch {}

      // Rebuild media and createVideoData URLs from stored blobs
      const rebuiltMedia = {
        ...savedProject.mediaData,
        audioElement: (savedProject.mediaData.audioElement || []).map((el) => {
          const blob = savedProject.blobData?.audio?.[el.id];
          if (blob) {
            const url = URL.createObjectURL(blob);
            return { ...el, url };
          }
          return el;
        }),
      };

      const loadedCreateVideoData = (savedProject as any).createVideoData;
      let ttsUrl = loadedCreateVideoData?.ttsUrl ?? "";
      const ttsBlob = savedProject.blobData?.tts ?? null;
      if (ttsBlob) {
        ttsUrl = URL.createObjectURL(ttsBlob);
      }

      // Load project data
      projectStore.setProject(savedProject.projectData);

      // Load media data with rebuilt audio URLs
      mediaStore.setMedia(rebuiltMedia);

      // Load media-asset(create video) data with rebuilt tts URL
      if (loadedCreateVideoData) {
        mediaAssetStore.setCreateVideoData({
          ...loadedCreateVideoData,
          ttsUrl,
        });
      } else {
        mediaAssetStore.resetCreateVideoData();
      }

      // Load timeline data if available
      if (savedProject.timelineData) {
        timelineStore.setCurrentTime(savedProject.timelineData.currentTime || 0);
        timelineStore.setZoom(savedProject.timelineData.zoom || 1);
      }

      return true;
    } catch (error) {
      console.error("Failed to load project:", error);
      return false;
    }
  }

  /**
   * 저장된 모든 프로젝트 메타 및 스냅샷을 반환합니다.
   * @returns 저장된 프로젝트 목록
   * @remarks 실패 시 빈 배열을 반환합니다.
   */
  static async getAllProjects(): Promise<SavedProject[]> {
    try {
      return await indexedDBService.getAllProjects();
    } catch (error) {
      console.error("Failed to get projects:", error);
      return [];
    }
  }

  /**
   * 지정한 프로젝트를 IndexedDB에서 삭제합니다.
   * @param projectId 삭제할 프로젝트 ID
   * @returns 삭제 성공 여부
   */
  static async deleteProject(projectId: string): Promise<boolean> {
    try {
      await indexedDBService.deleteProject(projectId);
      return true;
    } catch (error) {
      console.error("Failed to delete project:", error);
      return false;
    }
  }

  /**
   * 새 프로젝트를 생성하고 초기 상태로 저장합니다.
   * - 새로운 UUID로 프로젝트를 만들고 모든 관련 스토어를 초기화
   * - 초기 스냅샷을 즉시 저장하여 이후 복원이 가능하도록 함
   * @param name 새 프로젝트 이름(기본값: "New Project")
   * @returns 생성된 프로젝트 ID
   */
  static async createNewProject(name: string = "New Project"): Promise<string> {
    const projectStore = useProjectStore.getState();
    const mediaStore = useMediaStore.getState();
    const timelineStore = useTimelineStore.getState();
    const mediaAssetStore = useMediaAssetStore.getState();

    // Generate new project ID
    const newProjectId = crypto.randomUUID();
    const now = new Date();

    const newProject = {
      id: newProjectId,
      name,
      createdAt: now,
      updatedAt: now,
    };

    // Reset all stores to initial state with new project
    projectStore.setProject(newProject);
    mediaStore.setMedia({
      projectDuration: 0,
      fps: 30,
      textElement: [],
      mediaElement: [],
      audioElement: [],
      isUsingMediaAsset: false,
    });
    timelineStore.setCurrentTime(0);
    timelineStore.resetZoom();

    // Reset media asset store as well
    mediaAssetStore.resetCreateVideoData();

    // Save the new project
    await this.saveCurrentProject(name);

    return newProjectId;
  }

  /**
   * 기존 프로젝트를 복제하여 새 프로젝트를 생성합니다.
   * - ID/타임스탬프/이름을 새 값으로 갱신
   * - createVideoData가 없으면 초기값으로 대체
   * - Blob 데이터 포인터는 그대로 재사용(필요 시 로드 시점에 재구성)
   * @param projectId 복제할 원본 프로젝트 ID
   * @param newName 복제본 이름(미지정 시 원본 이름 + " (Copy)")
   * @returns 새 프로젝트 ID 또는 실패 시 null
   */
  static async duplicateProject(projectId: string, newName?: string): Promise<string | null> {
    try {
      const savedProject = await indexedDBService.loadProject(projectId);

      if (!savedProject) {
        return null;
      }

      const newProjectId = crypto.randomUUID();
      const now = new Date();
      const duplicatedName = newName || `${savedProject.name} (Copy)`;

      const duplicatedProject: SavedProject = {
        ...savedProject,
        id: newProjectId,
        name: duplicatedName,
        createdAt: now,
        updatedAt: now,
        projectData: {
          ...savedProject.projectData,
          id: newProjectId,
          name: duplicatedName,
          createdAt: now,
          updatedAt: now,
        },
        createVideoData: (savedProject as any).createVideoData || initialCreateVideoData,
        blobData: savedProject.blobData,
      };

      await indexedDBService.saveProject(duplicatedProject);
      return newProjectId;
    } catch (error) {
      console.error("Failed to duplicate project:", error);
      return null;
    }
  }
}

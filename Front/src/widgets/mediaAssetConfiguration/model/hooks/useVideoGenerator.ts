import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaStore } from "@/entities/media/useMediaStore";
import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import { useProjectStore } from "@/entities/project/useProjectStore";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";
import { ProjectPersistenceService } from "@/shared/lib/projectPersistence";
import {
  createImageElements,
  createAudioElementFromTTS,
  createTextElementsFromSRT,
} from "../../lib/mediaElementFactory";

/**
 * 비디오 생성 로직을 관리하는 커스텀 훅
 *
 * 책임:
 * - 미디어 에셋으로부터 비디오 요소 생성
 * - 생성된 요소들을 미디어 스토어에 추가
 * - 프로젝트 저장 및 에디터 페이지로 이동
 */
export function useVideoGenerator() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const projectId = useProjectStore((state) => state.project.id);
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);

  const imageData = useMediaAssetStore((state) => state.initialCreateVideoData.imageData);
  const ttsUrls = useMediaAssetStore((state) => state.initialCreateVideoData.ttsUrls);
  const captions = useMediaAssetStore((state) => state.initialCreateVideoData.captions);

  const addMediaElements = useMediaStore((s) => s.addMediaElements);
  const addAudioElement = useMediaStore((s) => s.addAudioElement);
  const addTextElement = useMediaStore((s) => s.addTextElement);
  const clearInitElementsInLanes = useMediaStore((s) => s.clearInitElementsInLanes);
  const setUseMediaAsset = useMediaStore((s) => s.setUseMediaAsset);

  /**
   * 미디어 레인에서 기존 초기화 요소 제거
   */
  const clearExistingElements = () => {
    const mediaLaneId = activeLaneByType.Media;
    const audioLaneId = activeLaneByType.Audio;
    const textLaneId = activeLaneByType.Text;

    clearInitElementsInLanes([
      { type: "media", laneId: mediaLaneId },
      { type: "audio", laneId: audioLaneId },
      { type: "text", laneId: textLaneId },
    ]);
  };

  /**
   * 이미지 요소 생성 및 추가
   */
  const addImageElements = () => {
    const mediaLaneId = activeLaneByType.Media;
    const imageElements = createImageElements(imageData, mediaLaneId);

    if (imageElements.length > 0) {
      console.log("convertedImageElements", imageElements);
      addMediaElements(imageElements);
    }
  };

  /**
   * 오디오 요소 생성 및 추가
   */
  const addAudioElements = async () => {
    const audioLaneId = activeLaneByType.Audio;
    const audioElement = await createAudioElementFromTTS(ttsUrls, audioLaneId);

    if (audioElement) {
      console.log("audioElement", audioElement);
      addAudioElement(audioElement);
    }
  };

  /**
   * 자막 텍스트 요소 생성 및 추가
   */
  const addCaptionElements = () => {
    const textLaneId = activeLaneByType.Text;
    const textElements = createTextElementsFromSRT(captions, textLaneId);

    if (textElements.length > 0) {
      console.log("textElements", textElements);
      textElements.forEach((element) => {
        addTextElement(element, true);
      });
    }
  };

  /**
   * 프로젝트 저장 및 에디터로 이동
   */
  const saveAndNavigateToEditor = async () => {
    await ProjectPersistenceService.saveCurrentProject();
    router.push(`/edits/${projectId}`);
  };

  /**
   * 비디오 생성 메인 함수
   *
   * 순서:
   * 1. 기존 요소 제거
   * 2. 이미지 요소 추가
   * 3. 오디오 요소 추가
   * 4. 자막 요소 추가
   * 5. 프로젝트 저장 및 에디터로 이동
   */
  const generateVideo = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      clearExistingElements();
      addImageElements();
      await addAudioElements();
      addCaptionElements();
      setUseMediaAsset(true);
      await saveAndNavigateToEditor();
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateVideo,
  };
}

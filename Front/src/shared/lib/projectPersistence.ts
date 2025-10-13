"use client";

import { indexedDBService, SavedProject } from "./indexedDB";
import { useProjectStore } from "@/entities/project/useProjectStore";
import { useMediaStore } from "@/entities/media/useMediaStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";

export class ProjectPersistenceService {
  static async saveCurrentProject(customName?: string): Promise<string> {
    try {
      const projectStore = useProjectStore.getState();
      const mediaStore = useMediaStore.getState();
      const timelineStore = useTimelineStore.getState();

      const projectId = projectStore.project.id;
      const projectName = (customName || projectStore.project.name).trim();

      if (!projectName) {
        throw new Error("Project name cannot be empty");
      }

      if (!projectId) {
        throw new Error("Project ID is required");
      }

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
        timelineData: {
          currentTime: timelineStore.currentTime,
          zoom: timelineStore.zoom,
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

      // Load project data
      projectStore.setProject(savedProject.projectData);

      // Load media data
      mediaStore.setMedia(savedProject.mediaData);

      // Load timeline data if available
      if (savedProject.timelineData) {
        timelineStore.setCurrentTime(
          savedProject.timelineData.currentTime || 0
        );
        timelineStore.setZoom(savedProject.timelineData.zoom || 1);
      }

      return true;
    } catch (error) {
      console.error("Failed to load project:", error);
      return false;
    }
  }

  static async getAllProjects(): Promise<SavedProject[]> {
    try {
      return await indexedDBService.getAllProjects();
    } catch (error) {
      console.error("Failed to get projects:", error);
      return [];
    }
  }

  static async deleteProject(projectId: string): Promise<boolean> {
    try {
      await indexedDBService.deleteProject(projectId);
      return true;
    } catch (error) {
      console.error("Failed to delete project:", error);
      return false;
    }
  }

  static async createNewProject(name: string = "New Project"): Promise<string> {
    const projectStore = useProjectStore.getState();
    const mediaStore = useMediaStore.getState();
    const timelineStore = useTimelineStore.getState();

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
    });
    timelineStore.setCurrentTime(0);
    timelineStore.resetZoom();

    // Save the new project
    await this.saveCurrentProject(name);

    return newProjectId;
  }

  static async duplicateProject(
    projectId: string,
    newName?: string
  ): Promise<string | null> {
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
      };

      await indexedDBService.saveProject(duplicatedProject);
      return newProjectId;
    } catch (error) {
      console.error("Failed to duplicate project:", error);
      return null;
    }
  }
}

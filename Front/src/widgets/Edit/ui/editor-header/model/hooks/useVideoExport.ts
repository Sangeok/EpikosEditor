/**
 * useVideoExport Hook
 * Manages video export workflow including asset upload and API communication
 */

import { useProjectStore } from "@/entities/project/useProjectStore";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { useExportProgress } from "./useExportProgress";
import { AssetUploadService } from "../services/AssetUploadService";

interface ExportData {
  project: {
    id: string;
    name: string;
  };
  media: {
    projectDuration: number;
    fps: number;
    textElement: any[];
    mediaElement: any[];
    audioElement: any[];
  };
}

export function useVideoExport() {
  const { project } = useProjectStore();
  const { media } = useMediaStore();
  const exportProgress = useExportProgress();

  const getApiBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  };

  const prepareExportData = async (): Promise<ExportData> => {
    const apiBase = getApiBaseUrl();
    const resolvedMedia = await AssetUploadService.resolveMediaForExport(media, apiBase);

    return {
      project: {
        id: project.id,
        name: project.name,
      },
      media: {
        projectDuration: resolvedMedia.projectDuration,
        fps: resolvedMedia.fps,
        textElement: resolvedMedia.textElement,
        mediaElement: resolvedMedia.mediaElement,
        audioElement: resolvedMedia.audioElement,
      },
    };
  };

  const requestVideoCreation = async (exportData: ExportData) => {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/video/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exportData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const startExport = async () => {
    try {
      exportProgress.resetState();

      console.log("Preparing export data...");
      const exportData = await prepareExportData();
      console.log("Exporting video with data:", exportData);

      const result = await requestVideoCreation(exportData);

      if (result.success) {
        console.log("Video creation started:", result.jobId);
        exportProgress.subscribeToJob(result.jobId);
        return { success: true, jobId: result.jobId };
      } else {
        throw new Error(result.message || "Video creation request failed");
      }
    } catch (error) {
      console.error("Export failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Video export failed: ${errorMessage}`);
    }
  };

  const cancelExport = () => {
    if (exportProgress.jobId) {
      exportProgress.cancelJob(exportProgress.jobId);
    }
  };

  return {
    // Export actions
    startExport,
    cancelExport,
    resetExport: exportProgress.resetState,

    // Export state
    jobId: exportProgress.jobId,
    progress: exportProgress.progress,
    status: exportProgress.status,
    error: exportProgress.error,
    outputPath: exportProgress.outputPath,
    filename: exportProgress.filename,
    downloadUrl: exportProgress.downloadUrl,

    // Computed states
    isExporting: exportProgress.status === "exporting",
    isCompleted: exportProgress.status === "completed",
    hasError: exportProgress.status === "error",
  };
}

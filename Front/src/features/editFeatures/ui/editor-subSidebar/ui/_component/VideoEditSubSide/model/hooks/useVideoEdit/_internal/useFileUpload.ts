"use client";

import { useRef } from "react";
import { UploadedVideo } from "../../../type";
import { useUploadedVideoStore } from "../../../store/useUploadedVideoStore";

// Constants
const VIDEO_METADATA_TIMEOUT = 10000; // 10 seconds

/**
 * Loads video metadata with error handling and timeout
 */
async function loadVideoMetadata(file: File, videoUrl: string): Promise<{
  duration: number;
  width: number;
  height: number;
} | null> {
  const videoElement = document.createElement("video");
  videoElement.preload = "metadata";
  videoElement.src = videoUrl;

  try {
    const metadata = await Promise.race([
      // Promise for successful metadata loading
      new Promise<{ duration: number; width: number; height: number }>((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          resolve({
            duration: videoElement.duration,
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
          });
        };

        videoElement.onerror = () => {
          reject(new Error(`Failed to load video metadata: ${file.name}`));
        };
      }),
      // Timeout promise
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Video metadata loading timeout: ${file.name}`));
        }, VIDEO_METADATA_TIMEOUT);
      }),
    ]);

    return metadata;
  } catch (error) {
    console.error("Video metadata loading error:", error);
    return null;
  } finally {
    // Cleanup: Remove event listeners and free resources
    videoElement.onloadedmetadata = null;
    videoElement.onerror = null;
    videoElement.src = "";
    videoElement.load();
  }
}

export function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { videos, addVideo, removeVideo } = useUploadedVideoStore();

  const handleFileSelect = async (
    files: FileList | null,
    addVideoToTimeline: (videoData: { url: string; duration: number; width: number; height: number }) => void
  ) => {
    if (!files) return;

    const videoFiles = Array.from(files).filter((file) => file.type.startsWith("video/"));

    for (const file of videoFiles) {
      const videoUrl = URL.createObjectURL(file);

      try {
        const metadata = await loadVideoMetadata(file, videoUrl);

        if (!metadata) {
          // Skip this file if metadata loading failed
          console.warn(`Skipping file due to metadata loading failure: ${file.name}`);
          URL.revokeObjectURL(videoUrl);
          continue;
        }

        const videoData = {
          url: videoUrl,
          ...metadata,
        };

        const uploadedVideo: UploadedVideo = {
          id: crypto.randomUUID(),
          file,
          ...videoData,
        };

        addVideo(uploadedVideo);
        addVideoToTimeline(videoData);
      } catch (error) {
        console.error(`Error processing video file: ${file.name}`, error);
        URL.revokeObjectURL(videoUrl);
      }
    }
  };

  return {
    fileInputRef,
    videos,
    handleFileSelect,
    removeVideo,
  };
}

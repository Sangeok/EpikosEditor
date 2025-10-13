"use client";

import { useRef } from "react";
import { UploadedVideo } from "../type";
import { useUploadedVideoStore } from "../store/useUploadedVideoStore";

export function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { videos, addVideo, removeVideo } = useUploadedVideoStore();

  const handleFileSelect = async (
    files: FileList | null,
    addVideoToTimeLine: (videoData: { url: string; duration: number; width: number; height: number }) => void
  ) => {
    if (!files) return;

    const videoFiles = Array.from(files).filter((file) => file.type.startsWith("video/"));

    for (const file of videoFiles) {
      const videoUrl = URL.createObjectURL(file);

      // Create video element to get metadata
      const videoElement = document.createElement("video");
      videoElement.src = videoUrl;

      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => {
          const videoData = {
            url: videoUrl,
            duration: videoElement.duration,
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
          };

          const uploadedVideo: UploadedVideo = {
            id: `video-${Date.now()}-${Math.random()}`,
            file,
            ...videoData,
          };

          addVideo(uploadedVideo);
          addVideoToTimeLine(videoData);
          resolve();
        };
      });
    }
  };

  return {
    fileInputRef,
    videos,
    handleFileSelect,
    removeVideo,
  };
}

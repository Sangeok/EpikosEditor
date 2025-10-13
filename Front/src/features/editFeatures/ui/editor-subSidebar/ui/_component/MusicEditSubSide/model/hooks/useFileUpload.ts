import { useState, useRef } from "react";
import { useUploadedAudioStore } from "../store/useUploadedAudioStore";

export function useFileUpload() {
  const { audios, addAudio, removeAudio } = useUploadedAudioStore();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null, onProcessFile: (file: File) => void) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("audio/")) {
        alert("Please select a valid audio file");
        return;
      }
      onProcessFile(file);
    });
  };

  return {
    audios,
    loading,
    setLoading,
    fileInputRef,
    removeAudio,
    addAudio,
    handleFileSelect,
  };
}

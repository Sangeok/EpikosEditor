"use client";

import { useFileUpload } from "./useFileUpload";
import { useDragAndDrop } from "../../../../../model/hooks";
import { useAudioPreview } from "./useAudioPreview";
import { useAudioFileProcessor } from "./useAudioFileProcessor";
import { AudioEditState, AudioEditActions, UploadedAudio } from "../types";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { createAudioElement } from "../../../../../../../../../shared/lib/audioElementFactory";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export function useAudioEdit(): {
  state: AudioEditState;
  actions: AudioEditActions;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
} {
  const { media, addAudioElement } = useMediaStore();
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);

  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const audioPreview = useAudioPreview();
  const audioProcessor = useAudioFileProcessor();

  const handleFileSelect = (files: FileList | null) => {
    fileUpload.handleFileSelect(files, (file) => {
      audioProcessor.processAudioFile(
        file,
        () => fileUpload.setLoading(true),
        (audio) => {
          fileUpload.addAudio(audio);
          fileUpload.setLoading(false);
        },
        () => fileUpload.setLoading(false)
      );
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    dragAndDrop.handleDrop(e, (files) => {
      handleFileSelect(files);
    });
  };

  const addAudioToTimeLine = async (audio: UploadedAudio) => {
    const existingAudio = media.audioElement.find((el) => el.url === audio.url);

    if (existingAudio) {
      alert("Audio already exists in the timeline");
      return;
    }

    const laneId = activeLaneByType.Audio;
    const audioElement = await createAudioElement(audio.url, laneId, "user");
    addAudioElement(audioElement);
  };

  const removeAudio = (index: number) => {
    audioPreview.stopPreviewForIndex(index);
    fileUpload.removeAudio(index);
  };

  return {
    fileInputRef: fileUpload.fileInputRef,
    state: {
      uploadedAudios: fileUpload.audios,
      dragActive: dragAndDrop.dragActive,
      loading: fileUpload.loading,
      previewAudio: audioPreview.previewAudio,
      playingIndex: audioPreview.playingIndex,
    },
    actions: {
      handleFileSelect,
      handleDrag: dragAndDrop.handleDrag,
      handleDrop,
      togglePreview: audioPreview.togglePreview,
      removeAudio,
      addAudioToTimeLine,
    },
  };
}

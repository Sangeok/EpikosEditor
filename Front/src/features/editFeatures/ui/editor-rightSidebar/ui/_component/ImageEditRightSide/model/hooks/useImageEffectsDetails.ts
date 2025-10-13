"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";

export const useImageEffectsDetails = () => {
  const { updateAllMediaElement } = useMediaStore();
  const selectedTrackId = useSelectedTrackStore((s) => s.selectedTrackId);

  const handleFadeDurationChange = (value: number, field: "fadeInDuration" | "fadeOutDuration") => {
    updateAllMediaElement(selectedTrackId as string, "image", { [field]: value });
  };

  return { handleFadeDurationChange };
};

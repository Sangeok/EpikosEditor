"use client";

import { useCallback } from "react";
import { EffectType } from "@/entities/media/types";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { DEFAULT_FADE_DURATION, DEFAULT_ZOOM_DURATION } from "../../constants";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";

export function useImageEffects() {
  const { updateAllMediaElement } = useMediaStore();
  const selectedTrackId: string | null = useSelectedTrackStore((s) => s.selectedTrackId);

  const handleInEffectChange = useCallback(
    (inEffect: EffectType) => {
      if (inEffect === "fadeIn") {
        updateAllMediaElement(selectedTrackId as string, "image", {
          fadeIn: true,
          fadeInDuration: DEFAULT_FADE_DURATION,
        });
      }
    },
    [updateAllMediaElement, selectedTrackId]
  );

  const handleOutEffectChange = useCallback(
    (outEffect: EffectType) => {
      if (outEffect === "fadeOut") {
        updateAllMediaElement(selectedTrackId as string, "image", {
          fadeOut: true,
          fadeOutDuration: DEFAULT_FADE_DURATION,
        });
      }
    },
    [updateAllMediaElement, selectedTrackId]
  );

  const handleFadeDurationChange = useCallback(
    (value: number, field: "fadeInDuration" | "fadeOutDuration") => {
      updateAllMediaElement(selectedTrackId as string, "image", { [field]: value });
    },
    [updateAllMediaElement, selectedTrackId]
  );

  // Zoom effect handlers
  const handleZoomEffectChange = useCallback(
    (zoomEffect: EffectType) => {
      if (zoomEffect === "Zoom In" || zoomEffect === "Zoom Out") {
        updateAllMediaElement(selectedTrackId as string, "image", {
          zoom: true,
          zoomDirection: zoomEffect,
          zoomDuration: DEFAULT_ZOOM_DURATION,
        });
      } else if (zoomEffect === "none") {
        updateAllMediaElement(selectedTrackId as string, "image", {
          zoom: false,
          zoomDirection: undefined,
          zoomDuration: undefined,
        });
      }
    },
    [updateAllMediaElement, selectedTrackId]
  );

  const handleZoomDurationChange = useCallback(
    (value: number) => {
      updateAllMediaElement(selectedTrackId as string, "image", { zoomDuration: value });
    },
    [updateAllMediaElement, selectedTrackId]
  );

  return {
    handleInEffectChange,
    handleOutEffectChange,
    handleFadeDurationChange,
    handleZoomEffectChange,
    handleZoomDurationChange,
  };
}

"use client";

import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { MediaElement } from "@/entities/media/types";
import { useCallback, useRef } from "react";
import { useSmartGuideStore } from "@/features/editFeatures/ui/player/model/hooks/useSmartGuideStore";
import { useSmartGuideSync } from "../model/hooks/useSmartGuideSync";
import { CalculateFadeOpacity } from "../lib/calculateFadeOpacity";

interface ImageWithFadeProps {
  imageElement: MediaElement;
  durationInFrames: number;
  fps: number;
}

export const ImageWithFade = ({ imageElement, durationInFrames, fps }: ImageWithFadeProps) => {
  const frame = useCurrentFrame();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isDraggingText = useSmartGuideStore((state) => state.isDraggingText);
  const draggingTextRect = useSmartGuideStore((state) => state.draggingTextRect);

  // Custom hooks for separated concerns
  const opacity = CalculateFadeOpacity(imageElement, durationInFrames, fps, frame);
  const { clearSmartGuides } = useSmartGuideSync(containerRef, isDraggingText, draggingTextRect);

  const handleMouseLeave = useCallback(() => {
    clearSmartGuides();
  }, [clearSmartGuides]);

  return (
    <AbsoluteFill
      ref={containerRef}
      onMouseLeave={handleMouseLeave}
      className="h-full"
      style={{
        zIndex: 100,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <Img
        style={{
          pointerEvents: "none",
          zIndex: 100,
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
        src={imageElement.url || ""}
        alt={"image"}
      />
    </AbsoluteFill>
  );
};

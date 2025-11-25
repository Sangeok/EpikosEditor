"use client";

import { Img, useCurrentFrame } from "remotion";
import { MediaElement } from "@/entities/media/types";
import { calculateZoomScale } from "../lib/calculateZoomScale";

interface ImageWithZoomProps {
  imageElement: MediaElement;
  durationInFrames: number;
  fps: number;
  style?: React.CSSProperties;
}

export const ImageWithZoom = ({ imageElement, durationInFrames, fps, style }: ImageWithZoomProps) => {
  const frame = useCurrentFrame();
  const scale = calculateZoomScale(imageElement, durationInFrames, fps, frame);

  return (
    <Img
      style={{
        pointerEvents: "none",
        zIndex: 100,
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        width: "1080px",
        height: "1920px",
        transform: `scale(${scale})`,
        transformOrigin: "center center", // 앵커 포인트 중앙 고정
        ...style,
      }}
      src={imageElement.url || ""}
      alt="image"
    />
  );
};

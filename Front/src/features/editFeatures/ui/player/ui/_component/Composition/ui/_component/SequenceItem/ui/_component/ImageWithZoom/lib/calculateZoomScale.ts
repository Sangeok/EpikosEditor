import { MediaElement } from "@/entities/media/types";
import { interpolate } from "remotion";

export function calculateZoomScale(
  imageElement: MediaElement,
  durationInFrames: number,
  fps: number,
  frame: number
): number {
  if (!imageElement.zoom || !imageElement.zoomDirection) {
    return 1;
  }

  const zoomDuration = imageElement.zoomDuration || 1.0;
  const zoomFrames = Math.floor(zoomDuration * fps);

  // 전체 클립 동안 줌 적용
  const effectiveFrames = Math.min(zoomFrames, durationInFrames);

  if (imageElement.zoomDirection === "Zoom In") {
    // 1.0 → 1.2 (확대)
    return interpolate(frame, [0, effectiveFrames], [1, 1.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (imageElement.zoomDirection === "Zoom Out") {
    // 1.2 → 1.0 (축소)
    return interpolate(frame, [0, effectiveFrames], [1.2, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return 1;
}

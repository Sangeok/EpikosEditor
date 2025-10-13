import { MediaElement } from "@/entities/media/types";
import { interpolate } from "remotion";

export function CalculateFadeOpacity(
  imageElement: MediaElement,
  durationInFrames: number,
  fps: number,
  frame: number
): number {
  let opacity = 1;

  // Fade in
  if (imageElement.fadeIn) {
    const fadeInFrames = Math.floor((imageElement.fadeInDuration || 0.5) * fps);
    opacity = interpolate(frame, [0, fadeInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Fade out
  if (imageElement.fadeOut) {
    const fadeOutFrames = Math.floor((imageElement.fadeOutDuration || 0.5) * fps);
    const fadeOutStartFrame = durationInFrames - fadeOutFrames;
    const fadeOutOpacity = interpolate(frame, [fadeOutStartFrame, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    opacity = Math.min(opacity, fadeOutOpacity);
  }

  return opacity;
}

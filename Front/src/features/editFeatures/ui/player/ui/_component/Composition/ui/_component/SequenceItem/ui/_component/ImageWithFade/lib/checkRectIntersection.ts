import { ImageBounds } from "@/features/editFeatures/ui/player/model/type";

export function CheckRectIntersection(
  textRect: DOMRect | { left: number; right: number; top: number; bottom: number },
  imageBounds: ImageBounds
): boolean {
  return !(
    textRect.right < imageBounds.left ||
    textRect.left > imageBounds.right ||
    textRect.bottom < imageBounds.top ||
    textRect.top > imageBounds.bottom
  );
}

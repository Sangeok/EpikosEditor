import { ImageBounds } from "@/features/editFeatures/ui/player/model/type";

export function CalculateImageBounds(img: HTMLImageElement, compositionContainer: HTMLDivElement): ImageBounds | null {
  const rect = img.getBoundingClientRect();
  const compositionRect = compositionContainer.getBoundingClientRect();

  const scaleX = compositionRect.width / compositionContainer.offsetWidth || 1;
  const scaleY = compositionRect.height / compositionContainer.offsetHeight || 1;

  const left = (rect.left - compositionRect.left) / scaleX;
  const right = (rect.right - compositionRect.left) / scaleX;
  const top = (rect.top - compositionRect.top) / scaleY;
  const bottom = (rect.bottom - compositionRect.top) / scaleY;

  return {
    left,
    right,
    top,
    bottom,
    height: bottom - top,
  };
}

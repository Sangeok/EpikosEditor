import { EdgeInfo, ImageBounds } from "@/features/editFeatures/ui/player/model/type";

export function FindNearestEdge(
  textRect: DOMRect | { left: number; right: number; top: number; bottom: number },
  imageBounds: ImageBounds
): EdgeInfo {
  const t = textRect;

  const distToLeft = Math.min(Math.abs(t.left - imageBounds.left), Math.abs(t.right - imageBounds.left));
  const distToRight = Math.min(Math.abs(t.left - imageBounds.right), Math.abs(t.right - imageBounds.right));
  const distToTop = Math.min(Math.abs(t.top - imageBounds.top), Math.abs(t.bottom - imageBounds.top));
  const distToBottom = Math.min(Math.abs(t.top - imageBounds.bottom), Math.abs(t.bottom - imageBounds.bottom));

  const edges: EdgeInfo[] = [
    { key: "left", distance: distToLeft, position: imageBounds.left },
    { key: "right", distance: distToRight, position: imageBounds.right },
    { key: "top", distance: distToTop, position: imageBounds.top },
    { key: "bottom", distance: distToBottom, position: imageBounds.bottom },
  ];

  edges.sort((a, b) => a.distance - b.distance);

  return edges[0];
}

import { DraggingTextRect, useSmartGuideStore } from "@/features/editFeatures/ui/player/model/hooks/useSmartGuideStore";
import { EdgeInfo, EdgeKey, ImageBounds } from "@/features/editFeatures/ui/player/model/type";
import { useCallback, useEffect, useRef } from "react";
import { CalculateImageBounds } from "../../lib/calculateImageBounds";
import { CheckRectIntersection } from "../../lib/checkRectIntersection";
import { FindNearestEdge } from "../../lib/findNearestEdge";
import { IsNearEdge } from "../../lib/isNearEdge";

export function useSmartGuideSync(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isDraggingText: boolean,
  draggingTextRect: DraggingTextRect | null
) {
  const setShowVerticalSmartGuide = useSmartGuideStore((state) => state.setShowVerticalSmartGuide);
  const setShowHorizonSmartGuide = useSmartGuideStore((state) => state.setShowHorizonSmartGuide);
  const setSmartGuides = useSmartGuideStore((state) => state.setSmartGuides);
  const setNearObjEdgeData = useSmartGuideStore((state) => state.setNearObjEdgeData);

  const wasNearRef = useRef(false);
  const lastEdgeRef = useRef<EdgeKey | null>(null);

  const EDGE_NEAR_PX = 15;

  const clearSmartGuides = useCallback(() => {
    wasNearRef.current = false;
    lastEdgeRef.current = null;
    setSmartGuides(false, false);
    setNearObjEdgeData(null);
  }, [setSmartGuides, setNearObjEdgeData]);

  const handleNearEdge = useCallback(
    (edge: EdgeInfo, imageBounds: ImageBounds) => {
      wasNearRef.current = true;

      // Only update if edge changed
      if (lastEdgeRef.current === edge.key) return;

      const isVerticalEdge = edge.key === "left" || edge.key === "right";
      const edgeData = {
        edgeKey: edge.key,
        distance: edge.distance,
        edgeXorYPosition: edge.position,
        top: imageBounds.top,
        height: imageBounds.height,
      };

      if (isVerticalEdge) {
        setShowVerticalSmartGuide(true);
      } else {
        setShowHorizonSmartGuide(true);
      }

      setNearObjEdgeData(edgeData);
      lastEdgeRef.current = edge.key;
    },
    [setShowVerticalSmartGuide, setShowHorizonSmartGuide, setNearObjEdgeData]
  );

  useEffect(() => {
    // Early return: Not dragging or no text rect
    const shouldClearGuides = !isDraggingText || !draggingTextRect;
    if (shouldClearGuides) {
      if (wasNearRef.current) {
        clearSmartGuides();
      }
      return;
    }

    // Get DOM elements
    const container = containerRef.current;
    if (!container) return;

    const compositionContainer = document.getElementById("composition-container") as HTMLDivElement | null;
    if (!compositionContainer) return;

    const img = container.querySelector("img") as HTMLImageElement | null;
    if (!img) return;

    // Calculate positions
    const imageBounds = CalculateImageBounds(img, compositionContainer);
    if (!imageBounds) return;

    // Check intersection
    const hasIntersection = CheckRectIntersection(draggingTextRect, imageBounds);
    if (!hasIntersection) {
      if (wasNearRef.current) {
        clearSmartGuides();
      }
      return;
    }

    // Find nearest edge
    const nearestEdge = FindNearestEdge(draggingTextRect, imageBounds);
    const isNear = IsNearEdge(nearestEdge.distance, EDGE_NEAR_PX);

    if (isNear) {
      handleNearEdge(nearestEdge, imageBounds);
    } else if (wasNearRef.current) {
      clearSmartGuides();
    }
  }, [containerRef, isDraggingText, draggingTextRect, clearSmartGuides, handleNearEdge]);

  return { clearSmartGuides };
}

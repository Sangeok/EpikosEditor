import { useState, useCallback } from "react";
import { MoveDragState, DropPreview } from "../../../types";

const initialMoveDragState: MoveDragState = {
  isDragging: false,
  elementId: null,
  startX: 0,
  originalStartTime: 0,
  originalEndTime: 0,
  ghostPosition: null,
};

const initialDropPreview: DropPreview = {
  isVisible: false,
  targetTime: 0,
  elementId: null,
};

export function useDragState() {
  const [moveDragState, setMoveDragState] = useState<MoveDragState>(initialMoveDragState);
  const [dropPreview, setDropPreview] = useState<DropPreview>(initialDropPreview);

  const startDragging = useCallback(
    (elementId: string, startX: number, originalStartTime: number, originalEndTime: number, ghostPosition: number) => {
      setMoveDragState({
        isDragging: true,
        elementId,
        startX,
        originalStartTime,
        originalEndTime,
        ghostPosition,
      });

      setDropPreview({
        isVisible: true,
        targetTime: originalStartTime,
        elementId,
      });
    },
    []
  );

  const updateDragPositions = useCallback((ghostPosition: number, targetTime: number) => {
    setMoveDragState((prev) => ({
      ...prev,
      ghostPosition,
    }));

    setDropPreview((prev) => ({
      ...prev,
      targetTime,
    }));
  }, []);

  const resetDragState = useCallback(() => {
    setMoveDragState(initialMoveDragState);
    setDropPreview(initialDropPreview);
  }, []);

  const isDraggingElement = Boolean(moveDragState.isDragging && moveDragState.elementId);

  return {
    moveDragState,
    dropPreview,
    isDraggingElement,
    startDragging,
    updateDragPositions,
    resetDragState,
  };
}

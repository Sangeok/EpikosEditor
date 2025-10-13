import { useState, useCallback } from "react";
import { TrackElement } from "@/entities/media/types";
import { ResizeDragState, ResizeDragType } from "../../../types";

const initialDragState: ResizeDragState = {
  isDragging: false,
  elementId: null,
  dragType: null,
  startX: 0,
  originalStartTime: 0,
  originalEndTime: 0,
};

export function useResizeDragState<T extends TrackElement>() {
  const [dragState, setDragState] = useState<ResizeDragState>(initialDragState);

  const startDrag = useCallback(
    (
      elementId: string,
      dragType: ResizeDragType,
      startX: number,
      element: T
    ) => {
      setDragState({
        isDragging: true,
        elementId,
        dragType,
        startX,
        originalStartTime: element.startTime,
        originalEndTime: element.endTime,
        maxEndTimeDuringDrag: element.endTime,
      });
    },
    []
  );

  const endDrag = useCallback(() => {
    setDragState(initialDragState);
  }, []);

  const updateMaxEndTime = useCallback((endTime: number) => {
    setDragState((prev) => ({
      ...prev,
      maxEndTimeDuringDrag: endTime,
    }));
  }, []);

  return {
    dragState,
    startDrag,
    endDrag,
    updateMaxEndTime,
  };
}

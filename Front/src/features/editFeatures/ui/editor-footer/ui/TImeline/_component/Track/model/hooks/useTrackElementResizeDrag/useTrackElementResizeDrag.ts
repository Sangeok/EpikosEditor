import { useCallback } from "react";
import { TrackElement } from "@/entities/media/types";
import { pixelsToTime, roundTime } from "@/shared/lib/timeConversion";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { ResizeDragType } from "../../types";
import { validateStartTime, validateEndTime } from "./_internal/timeValidation";
import { createElementConstraints } from "./_internal/elementConstraints";
import { createElementUpdater } from "./_internal/elementUpdater";
import { useMouseEvents } from "./_internal/mouseEventHandler";
import { useResizeDragState } from "./_internal/resizeDragState";
import { useSnapGuide } from "./_internal/useSnapGuide";

interface UseTrackElementResizeDragProps<T extends TrackElement> {
  SelectedElements: T[];
  updateSelectedElements: (elementId: string, updates: Partial<T>) => void;
  updateMultipleSelectedElements: (
    updates: Array<{
      id: string;
      updates: Partial<T>;
    }>
  ) => void;
}

export function useTrackElementResizeDrag<T extends TrackElement>({
  SelectedElements,
  updateSelectedElements,
  updateMultipleSelectedElements,
}: UseTrackElementResizeDragProps<T>) {
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);
  const { updateSnapGuide, clearSnapGuide } = useSnapGuide(pixelsPerSecond);

  const { getSortedElements, getMinStartTime, adjustSubsequentElements } = createElementConstraints(SelectedElements);
  const { dragState, startDrag, endDrag, updateMaxEndTime } = useResizeDragState<T>();
  const { updateElementTimeProperties, updateMultipleElementsTimeProperties } = createElementUpdater({
    updateSelectedElements,
    updateMultipleSelectedElements,
  });

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, elementId: string, dragType: ResizeDragType) => {
      e.stopPropagation();
      const element = SelectedElements.find((el) => el.id === elementId);

      if (!element) return;

      const isVideoElement = element.type === "video";
      if (isVideoElement) return;

      startDrag(elementId, dragType, e.clientX, element);
    },
    [SelectedElements, startDrag]
  );

  const handleLeftResize = useCallback(
    (deltaTime: number) => {
      if (!dragState.elementId) return;

      const sortedElements = getSortedElements();
      const minStartTime = getMinStartTime(dragState.elementId, sortedElements);
      const desiredStartTime = dragState.originalStartTime + deltaTime;
      // Guide snap for left edge
      const snappedStart = updateSnapGuide("start", roundTime(desiredStartTime), dragState.elementId);
      const candidateStart = snappedStart ?? desiredStartTime;
      const newStartTime = validateStartTime(candidateStart, minStartTime, dragState.originalEndTime);

      updateElementTimeProperties(dragState.elementId, newStartTime, dragState.originalEndTime);
    },
    [dragState, getSortedElements, getMinStartTime, updateElementTimeProperties, updateSnapGuide]
  );

  const handleRightResize = useCallback(
    (deltaTime: number) => {
      if (!dragState.elementId) return;

      // user wants to extend the end time
      const desiredEndTime = dragState.originalEndTime + deltaTime;
      // Guide snap for right edge
      const snappedEnd = updateSnapGuide("end", roundTime(desiredEndTime), dragState.elementId);
      const endCandidate = snappedEnd ?? desiredEndTime;
      const validatedEndTime = validateEndTime(endCandidate, dragState.originalStartTime);
      const finalEndTime = roundTime(validatedEndTime);

      // check if the end time is extending beyond the max end time reached during the drag
      const isExtendingBeyondMaxReachedDuringDrag =
        finalEndTime > (dragState.maxEndTimeDuringDrag ?? dragState.originalEndTime);

      const sortedElements = getSortedElements();
      const adjustments = isExtendingBeyondMaxReachedDuringDrag
        ? adjustSubsequentElements(dragState.elementId, finalEndTime, sortedElements)
        : [];

      updateMultipleElementsTimeProperties(dragState.elementId, finalEndTime, dragState.originalStartTime, adjustments);

      if (isExtendingBeyondMaxReachedDuringDrag) {
        updateMaxEndTime(finalEndTime);
      }
    },
    [
      dragState,
      getSortedElements,
      adjustSubsequentElements,
      updateSnapGuide,
      updateMultipleElementsTimeProperties,
      updateMaxEndTime,
    ]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.elementId) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaTime = pixelsToTime(deltaX, pixelsPerSecond);

      const isLeftResize = dragState.dragType === "left";
      const isRightResize = dragState.dragType === "right";

      if (isLeftResize) {
        handleLeftResize(deltaTime);
      } else if (isRightResize) {
        handleRightResize(deltaTime);
      }

      // Visual vertical snap guide while resizing
      const currentStart = isLeftResize
        ? roundTime(dragState.originalStartTime + deltaTime)
        : dragState.originalStartTime;
      const currentEnd = isRightResize ? roundTime(dragState.originalEndTime + deltaTime) : dragState.originalEndTime;

      updateSnapGuide(isLeftResize ? "start" : "end", isLeftResize ? currentStart : currentEnd, dragState.elementId);
    },
    [dragState, pixelsPerSecond, handleLeftResize, handleRightResize, updateSnapGuide]
  );

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      endDrag();
      clearSnapGuide();
    }
  }, [dragState.isDragging, endDrag, clearSnapGuide]);

  useMouseEvents(dragState, handleMouseMove, handleMouseUp);

  return {
    dragState,
    handleResizeStart,
  };
}

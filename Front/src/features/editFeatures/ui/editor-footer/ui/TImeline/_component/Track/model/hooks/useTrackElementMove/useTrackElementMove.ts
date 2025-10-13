"use client";

import { useCallback, useEffect, useMemo } from "react";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { TrackElement } from "@/entities/media/types";
import { createElementPositioner } from "./_internal/elementPositioning";
import { useDragState } from "./_internal/useDragState";
import { pixelsToTime, roundTime, timeToPixels } from "@/shared/lib/timeConversion";
import { useSnapGuide } from "./_internal/useSnapGuide";

interface UseTrackElementMoveProps<T extends TrackElement> {
  SelectedElements: T[];
  updateSelectedElements: (elementId: string, updates: Partial<T>) => void;
}

export function useTrackElementMove<T extends TrackElement>({
  SelectedElements,
  updateSelectedElements,
}: UseTrackElementMoveProps<T>) {
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);
  const { updateSnapGuide, clearSnapGuide } = useSnapGuide(pixelsPerSecond);

  const { moveDragState, dropPreview, isDraggingElement, startDragging, updateDragPositions, resetDragState } =
    useDragState();

  const positioner = useMemo(() => createElementPositioner(SelectedElements), [SelectedElements]);

  const handleMoveStart = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();

      const element = SelectedElements.find((el) => el.id === elementId);
      if (!element) return;

      const elementStartTime = roundTime(element.startTime);
      const elementEndTime = roundTime(element.endTime);
      const initialGhostPosition = timeToPixels(elementStartTime, pixelsPerSecond);

      startDragging(elementId, e.clientX, elementStartTime, elementEndTime, initialGhostPosition);
    },
    [SelectedElements, pixelsPerSecond, startDragging]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingElement) return;

      const deltaX = e.clientX - moveDragState.startX;
      const deltaTime = pixelsToTime(deltaX, pixelsPerSecond);
      const elementDuration = roundTime(moveDragState.originalEndTime - moveDragState.originalStartTime);

      const rawTargetTime = roundTime(moveDragState.originalStartTime + deltaTime);

      // Vertical guide snap calculation (based on other element edges). If there's a return value, snap to that time
      const guideSnapStart = updateSnapGuide(rawTargetTime, elementDuration, moveDragState.elementId!);

      // Final application of overlap prevention rules: calculate valid drop time based on guide snap
      const baseSnapStart = guideSnapStart ?? rawTargetTime;
      const finalSnapStart = positioner.computeSnapPosition(baseSnapStart, elementDuration, moveDragState.elementId!);
      const ghostPixelPosition = timeToPixels(finalSnapStart, pixelsPerSecond);

      // Maintain dropPreview.targetTime as snapped time to ensure same result at mouse up
      updateDragPositions(ghostPixelPosition, baseSnapStart);
    },
    [isDraggingElement, moveDragState, positioner, updateDragPositions, pixelsPerSecond, updateSnapGuide]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDraggingElement || !dropPreview.isVisible) {
      resetDragState();
      clearSnapGuide();
      return;
    }

    const elementDuration = roundTime(moveDragState.originalEndTime - moveDragState.originalStartTime);
    const rawStartTime = roundTime(dropPreview.targetTime);

    const finalStartTime = positioner.computeSnapPosition(rawStartTime, elementDuration, moveDragState.elementId!);
    const finalEndTime = roundTime(finalStartTime + elementDuration);

    updateSelectedElements(moveDragState.elementId!, {
      startTime: finalStartTime,
      endTime: finalEndTime,
      duration: elementDuration,
    } as Partial<T>);

    resetDragState();
    clearSnapGuide();
  }, [
    isDraggingElement,
    dropPreview.isVisible,
    moveDragState,
    dropPreview.targetTime,
    positioner,
    updateSelectedElements,
    resetDragState,
    clearSnapGuide,
  ]);

  // Global mouse event listeners
  useEffect(() => {
    if (moveDragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [moveDragState.isDragging, handleMouseMove, handleMouseUp]);

  return {
    moveDragState,
    dropPreview,
    handleMoveStart,
  };
}

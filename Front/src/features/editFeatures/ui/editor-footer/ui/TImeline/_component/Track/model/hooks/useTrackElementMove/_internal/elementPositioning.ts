import { roundTime } from "@/shared/lib/timeConversion";
import { createOverlapDetector } from "./overlapDetection";
import { TrackElement } from "@/entities/media/types";

// Creates element positioner for timeline drag-and-drop positioning
export function createElementPositioner<T extends TrackElement>(elements: T[]) {
  const detector = createOverlapDetector(elements);
  const { hasOverlapAt, findClosestOverlappingElement } = detector;

  // Finds valid drop position without overlaps
  function calculateValidDropTime(
    targetStartTime: number, // dragging element start time(original start time + delta time)
    duration: number,
    excludeId: string
  ): number {
    const sortedElements = detector.getFilteredAndSortedElements(excludeId);
    let validStartTime = roundTime(Math.max(0, targetStartTime));
    const roundedDuration = roundTime(duration);

    for (const element of sortedElements) {
      const elementStart = roundTime(element.startTime);
      const elementEnd = roundTime(element.endTime);

      const wouldOverlapWithElement = validStartTime < elementEnd && validStartTime + roundedDuration > elementStart;

      if (wouldOverlapWithElement) {
        validStartTime = roundTime(elementEnd);
      }
    }

    return validStartTime;
  }

  // Calculates smart snap position relative to closest overlapping element
  function computeSnapPosition(targetStartTime: number, duration: number, excludeId: string): number {
    const closestOverlappingElement = findClosestOverlappingElement(targetStartTime, duration, excludeId);

    if (!closestOverlappingElement) {
      return calculateValidDropTime(targetStartTime, duration, excludeId);
    }

    const overlappingElementCenter = roundTime(
      (closestOverlappingElement.startTime + closestOverlappingElement.endTime) / 2
    );
    const targetElementCenter = roundTime(targetStartTime + duration / 2);
    const isTargetLeftOfOverlapping = targetElementCenter < overlappingElementCenter;

    let proposedStartTime: number;

    if (isTargetLeftOfOverlapping) {
      proposedStartTime = roundTime(Math.max(0, roundTime(closestOverlappingElement.startTime) - duration));
    } else {
      proposedStartTime = roundTime(closestOverlappingElement.endTime);
    }

    const proposedPositionHasOverlap = hasOverlapAt(proposedStartTime, duration, excludeId);

    if (proposedPositionHasOverlap) {
      const fallbackStartTime = isTargetLeftOfOverlapping
        ? roundTime(closestOverlappingElement.endTime)
        : roundTime(Math.max(0, roundTime(closestOverlappingElement.startTime) - duration));

      const fallbackPositionIsValid = !hasOverlapAt(fallbackStartTime, duration, excludeId);

      if (fallbackPositionIsValid) {
        return fallbackStartTime;
      }

      return calculateValidDropTime(targetStartTime, duration, excludeId);
    }

    return proposedStartTime;
  }

  return {
    calculateValidDropTime,
    computeSnapPosition,
  };
}

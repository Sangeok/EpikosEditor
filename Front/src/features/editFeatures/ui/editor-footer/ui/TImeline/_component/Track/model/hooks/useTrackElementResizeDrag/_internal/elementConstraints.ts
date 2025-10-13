import { TrackElement } from "@/entities/media/types";
import { ElementAdjustment } from "../../../types";

// Creates constraint management functions for timeline element positioning
export function createElementConstraints<T extends TrackElement>(
  elements: T[]
) {
  // Get elements sorted by start time for position calculations
  function getSortedElements(): T[] {
    return [...elements].sort((a, b) => a.startTime - b.startTime);
  }

  // Get minimum allowed start time to prevent overlap with previous element
  function getMinStartTime(elementId: string, sortedElements: T[]): number {
    const currentIndex = sortedElements.findIndex((el) => el.id === elementId);
    if (currentIndex === -1 || currentIndex === 0) return 0;

    const prevElement = sortedElements[currentIndex - 1];
    return prevElement.endTime;
  }

  // Calculate adjustments needed for subsequent elements to prevent overlaps
  function adjustSubsequentElements(
    elementId: string,
    newEndTime: number,
    sortedElements: T[]
  ): ElementAdjustment[] {
    const currentIndex = sortedElements.findIndex((el) => el.id === elementId);
    if (currentIndex === -1) return [];

    const adjustments: ElementAdjustment[] = [];
    let prevEnd = newEndTime;

    // Check each element after the current one for overlaps
    for (let i = currentIndex + 1; i < sortedElements.length; i++) {
      const currentElement = sortedElements[i];
      const overlap = prevEnd - currentElement.startTime;
      const shift = Math.max(overlap, 0);
      const hasOverlapRequiringAdjustment = shift > 0;

      if (hasOverlapRequiringAdjustment) {
        // Push overlapping element to the right
        const adjustment: ElementAdjustment = {
          id: currentElement.id,
          startTime: currentElement.startTime + shift,
          endTime: currentElement.endTime + shift,
          duration: currentElement.endTime - currentElement.startTime,
        };
        adjustments.push(adjustment);
        prevEnd = adjustment.endTime;
      } else {
        prevEnd = currentElement.endTime;
      }
    }

    return adjustments;
  }

  return {
    getSortedElements,
    getMinStartTime,
    adjustSubsequentElements,
  };
}

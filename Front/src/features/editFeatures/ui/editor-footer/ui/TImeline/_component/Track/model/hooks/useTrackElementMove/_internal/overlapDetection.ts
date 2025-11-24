import { TrackElement } from "@/entities/media/types";
import { roundTime } from "@/shared/lib/timeConversion";

interface TimeRange {
  start: number;
  end: number;
}

// Create a time range object
function createTimeRange(startTime: number, duration: number): TimeRange {
  return {
    start: roundTime(startTime),
    end: roundTime(startTime + duration),
  };
}

// Extract the time range of the timeline element
function getElementTimeRange(element: TrackElement): TimeRange {
  return {
    start: roundTime(element.startTime),
    end: roundTime(element.endTime),
  };
}

// Judge if the time ranges overlap
export const OVERLAP_EPS = 0.0005; // 0.5ms 허용치

function doTimeRangesOverlap(range1: TimeRange, range2: TimeRange): boolean {
  const startsBeforeOtherEnds = range1.start < range2.end - OVERLAP_EPS;
  const endsAfterOtherStarts = range1.end > range2.start + OVERLAP_EPS;
  return startsBeforeOtherEnds && endsAfterOtherStarts;
}

// Calculate the center time position of the timeline element
function calculateElementCenterTime(element: TrackElement): number {
  return roundTime((element.startTime + element.endTime) / 2);
}

// Find the closest element to the target(dragging element) center position
function findElementClosestToCenter<T extends TrackElement>(
  elements: T[],
  targetCenter: number // dragged element center time
): T | null {
  if (elements.length === 0) return null;

  let closest = elements[0];
  let minDistance = Math.abs(targetCenter - calculateElementCenterTime(closest));

  for (let i = 1; i < elements.length; i++) {
    const element = elements[i];
    const distance = Math.abs(targetCenter - calculateElementCenterTime(element));
    if (distance < minDistance) {
      closest = element;
      minDistance = distance;
    }
  }

  return closest;
}

// Factory function to provide functionality for detecting and handling overlaps of timeline elements
export function createOverlapDetector<T extends TrackElement>(elements: T[]) {
  // Return the list of elements sorted by start time
  function getFilteredAndSortedElements(excludeId?: string): T[] {
    return [...elements].filter((el) => el.id !== excludeId).sort((a, b) => a.startTime - b.startTime);
  }

  // Find all elements that overlap with the target time range
  function findOverlappingElements(targetStartTime: number, duration: number, excludeId: string): T[] {
    const sortedElements = getFilteredAndSortedElements(excludeId);
    const targetRange = createTimeRange(targetStartTime, duration);

    return sortedElements.filter((element) => {
      const elementRange = getElementTimeRange(element);
      return doTimeRangesOverlap(targetRange, elementRange);
    });
  }

  // Return the closest primary overlap element
  function findClosestOverlappingElement(targetStartTime: number, duration: number, excludeId: string): T | null {
    const overlappingElements = findOverlappingElements(targetStartTime, duration, excludeId);

    const targetCenter = roundTime(targetStartTime + duration / 2);
    return findElementClosestToCenter(overlappingElements, targetCenter);
  }

  // Check if there is an overlap at the candidate position
  function hasOverlapAt(candidateStart: number, duration: number, excludeId: string): boolean {
    const candidateRange = createTimeRange(candidateStart, duration);
    const sortedElements = getFilteredAndSortedElements(excludeId);

    return sortedElements.some((element) => {
      const elementRange = getElementTimeRange(element);
      return doTimeRangesOverlap(candidateRange, elementRange);
    });
  }

  return {
    getFilteredAndSortedElements,
    findOverlappingElements,
    findClosestOverlappingElement,
    hasOverlapAt,
    roundTime,
  };
}

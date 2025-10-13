import { TrackElement } from "@/entities/media/types";
import { timeToPixels } from "@/shared/lib/timeConversion";

export interface SnapCandidate {
  time: number; // seconds
  px: number; // x position in pixels
  sourceId: string; // element id
  edge: "start" | "end";
}

/**
 * Build snap candidates (start/end) from all visible elements across tracks.
 * Caller should pass already filtered elements if needed (e.g., viewport range).
 */
export function buildSnapCandidates(
  elementsAcrossTracks: TrackElement[],
  pixelsPerSecond: number,
  elementIdToExclude?: string | null
): SnapCandidate[] {
  const snapCandidates: SnapCandidate[] = [];
  for (const element of elementsAcrossTracks) {
    if (elementIdToExclude && element.id === elementIdToExclude) continue;
    const startPositionPx = timeToPixels(element.startTime, pixelsPerSecond);
    const endPositionPx = timeToPixels(element.endTime, pixelsPerSecond);
    snapCandidates.push({
      time: element.startTime,
      px: startPositionPx,
      sourceId: element.id,
      edge: "start",
    });
    snapCandidates.push({
      time: element.endTime,
      px: endPositionPx,
      sourceId: element.id,
      edge: "end",
    });
  }
  // Sort by pixel position for quick nearest search
  snapCandidates.sort((a, b) => a.px - b.px);
  return snapCandidates;
}

export interface NearestSnapResult {
  candidate: SnapCandidate | null;
  distancePx: number;
}

/**
 * Find nearest candidate to a given pixel x within tolerance. Returns null if none under tolerance.
 */
export function findNearestSnapCandidate(
  targetPositionPx: number,
  sortedCandidatesByPx: SnapCandidate[],
  snapTolerancePx: number
): NearestSnapResult {
  if (sortedCandidatesByPx.length === 0)
    return { candidate: null, distancePx: Infinity };

  // Binary search for insertion point (assumes candidates sorted by px asc)
  let left = 0;
  let right = sortedCandidatesByPx.length - 1;
  let insertionIndex = 0;
  while (left <= right) {
    const midIndex = (left + right) >> 1;
    if (sortedCandidatesByPx[midIndex].px < targetPositionPx)
      left = midIndex + 1;
    else {
      insertionIndex = midIndex;
      right = midIndex - 1;
    }
  }

  const candidateIndicesNearTarget = [
    insertionIndex - 1,
    insertionIndex,
    insertionIndex + 1,
  ].filter((index) => index >= 0 && index < sortedCandidatesByPx.length);
  let nearestCandidate: SnapCandidate | null = null;
  let nearestDistancePx = Infinity;
  for (const index of candidateIndicesNearTarget) {
    const candidate = sortedCandidatesByPx[index];
    const distancePx = Math.abs(candidate.px - targetPositionPx);
    if (distancePx < nearestDistancePx) {
      nearestCandidate = candidate;
      nearestDistancePx = distancePx;
    }
  }

  if (nearestCandidate && nearestDistancePx <= snapTolerancePx)
    return { candidate: nearestCandidate, distancePx: nearestDistancePx };
  return { candidate: null, distancePx: Infinity };
}

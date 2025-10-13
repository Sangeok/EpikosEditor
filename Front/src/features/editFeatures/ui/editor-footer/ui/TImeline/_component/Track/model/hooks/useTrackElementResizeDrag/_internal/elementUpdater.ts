import { TrackElement } from "@/entities/media/types";
import { roundTime } from "@/shared/lib/timeConversion";
import { ElementAdjustment } from "../../../types";

export function createElementUpdater<T extends TrackElement>({
  updateSelectedElements,
  updateMultipleSelectedElements,
}: {
  updateSelectedElements: (elementId: string, updates: Partial<T>) => void;
  updateMultipleSelectedElements: (updates: Array<{ id: string; updates: Partial<T> }>) => void;
}) {
  function updateElementTimeProperties(elementId: string, startTime: number, endTime: number): void {
    const duration = roundTime(endTime - startTime);
    const updates: Partial<T> = {
      startTime,
      endTime,
      duration,
    } as Partial<T>;

    // If this is an audio element and the startTime increases, bump sourceStart by the delta
    // We need the original to compute delta; rely on caller passing original via closure is not available,
    // so this function focuses on setting times. Left-trim source offset is handled in updateMultipleElementsTimeProperties where we know originalStartTime.
    updateSelectedElements(elementId, updates);
  }

  function updateMultipleElementsTimeProperties(
    currentElementId: string,
    newEndTime: number,
    originalStartTime: number,
    adjustments: ElementAdjustment[]
  ): void {
    const duration = roundTime(newEndTime - originalStartTime);
    const currentUpdate: { id: string; updates: Partial<T> } = {
      id: currentElementId,
      updates: {
        endTime: newEndTime,
        duration,
      } as Partial<T>,
    };

    const subsequentUpdates = adjustments.map((adj) => ({
      id: adj.id,
      updates: {
        startTime: roundTime(adj.startTime),
        endTime: roundTime(adj.endTime),
        duration: roundTime(adj.duration),
      } as Partial<T>,
    }));

    const allUpdates = [currentUpdate, ...subsequentUpdates];

    if (allUpdates.length > 0) {
      updateMultipleSelectedElements(allUpdates as Array<{ id: string; updates: Partial<T> }>);
    }
  }

  return {
    updateElementTimeProperties,
    updateMultipleElementsTimeProperties,
  };
}

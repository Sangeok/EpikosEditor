import { useCallback } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { timeToPixels } from "@/shared/lib/timeConversion";
import { useSnapGuideStore } from "@/features/editFeatures/model/store/useSnapGuideStore";
import { buildSnapCandidates, findNearestSnapCandidate } from "../../../../lib/snapUtils";

// snap guide for resize drag
export function useSnapGuide(pixelsPerSecond: number) {
  const SNAP_TOLERANCE_PX = 7;
  const { media } = useMediaStore();
  const showGuide = useSnapGuideStore((s) => s.showGuide);
  const hideGuide = useSnapGuideStore((s) => s.hideGuide);

  const updateSnapGuide = useCallback(
    (edge: "start" | "end", edgeTimeSeconds: number, excludedElementId?: string | null): number | null => {
      const xPixels = timeToPixels(edgeTimeSeconds, pixelsPerSecond);

      const allElements = [...media.mediaElement, ...media.textElement, ...media.audioElement];
      const candidates = buildSnapCandidates(allElements, pixelsPerSecond, excludedElementId || undefined);

      const nearest = findNearestSnapCandidate(xPixels, candidates, SNAP_TOLERANCE_PX);

      if (nearest.candidate) {
        showGuide(nearest.candidate.px, nearest.candidate.time);
        // For resize, snap the dragged edge directly to the candidate time
        return nearest.candidate.time;
      }
      hideGuide();
      return null;
    },
    [media, pixelsPerSecond, showGuide, hideGuide]
  );

  const clearSnapGuide = useCallback(() => {
    hideGuide();
  }, [hideGuide]);

  return { updateSnapGuide, clearSnapGuide };
}

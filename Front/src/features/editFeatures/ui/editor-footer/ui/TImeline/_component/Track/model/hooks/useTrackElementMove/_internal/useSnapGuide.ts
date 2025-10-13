import { useCallback } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { timeToPixels } from "@/shared/lib/timeConversion";
import { useSnapGuideStore } from "@/features/editFeatures/model/store/useSnapGuideStore";
import { buildSnapCandidates, findNearestSnapCandidate } from "../../../../lib/snapUtils";

// snap guide for move drag
export function useSnapGuide(pixelsPerSecond: number) {
  const SNAP_TOLERANCE_PX = 7;
  const { media } = useMediaStore();
  const showGuide = useSnapGuideStore((s) => s.showGuide);
  const hideGuide = useSnapGuideStore((s) => s.hideGuide);

  const updateSnapGuide = useCallback(
    (startTimeSeconds: number, durationSeconds: number, excludedElementId?: string | null): number | null => {
      const currentStartPx = timeToPixels(startTimeSeconds, pixelsPerSecond);
      const currentEndPx = timeToPixels(startTimeSeconds + durationSeconds, pixelsPerSecond);

      const allElements = [...media.mediaElement, ...media.textElement, ...media.audioElement];
      const candidates = buildSnapCandidates(allElements, pixelsPerSecond, excludedElementId || undefined);

      const startNearest = findNearestSnapCandidate(currentStartPx, candidates, SNAP_TOLERANCE_PX);
      const endNearest = findNearestSnapCandidate(currentEndPx, candidates, SNAP_TOLERANCE_PX);

      const best = startNearest.distancePx <= endNearest.distancePx ? startNearest : endNearest;
      if (best.candidate) {
        showGuide(best.candidate.px, best.candidate.time);
        // If start edge is nearer, snap start to candidate. If end edge is nearer, align end to candidate.
        const snappedStartTime =
          best === startNearest ? best.candidate.time : Math.max(0, best.candidate.time - durationSeconds);
        return snappedStartTime;
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

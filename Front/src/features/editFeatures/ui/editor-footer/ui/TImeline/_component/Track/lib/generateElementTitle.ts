import { formatTimeDisplay } from "./timelineLib";
import { TrackElement } from "@/entities/media/types";

export function generateElementTitle(trackElement: TrackElement): string {
  const timeDisplay = formatTimeDisplay(
    trackElement.startTime,
    trackElement.endTime
  );
  return `${trackElement.type} (${timeDisplay})`;
}

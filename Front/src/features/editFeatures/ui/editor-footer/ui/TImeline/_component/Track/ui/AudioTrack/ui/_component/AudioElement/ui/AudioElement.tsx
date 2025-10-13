import { AudioElement as AudioElementType } from "@/entities/media/types";
import { clsx } from "clsx";
import { MoveDragState } from "../../../../../../model/types";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import { calculateElementWidth, calculateTimelinePosition } from "../../../../../../lib/timelineLib";
import Waveform from "@/features/editFeatures/ui/editor-footer/ui/TImeline/_component/Track/ui/AudioTrack/ui/_component/AudioElement/ui/_component/Waveform";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { generateElementTitle } from "../../../../../../lib/generateElementTitle";

interface TextElementProps {
  audioElement: AudioElementType;
  moveDragState?: MoveDragState;
  onMoveStart?: (e: React.MouseEvent, elementId: string) => void;
}

export default function AudioElement({ audioElement, moveDragState, onMoveStart }: TextElementProps) {
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  const setSelectedTrackAndId = useSelectedTrackStore((state) => state.setSelectedTrackAndId);

  // Calculate position and dimensions
  const leftPosition = calculateTimelinePosition(audioElement.startTime, pixelsPerSecond);
  const width = calculateElementWidth(audioElement.startTime, audioElement.endTime, pixelsPerSecond);

  // Check drag states
  const isMoveDragging = Boolean(moveDragState?.isDragging && moveDragState.elementId === audioElement.id);

  // Generate styles with visibility for move dragging
  const elementStyles = {
    left: `${leftPosition}px`,
    width: `${width}px`,
  };

  const elementClasses = getElementClasses(isMoveDragging);
  const title = generateElementTitle(audioElement);

  // Handle move drag start on element body
  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if this is a move drag (not clicking on resize handles)
    if (onMoveStart && !e.defaultPrevented) {
      // Prevent text selection during move drag
      e.preventDefault();
      onMoveStart(e, audioElement.id);

      setSelectedTrackAndId("Audio", audioElement.id);
    }
  };

  return (
    <div className={elementClasses} onMouseDown={handleMouseDown} style={elementStyles} title={title}>
      <Waveform
        url={audioElement.url}
        segmentStartSec={audioElement.sourceStart ?? 0}
        segmentEndSec={(audioElement.sourceStart ?? 0) + (audioElement.endTime - audioElement.startTime)}
        className="flex-1 h-full"
        color="#86efac" // tailwind lime-300
        backgroundColor="transparent"
      />
    </div>
  );
}

function getElementClasses(isMoveDragging?: boolean): string {
  return clsx(
    "absolute top-2 h-12 bg-gray-700 border-b-4 hover:bg-gray-800 border-1 border-gray-500 rounded transition-colors duration-200 flex items-center justify-center text-white text-xs font-medium overflow-hidden select-none user-select-none",
    isMoveDragging ? "cursor-grabbing opacity-30" : "cursor-grab hover:cursor-grab"
  );
}

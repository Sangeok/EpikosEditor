"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import { AudioElement as AudioElementType } from "@/entities/media/types";
import { useTrackElementMove } from "../../../model/hooks/useTrackElementMove/useTrackElementMove";
import { EmptyState } from "../../_component/EmptyState";
import { DropPreview, MoveDragState } from "../../../model/types";
import { DropIndicator } from "../../_component/DropIndicator";
import AudioElement from "./_component/AudioElement/ui/AudioElement";

export default function AudioTrack({ laneId }: { laneId: string }) {
  const { media, updateAudioElement } = useMediaStore();

  const elementsInLane = media.audioElement.filter((el) => (el.laneId ?? "Audio-0") === laneId);

  const { moveDragState, dropPreview, handleMoveStart } = useTrackElementMove({
    SelectedElements: elementsInLane,
    updateSelectedElements: updateAudioElement,
  });

  const hasAudioElements = elementsInLane.length > 0;

  return (
    <div className="relative w-full h-full bg-zinc-900">
      {hasAudioElements && (
        <AudioElementsContainer
          audioElements={elementsInLane}
          moveDragState={moveDragState}
          dropPreview={dropPreview}
          onMoveStart={handleMoveStart}
        />
      )}
      {!hasAudioElements && <EmptyState message="There is no audio element." />}
    </div>
  );
}

// Separated container component for audio elements
function AudioElementsContainer({
  audioElements,
  moveDragState,
  dropPreview,
  onMoveStart,
}: {
  audioElements: AudioElementType[];
  moveDragState: MoveDragState;
  dropPreview: DropPreview;
  onMoveStart: (e: React.MouseEvent, elementId: string) => void;
}) {
  return (
    <div className="relative h-full">
      {/* Drop indicator for move preview */}
      <DropIndicator dropPreview={dropPreview} moveDragState={moveDragState} />

      {/* Audio elements */}
      {audioElements.map((audioElement) => (
        <AudioElement
          key={audioElement.id}
          audioElement={audioElement}
          moveDragState={moveDragState}
          onMoveStart={onMoveStart}
        />
      ))}
    </div>
  );
}

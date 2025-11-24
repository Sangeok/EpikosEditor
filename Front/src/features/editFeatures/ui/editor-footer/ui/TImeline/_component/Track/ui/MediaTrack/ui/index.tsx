"use client";

import React from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { ResizeDragState, MoveDragState, DropPreview } from "../../../model/types";
import { MediaElement as MediaElementType } from "@/entities/media/types";
import { useTrackElementResizeDrag } from "../../../model/hooks/useTrackElementResizeDrag/useTrackElementResizeDrag";
import { useTrackElementMove } from "../../../model/hooks/useTrackElementMove/useTrackElementMove";
import { EmptyState } from "../../_component/EmptyState";
import { DropIndicator } from "../../_component/DropIndicator";
import { MediaElement } from "./_component/MediaElement/ui/MediaElement";

export default function MediaTrack({ laneId }: { laneId: string }) {
  const { media, updateMediaElement, updateMultipleMediaElements } = useMediaStore();

  const elementsInLane = media.mediaElement.filter((el) => (el.laneId ?? "Media-0") === laneId);

  const { dragState, handleResizeStart } = useTrackElementResizeDrag({
    SelectedElements: elementsInLane,
    updateSelectedElements: updateMediaElement,
    updateMultipleSelectedElements: updateMultipleMediaElements,
  });
  const { moveDragState, dropPreview, handleMoveStart } = useTrackElementMove({
    SelectedElements: elementsInLane,
    updateSelectedElements: updateMediaElement,
  });
  const hasMediaElements = elementsInLane.length > 0;

  console.log("elementsInLane", elementsInLane);

  return (
    <div className="relative w-full h-full bg-zinc-900">
      {hasMediaElements && (
        <MediaElementsContainer
          mediaElements={elementsInLane}
          dragState={dragState}
          moveDragState={moveDragState}
          dropPreview={dropPreview}
          onResizeStart={handleResizeStart}
          onMoveStart={handleMoveStart}
        />
      )}
      {!hasMediaElements && <EmptyState message="There is no media element." />}
    </div>
  );
}

// Separated container component for media elements
function MediaElementsContainer({
  mediaElements,
  dragState,
  moveDragState,
  dropPreview,
  onResizeStart,
  onMoveStart,
}: {
  mediaElements: MediaElementType[];
  dragState: ResizeDragState;
  moveDragState: MoveDragState;
  dropPreview: DropPreview;
  onResizeStart: (e: React.MouseEvent, elementId: string, dragType: "left" | "right") => void;
  onMoveStart: (e: React.MouseEvent, elementId: string) => void;
}) {
  return (
    <div className="relative h-full">
      {/* Drop indicator for move preview */}
      <DropIndicator dropPreview={dropPreview} moveDragState={moveDragState} />

      {/* Media elements */}
      {mediaElements.map((mediaElement) => (
        <MediaElement
          key={mediaElement.id}
          mediaElement={mediaElement}
          dragState={dragState}
          moveDragState={moveDragState}
          onResizeStart={onResizeStart}
          onMoveStart={onMoveStart}
        />
      ))}
    </div>
  );
}

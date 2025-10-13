"use client";

import React from "react";
import { clsx } from "clsx";
import { MediaElement as MediaElementType } from "@/entities/media/types";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import { ResizeDragState, ResizeDragType, MoveDragState } from "../../../../../../model/types";
import { ResizeHandle } from "../../../../../_component/ResizeHandle";
import { calculateTimelinePosition, calculateElementWidth, isElementDragging } from "../../../../../../lib/timelineLib";
import MediaTrackPreview from "./_component/MediaTrackPreview/ui";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { generateElementTitle } from "../../../../../../lib/generateElementTitle";

interface MediaElementProps {
  mediaElement: MediaElementType;
  dragState: ResizeDragState;
  moveDragState?: MoveDragState;
  onResizeStart: (e: React.MouseEvent, elementId: string, dragType: ResizeDragType) => void;
  onMoveStart?: (e: React.MouseEvent, elementId: string) => void;
}

export function MediaElement({
  mediaElement,
  dragState,
  moveDragState,
  onResizeStart,
  onMoveStart,
}: MediaElementProps) {
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  const setSelectedTrackAndId = useSelectedTrackStore((state) => state.setSelectedTrackAndId);
  const selectedTrackId = useSelectedTrackStore((state) => state.selectedTrackId);

  // Calculate position and dimensions
  const leftPosition = calculateTimelinePosition(mediaElement.startTime, pixelsPerSecond);
  const width = calculateElementWidth(mediaElement.startTime, mediaElement.endTime, pixelsPerSecond);

  // Check drag states
  const isResizeDragging = isElementDragging(mediaElement.id, dragState);
  const isMoveDragging = Boolean(moveDragState?.isDragging && moveDragState.elementId === mediaElement.id);
  const isDragging = isResizeDragging || isMoveDragging;
  const isSelected = selectedTrackId === mediaElement.id;

  // Generate styles with visibility for move dragging
  const elementStyles = {
    left: `${leftPosition}px`,
    width: `${width}px`,
    willChange: isDragging ? ("left, width" as unknown as string) : undefined,
  };

  const elementClasses = getElementClasses(isDragging, isMoveDragging);
  const title = generateElementTitle(mediaElement);

  // Handle move drag start on element body
  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if this is a move drag (not clicking on resize handles)
    if (onMoveStart && !e.defaultPrevented) {
      // Prevent text selection during move drag
      e.preventDefault();
      onMoveStart(e, mediaElement.id);

      const clickedTrack = mediaElement.type === "video" ? "Video" : "Image";
      setSelectedTrackAndId(clickedTrack, mediaElement.id);
    }
  };

  return (
    <div className={elementClasses} onMouseDown={handleMouseDown} style={elementStyles} title={title}>
      {/* Left resize handle */}
      <ResizeHandle
        canResize={selectedTrackId === mediaElement.id}
        position="left"
        isVisible={isSelected}
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeStart(e, mediaElement.id, "left");
        }}
      />

      {/* Media preview (image/video) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <MediaTrackPreview mediaElement={mediaElement} isResizeDragging={isResizeDragging} />
        {/* subtle bottom gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" aria-hidden />
      </div>

      {/* Right resize handle */}
      <ResizeHandle
        canResize={selectedTrackId === mediaElement.id}
        position="right"
        isVisible={isSelected}
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeStart(e, mediaElement.id, "right");
        }}
      />
    </div>
  );
}

function getElementClasses(isDragging: boolean, isMoveDragging?: boolean): string {
  const isAnyDragging = isDragging || Boolean(isMoveDragging);

  return clsx(
    "absolute top-2 h-12 bg-gray-700 border-b-4 hover:bg-gray-800 border-1 border-gray-500 rounded transition-colors duration-200 flex items-center justify-center text-white text-xs font-medium overflow-hidden select-none user-select-none",
    {
      "cursor-grabbing": isAnyDragging,
      "cursor-grab hover:cursor-grab": !isAnyDragging,
      "opacity-30": Boolean(isMoveDragging),
    }
  );
}

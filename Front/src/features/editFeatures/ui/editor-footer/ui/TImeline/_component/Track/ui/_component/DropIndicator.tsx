"use client";

import React from "react";
import { calculateElementWidth } from "../../lib/timelineLib";
import { DropPreview, MoveDragState } from "../../model/types";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { cva } from "class-variance-authority";

interface DropIndicatorProps {
  dropPreview: DropPreview;
  moveDragState: MoveDragState;
}

const dropPreviewVariants = cva(
  "absolute top-2 h-12 border-2 border-dashed rounded pointer-events-none flex items-center justify-center",
  {
    variants: {
      kind: {
        raw: "bg-blue-500 bg-opacity-50 border-blue-400 z-20",
        resolved: "bg-green-500 bg-opacity-30 border-green-400 z-10",
      },
    },
    defaultVariants: {
      kind: "raw",
    },
  }
);

export function DropIndicator({ dropPreview, moveDragState }: DropIndicatorProps) {
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  if (!dropPreview.isVisible || !moveDragState.isDragging || !dropPreview.elementId) {
    return null;
  }

  // Calculate dimensions for the preview
  const duration = moveDragState.originalEndTime - moveDragState.originalStartTime;
  const width = calculateElementWidth(0, duration, pixelsPerSecond);
  // Raw cursor-based position (what user sees under cursor)
  const rawLeftPosition = Math.round(dropPreview.targetTime * pixelsPerSecond * 10000) / 10000;
  // Resolved non-overlapping position (what will actually be applied on drop)
  const resolvedLeftPosition = typeof moveDragState.ghostPosition === "number" ? moveDragState.ghostPosition : null;
  const showResolved = resolvedLeftPosition !== null && Math.abs(resolvedLeftPosition - rawLeftPosition) > 0.5;

  const rawPreviewStyles = {
    left: `${rawLeftPosition}px`,
    width: `${width}px`,
  };

  const resolvedPreviewStyles =
    resolvedLeftPosition !== null
      ? {
          left: `${resolvedLeftPosition}px`,
          width: `${width}px`,
        }
      : undefined;

  return (
    <>
      {/* Raw (cursor) preview */}
      <div className={dropPreviewVariants({ kind: "raw" })} style={rawPreviewStyles}>
        <span className="text-white text-xs font-medium opacity-80">Drop here</span>
      </div>

      {/* Resolved (will snap) preview */}
      {showResolved && resolvedPreviewStyles && (
        <div className={dropPreviewVariants({ kind: "resolved" })} style={resolvedPreviewStyles}>
          <span className="text-white text-[10px] font-medium opacity-80">Will snap</span>
        </div>
      )}
    </>
  );
}

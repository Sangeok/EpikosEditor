export interface ResizeDragState {
  isDragging: boolean;
  elementId: string | null;
  dragType: "left" | "right" | null;
  startX: number;
  originalStartTime: number;
  originalEndTime: number;
  // Track the farthest right edge reached during the current resize session
  // Used to avoid pulling subsequent elements back while mouse is still down
  maxEndTimeDuringDrag?: number;
}

export type ResizeDragType = "left" | "right";

export interface ElementAdjustment {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface MoveDragState {
  isDragging: boolean;
  elementId: string | null;
  startX: number;
  originalStartTime: number;
  originalEndTime: number;
  ghostPosition?: number | null; // Preview position in pixels
}

// Drop preview state
export interface DropPreview {
  isVisible: boolean;
  targetTime: number;
  elementId: string | null;
}

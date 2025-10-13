// // Resize drag state (for ResizeHandle functionality)
// export interface ResizeDragState {
//   isDragging: boolean;
//   elementId: string | null;
//   dragType: "left" | "right" | null;
//   startX: number;
//   originalStartTime: number;
//   originalEndTime: number;
//   // Track the farthest right edge reached during the current resize session
//   // Used to avoid pulling subsequent elements back while mouse is still down
//   maxEndTimeDuringDrag?: number;
// }

// // Move drag state (for MediaElement positioning)
// export interface MoveDragState {
//   isDragging: boolean;
//   elementId: string | null;
//   startX: number;
//   originalStartTime: number;
//   originalEndTime: number;
//   ghostPosition?: number | null; // Preview position in pixels
// }

// // Drop preview state
// export interface DropPreview {
//   isVisible: boolean;
//   targetTime: number;
//   elementId: string | null;
// }

// // Combined drag operation state
// export interface DragOperation {
//   resize: ResizeDragState;
//   move: MoveDragState;
//   dropPreview: DropPreview;
// }

// export interface MediaTimelineProps {
//   className?: string;
// }

// export type ResizeDragType = "left" | "right";

// export interface ElementAdjustment {
//   id: string;
//   startTime: number;
//   endTime: number;
//   duration: number;
// }

// // Legacy type alias for backward compatibility
// export type DragState = ResizeDragState;
// export type DragType = ResizeDragType;

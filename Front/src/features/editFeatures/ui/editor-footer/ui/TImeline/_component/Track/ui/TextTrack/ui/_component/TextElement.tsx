import { TextElement as TextElementType } from "@/entities/media/types";
import { clsx } from "clsx";
import { MoveDragState, ResizeDragType } from "../../../../model/types";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import { calculateElementWidth, calculateTimelinePosition, isElementDragging } from "../../../../lib/timelineLib";
import { ResizeHandle } from "../../../_component/ResizeHandle";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { generateElementTitle } from "../../../../lib/generateElementTitle";

interface TextElementProps {
  textElement: TextElementType;
  dragState: MoveDragState;
  moveDragState?: MoveDragState;
  onResizeStart: (e: React.MouseEvent, elementId: string, dragType: ResizeDragType) => void;
  onMoveStart?: (e: React.MouseEvent, elementId: string) => void;
}

export default function TextElement({
  textElement,
  dragState,
  moveDragState,
  onResizeStart,
  onMoveStart,
}: TextElementProps) {
  const pixelsPerSecond = useTimelineStore((state) => state.pixelsPerSecond);

  const setSelectedTrackAndId = useSelectedTrackStore((state) => state.setSelectedTrackAndId);
  const selectedTrackId = useSelectedTrackStore((state) => state.selectedTrackId);

  // Calculate position and dimensions
  const leftPosition = calculateTimelinePosition(textElement.startTime, pixelsPerSecond);
  const width = calculateElementWidth(textElement.startTime, textElement.endTime, pixelsPerSecond);

  // Check drag states
  const isResizeDragging = isElementDragging(textElement.id, dragState);
  const isMoveDragging = Boolean(moveDragState?.isDragging && moveDragState.elementId === textElement.id);
  const isDragging = isResizeDragging || isMoveDragging;
  const isSelected = selectedTrackId === textElement.id;

  // Generate styles with visibility for move dragging
  const elementStyles = {
    left: `${leftPosition}px`,
    width: `${width}px`,
  };

  const elementClasses = getElementClasses(isDragging, isMoveDragging);
  const title = generateElementTitle(textElement);

  // Handle move drag start on element body
  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if this is a move drag (not clicking on resize handles)
    if (onMoveStart && !e.defaultPrevented) {
      // Prevent text selection during move drag
      e.preventDefault();
      onMoveStart(e, textElement.id);

      setSelectedTrackAndId("Text", textElement.id);
    }
  };

  return (
    <div className={elementClasses} onMouseDown={handleMouseDown} style={elementStyles} title={title}>
      {/* Left resize handle */}
      <ResizeHandle
        canResize={selectedTrackId === textElement.id}
        position="left"
        isVisible={isSelected}
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeStart(e, textElement.id, "left");
        }}
      />

      <span className="w-full min-w-0 truncate px-3 pointer-events-none select-none">{textElement.text || "Text"}</span>

      {/* Right resize handle */}
      <ResizeHandle
        canResize={selectedTrackId === textElement.id}
        position="right"
        isVisible={isSelected}
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeStart(e, textElement.id, "right");
        }}
      />
    </div>
  );
}

function getElementClasses(isDragging: boolean, isMoveDragging?: boolean): string {
  const isAnyDragging = isDragging || Boolean(isMoveDragging);

  return clsx(
    "absolute top-2 h-12 bg-gray-700 border-b-4 hover:bg-gray-800 border-1 border-gray-500 rounded transition-colors duration-200 flex items-center justify-center text-white text-xs font-medium select-none user-select-none",
    {
      "cursor-grabbing": isAnyDragging,
      "cursor-grab hover:cursor-grab": !isAnyDragging,
      "opacity-30": Boolean(isMoveDragging),
    }
  );
}

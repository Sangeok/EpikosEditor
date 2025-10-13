import { useEffect } from "react";
import { ResizeDragState } from "../../../types";

export function useMouseEvents(
  dragState: ResizeDragState,
  handleMouseMove: (e: MouseEvent) => void,
  handleMouseUp: () => void
): void {
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);
}

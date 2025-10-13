"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import { PLAYER_CONFIG } from "@/features/editFeatures/ui/player/config/playerConfig";
import { useSmartGuideStore } from "@/features/editFeatures/ui/player/model/hooks/useSmartGuideStore";
import { useState, useCallback, useEffect, useRef } from "react";

interface DragState {
  isDragging: boolean;
  initialClientX: number;
  initialClientY: number;
  initialCanvasX: number;
  initialCanvasY: number;
}

const INITIAL_DRAG_STATE: DragState = {
  isDragging: false,
  initialClientX: 0,
  initialClientY: 0,
  initialCanvasX: 0,
  initialCanvasY: 0,
};

interface UseDragTextProps {
  elementId: string;
  currentCanvasX: number;
  currentCanvasY: number;
  isPlaying: boolean;
  isEditing: boolean;
}

export const useDragText = ({ elementId, currentCanvasX, currentCanvasY, isPlaying, isEditing }: UseDragTextProps) => {
  const { updateTextElementPosition } = useMediaStore();
  const { setIsDraggingText, clearSmartGuides } = useSmartGuideStore();
  const [dragState, setDragState] = useState<DragState>(INITIAL_DRAG_STATE);
  const rafIdRef = useRef<number | null>(null);
  const latestPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastAppliedPosRef = useRef<{ x: number; y: number } | null>(null);

  const setSelectedTrackAndId = useSelectedTrackStore((state) => state.setSelectedTrackAndId);

  const handleSelect = useCallback(() => {
    setSelectedTrackAndId("Text", elementId);
  }, [setSelectedTrackAndId, elementId]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isPlaying || isEditing) return;

      e.preventDefault();
      e.stopPropagation();

      handleSelect();

      setDragState({
        isDragging: true,
        initialClientX: e.clientX,
        initialClientY: e.clientY,
        initialCanvasX: currentCanvasX,
        initialCanvasY: currentCanvasY,
      });

      setIsDraggingText(true);
    },
    [isPlaying, isEditing, currentCanvasX, currentCanvasY, handleSelect, setIsDraggingText]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || isEditing) return;

      const deltaX = e.clientX - dragState.initialClientX;
      const deltaY = e.clientY - dragState.initialClientY;

      const newPosX = dragState.initialCanvasX + deltaX * PLAYER_CONFIG.SCALE_X;
      const newPosY = dragState.initialCanvasY + deltaY * PLAYER_CONFIG.SCALE_Y;

      // queue latest position and batch updates to one per frame
      latestPosRef.current = { x: newPosX, y: newPosY };

      if (rafIdRef.current == null) {
        rafIdRef.current = requestAnimationFrame(() => {
          const pos = latestPosRef.current;
          rafIdRef.current = null;
          if (!pos) return;

          const last = lastAppliedPosRef.current;
          if (last && last.x === pos.x && last.y === pos.y) return;

          lastAppliedPosRef.current = pos;
          updateTextElementPosition(elementId, { x: pos.x, y: pos.y });
        });
      }
    },
    [dragState, updateTextElementPosition, isEditing, elementId]
  );

  const handleMouseUp = useCallback(() => {
    setDragState(INITIAL_DRAG_STATE);
    clearSmartGuides();
  }, [clearSmartGuides]);

  useEffect(() => {
    if (dragState.isDragging && !isEditing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        if (rafIdRef.current != null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp, isEditing]);

  return {
    dragState,
    handleMouseDown,
  };
};

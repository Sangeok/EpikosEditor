"use client";

import { useEffect, useRef, useState } from "react";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { DraggableTextProps, CursorType } from "../model/types";
import { useDragText } from "../model/useDragText";
import { useTextEdit } from "../model/useTextEdit";
import { useSmartGuideStore } from "@/features/editFeatures/ui/player/model/hooks/useSmartGuideStore";

export default function DraggableText({ element }: DraggableTextProps) {
  const { isPlaying } = useTimelineStore();

  const [isHovered, setIsHovered] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const {
    isEditing,
    textRef,
    handleDoubleClick,
    handleTextInput,
    handleTextBlur,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  } = useTextEdit({
    elementId: element.id,
    initialText: element.text || "",
    isPlaying,
  });

  // Use drag hook with current editing state
  const { dragState, handleMouseDown } = useDragText({
    elementId: element.id,
    currentCanvasX: element.positionX,
    currentCanvasY: element.positionY,
    isPlaying,
    isEditing,
  });

  const setDraggingTextRect = useSmartGuideStore((s) => s.setDraggingTextRect);

  // set dragging text rect for smart guide
  useEffect(() => {
    if (!dragState.isDragging) {
      setDraggingTextRect(null);
      return;
    }

    const el = rootRef.current;
    const compositionContainer = document.getElementById("composition-container") as HTMLDivElement | null;
    if (!el || !compositionContainer) return;

    const rect = el.getBoundingClientRect();
    const compRect = compositionContainer.getBoundingClientRect();
    const scaleX = compRect.width / compositionContainer.offsetWidth || 1;
    const scaleY = compRect.height / compositionContainer.offsetHeight || 1;

    const left = (rect.left - compRect.left) / scaleX;
    const top = (rect.top - compRect.top) / scaleY;
    const width = rect.width / scaleX;
    const height = rect.height / scaleY;

    setDraggingTextRect({
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height,
    });
  }, [dragState.isDragging, element.positionX, element.positionY, setDraggingTextRect]);

  // Style calculations
  const showBorder = !isPlaying && (isHovered || dragState.isDragging || isEditing);
  const borderColor = isEditing ? "#3b82f6" : "#ffffff";
  const getCursor = (): CursorType => {
    if (isPlaying) return "default";
    if (isEditing) return "text";
    if (dragState.isDragging) return "grabbing";
    if (isHovered) return "grab";
    return "grab";
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${element.positionX}px, ${element.positionY}px) translateX(-50%)`,
        width: "fit-content",
        maxWidth: element.maxWidth ?? "100%",
        height: "auto",
        display: "inline-block",
        padding: "5px",
        whiteSpace: element.whiteSpace ?? "pre-wrap",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        borderRadius: "4px",
        boxSizing: "border-box",
        border: showBorder ? `1px solid ${borderColor}` : "1px solid transparent",
        cursor: getCursor(),
        textAlign: "center",
        userSelect: isEditing ? "text" : "none",
        zIndex: dragState.isDragging || isEditing ? 1001 : 1000,
        fontSize: `${element.fontSize}px`,
        fontFamily: element.font,
        color: element.textColor,
        backgroundColor: element.backgroundColor,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => !isPlaying && !isEditing && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div
          ref={textRef}
          contentEditable
          onInput={handleTextInput}
          onBlur={handleTextBlur}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          style={{
            height: "100%",
            outline: "none",
            background: "transparent",
            minWidth: "1ch",
            whiteSpace: element.whiteSpace ?? "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
          suppressContentEditableWarning={true}
        />
      ) : (
        <span
          style={{
            whiteSpace: element.whiteSpace ?? "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {element.text}
        </span>
      )}
    </div>
  );
}

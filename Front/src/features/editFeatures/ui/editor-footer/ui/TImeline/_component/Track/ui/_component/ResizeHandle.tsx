"use client";

import React from "react";
import { clsx } from "clsx";

interface ResizeHandleProps {
  position: "left" | "right";
  isVisible: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  canResize: boolean;
}

export function ResizeHandle({ position, isVisible, onMouseDown, canResize }: ResizeHandleProps) {
  if (!canResize) return null;

  const handleClasses = clsx(
    "absolute top-0 w-1 h-full bg-indigo-500 transition-opacity",
    position === "left" ? "left-0 cursor-w-resize" : "right-0 cursor-e-resize",
    isVisible ? "opacity-100" : "opacity-0"
  );

  const title = position === "left" ? "Resize start time" : "Resize end time";

  return <div className={handleClasses} onMouseDown={onMouseDown} title={title} />;
}

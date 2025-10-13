"use client";

import { formatPlaybackTime } from "@/features/editFeatures/ui/editor-footer/lib/formatTimelineTime";
import TimeEditable from "./TimeEditable";

interface ClockFieldProps {
  isEditing: boolean;
  valueSeconds: number;
  onBegin: () => void;
  onCommit: (text: string) => void;
  onCancel: () => void;
}

export default function ClockField({ isEditing, valueSeconds, onBegin, onCommit, onCancel }: ClockFieldProps) {
  return isEditing ? (
    <TimeEditable
      valueSeconds={valueSeconds}
      className="px-1 cursor-text outline-none focus:outline-none"
      onCommit={onCommit}
      onCancel={onCancel}
    />
  ) : (
    <div className="px-1 cursor-text" onClick={onBegin}>
      {formatPlaybackTime(valueSeconds)}
    </div>
  );
}

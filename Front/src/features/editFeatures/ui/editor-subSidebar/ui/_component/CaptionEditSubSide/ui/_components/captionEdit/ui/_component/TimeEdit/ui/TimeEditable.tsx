"use client";

import { useRef } from "react";
import { formatPlaybackTime } from "@/features/editFeatures/ui/editor-footer/lib/formatTimelineTime";

const CLOCK_ALLOWED_KEYS = new Set(["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Home", "End", ":", "."]);

interface TimeEditableProps {
  valueSeconds: number;
  className?: string;
  onCommit: (draftText: string) => void;
  onCancel: () => void;
}

const sanitizeClockText = (text: string) => text.replace(/[^0-9:\.]/g, "");
const focusNodeEnd = (node: HTMLElement) => {
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
  node.focus();
};

export default function TimeEditable({ valueSeconds, className, onCommit, onCancel }: TimeEditableProps) {
  const initialTextRef = useRef<string>(formatPlaybackTime(valueSeconds));
  const lastValidRef = useRef<string>(initialTextRef.current);

  return (
    <span
      contentEditable
      suppressContentEditableWarning
      ref={(node) => {
        if (node) {
          initialTextRef.current = formatPlaybackTime(valueSeconds);
          lastValidRef.current = initialTextRef.current;
          focusNodeEnd(node as HTMLElement);
        }
      }}
      className={className}
      onInput={(e) => {
        const native = e.nativeEvent as InputEvent;
        if ((native as InputEvent).isComposing) return;
        const target = e.currentTarget as HTMLSpanElement;
        const sanitized = sanitizeClockText(target.textContent ?? "");
        if (sanitized !== (target.textContent ?? "")) {
          target.textContent = sanitized;
          lastValidRef.current = sanitized || lastValidRef.current;
          focusNodeEnd(target);
        }
      }}
      onBeforeInput={(e) => {
        const native = e.nativeEvent as InputEvent;
        const data = (native as InputEvent).data as string | null | undefined;
        if (data && /[^0-9:\.]/.test(data)) e.preventDefault();
      }}
      onCompositionUpdate={(e) => {
        const target = e.currentTarget as HTMLSpanElement;
        const text = target.textContent ?? "";
        const sanitized = sanitizeClockText(text);
        if (sanitized !== text) {
          target.textContent = sanitized.length > 0 ? sanitized : lastValidRef.current;
          focusNodeEnd(target);
        }
      }}
      onCompositionEnd={(e) => {
        const target = e.currentTarget as HTMLSpanElement;
        const sanitized = sanitizeClockText(target.textContent ?? "");
        if (sanitized !== (target.textContent ?? "")) {
          target.textContent = sanitized;
          lastValidRef.current = sanitized || lastValidRef.current;
          focusNodeEnd(target);
        }
      }}
      onPaste={(e) => {
        e.preventDefault();
        const text = (e.clipboardData || (window as unknown as ClipboardEvent).clipboardData).getData("text");
        const sanitized = sanitizeClockText(text);
        const selection = window.getSelection();
        if (!selection) return;
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (!range) return;
        range.deleteContents();
        range.insertNode(document.createTextNode(sanitized));
        selection.collapseToEnd();
      }}
      onBlur={(e) => onCommit(e.currentTarget.textContent ?? "")}
      onKeyDown={(e) => {
        if ((e.nativeEvent as unknown as InputEvent).isComposing || (e as unknown as KeyboardEvent).keyCode === 229) {
          e.preventDefault();
          return;
        }
        if (e.key === "Escape") {
          const target = e.currentTarget as HTMLSpanElement;
          target.textContent = initialTextRef.current;
          onCancel();
          return;
        }
        if (e.key.length === 1 && !/[0-9:]/.test(e.key) && !CLOCK_ALLOWED_KEYS.has(e.key)) {
          e.preventDefault();
        }
      }}
    >
      {formatPlaybackTime(valueSeconds)}
    </span>
  );
}

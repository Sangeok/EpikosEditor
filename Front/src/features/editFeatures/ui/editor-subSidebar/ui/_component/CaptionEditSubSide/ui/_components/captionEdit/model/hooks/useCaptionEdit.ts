"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import { useCallback, useMemo, useState } from "react";

export const useCaptionEdit = () => {
  const { media, updateTextElement } = useMediaStore();

  // Inline edit state
  const [editing, setEditing] = useState<{ id: string; field: "start" | "end" | "text" } | null>(null);

  const sortedTextElements = useMemo(() => {
    return [...media.textElement].sort((a, b) => a.startTime - b.startTime);
  }, [media.textElement]);

  const hasNoTextElement = sortedTextElements.length === 0;

  // Parse time inputs like mm:ss(.mmm) or h:mm:ss(.mmm) into seconds
  const parseClockTime = useCallback((value: string): number | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const parts = trimmed.split(":");
    if (parts.length !== 2 && parts.length !== 3) return null;

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let millis = 0;

    // Extract seconds and optional millis from the last segment
    const last = parts[parts.length - 1];
    const lastSplit = last.split(".");
    if (lastSplit.length > 2) return null;
    seconds = Number(lastSplit[0]);
    if (Number.isNaN(seconds)) return null;
    if (lastSplit.length === 2) {
      const msRaw = lastSplit[1];
      if (!/^\d{1,3}$/.test(msRaw)) return null;
      millis = Number(msRaw.padEnd(3, "0"));
    }

    if (parts.length === 2) {
      // mm:ss(.mmm)
      minutes = Number(parts[0]);
    } else {
      // h:mm:ss(.mmm)
      hours = Number(parts[0]);
      minutes = Number(parts[1]);
    }

    if ([minutes, seconds, hours].some((n) => Number.isNaN(n))) return null;
    if (seconds > 59 || minutes > 59 || seconds < 0 || minutes < 0 || hours < 0) return null;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds + millis / 1000;
    return Math.round(totalSeconds * 1000) / 1000;
  }, []);

  const beginEdit = useCallback((id: string, field: "start" | "end") => {
    setEditing({ id, field });
  }, []);

  const beginTextEdit = useCallback((id: string) => {
    setEditing({ id, field: "text" });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditing(null);
  }, []);

  const hasOverlap = useCallback(
    (elementId: string, newStart: number, newEnd: number): boolean => {
      // overlap if [newStart, newEnd) intersects with any other [startTime, endTime)
      // allow touching edges (==) without overlap
      return media.textElement.some(
        (other) => other.id !== elementId && newStart < other.endTime && newEnd > other.startTime
      );
    },
    [media.textElement]
  );

  // inline TimeEditable, caret, sanitize 로직은 외부 컴포넌트로 이동

  const commitClockEdit = useCallback(
    (elementId: string, field: "start" | "end", draftText: string) => {
      const element = media.textElement.find((el) => el.id === elementId);
      if (!element) return cancelEdit();

      const parsed = parseClockTime(draftText);
      if (parsed === null || parsed < 0) {
        return cancelEdit();
      }

      const newStart = field === "start" ? parsed : element.startTime;
      const newEnd = field === "end" ? parsed : element.endTime;

      if (newEnd <= newStart) {
        return cancelEdit();
      }

      if (hasOverlap(elementId, newStart, newEnd)) {
        alert("Overlap detected between other captions");
        return cancelEdit();
      }

      updateTextElement(elementId, {
        startTime: newStart,
        endTime: newEnd,
        duration: newEnd - newStart,
      });

      cancelEdit();
    },
    [cancelEdit, hasOverlap, media.textElement, parseClockTime, updateTextElement]
  );

  // text edit
  const commitTextEdit = useCallback(
    (elementId: string, newText: string) => {
      const element = media.textElement.find((el) => el.id === elementId);
      if (!element) return cancelEdit();

      updateTextElement(elementId, { text: newText });
      cancelEdit();
    },
    [cancelEdit, media.textElement, updateTextElement]
  );

  return {
    state: {
      editing,
      sortedTextElements,
      hasNoTextElement,
    },
    actions: {
      beginEdit,
      beginTextEdit,
      cancelEdit,
      commitClockEdit,
      commitTextEdit,
    },
  };
};

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TextElement } from "@/entities/media/types";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { DebouncedTextEditState, DebouncedTextEditActions } from "./types";

const DEBOUNCE_DELAY = 300;

export function useDebouncedTextEdit(
  selectedTrackId: string | null
): DebouncedTextEditState & DebouncedTextEditActions {
  const { updateTextElement, updateSameLaneTextElement } = useMediaStore();
  const textElement = useMediaStore((state) =>
    state.media.textElement.find((element) => element.id === selectedTrackId)
  );

  const [localState, setLocalState] = useState<DebouncedTextEditState>({
    localText: "",
    localFontSize: "",
  });

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUserEditingRef = useRef<boolean>(false);

  // Sync local state with textElement changes (only when values actually change)
  useEffect(() => {
    // Don't sync if user is currently editing (debounce in progress)
    if (isUserEditingRef.current) {
      return;
    }

    const newState = textElement
      ? {
          localText: textElement.text || "",
          localWidth: textElement.width?.toString() || "",
          localFontSize: textElement.fontSize?.toString() || "",
        }
      : {
          localText: "",
          localWidth: "",
          localFontSize: "",
        };

    // Only update if values actually changed
    setLocalState((prevState) => {
      if (prevState.localText === newState.localText && prevState.localFontSize === newState.localFontSize) {
        return prevState; // No change, return same reference
      }
      return newState;
    });
  }, [textElement]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      isUserEditingRef.current = false;
    };
  }, []);

  const debouncedUpdateTextElement = useCallback(
    (field: keyof TextElement, value: number | string) => {
      if (!selectedTrackId) return;

      // Mark that user is editing
      isUserEditingRef.current = true;

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        updateTextElement(selectedTrackId, { [field]: value });
        // Mark editing complete after update
        isUserEditingRef.current = false;
      }, DEBOUNCE_DELAY);
    },
    [selectedTrackId, updateTextElement]
  );

  const debouncedUpdateSameLaneTextElement = useCallback(
    (field: keyof TextElement, value: number | string) => {
      if (!selectedTrackId) return;

      // Mark that user is editing
      isUserEditingRef.current = true;

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        updateSameLaneTextElement(selectedTrackId, { [field]: value });
        // Mark editing complete after update
        isUserEditingRef.current = false;
      }, DEBOUNCE_DELAY);
    },
    [selectedTrackId, updateSameLaneTextElement]
  );

  const handleTextChange = useCallback(
    (value: string) => {
      setLocalState((prev) => ({ ...prev, localText: value }));
      debouncedUpdateTextElement("text", value);
    },
    [debouncedUpdateTextElement]
  );

  const handleFontSizeChange = useCallback(
    (value: string) => {
      setLocalState((prev) => ({ ...prev, localFontSize: value }));
      const numericValue = parseNumericValue(value);
      if (numericValue !== null) {
        debouncedUpdateSameLaneTextElement("fontSize", numericValue);
      }
    },
    [debouncedUpdateSameLaneTextElement]
  );

  return {
    ...localState,
    handleTextChange,
    handleFontSizeChange,
  };
}

function parseNumericValue(value: string): number | null {
  const numericValue = Number(value);
  return isNaN(numericValue) ? null : numericValue;
}

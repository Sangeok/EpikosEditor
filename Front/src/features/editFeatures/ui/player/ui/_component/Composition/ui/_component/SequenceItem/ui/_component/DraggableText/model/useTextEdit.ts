import { useMediaStore } from "@/entities/media/useMediaStore";
import { useState, useCallback, useRef, useEffect } from "react";

interface UseTextEditProps {
  elementId: string;
  initialText: string;
  isPlaying: boolean;
}

export const useTextEdit = ({
  elementId,
  initialText,
  isPlaying,
}: UseTextEditProps) => {
  const { updateTextElement } = useMediaStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cursorPositionRef = useRef<number>(0); // cursor position
  const isEditingStartRef = useRef<boolean>(false); // Flag for initial editing state (before first input)

  // Utility functions
  const getTextContent = (element: HTMLDivElement): string => {
    return element.textContent || "";
  };

  // clear debounce timer
  const clearUpdateTimer = () => {
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
      updateTimerRef.current = null;
    }
  };

  const updateText = useCallback(
    (text: string) => {
      updateTextElement(elementId, { text });
    },
    [updateTextElement, elementId]
  );

  const finishEditing = () => {
    setIsEditing(false);
    isEditingStartRef.current = false;
    textRef.current?.blur(); // delete focus
  };

  // Cursor position management
  // save cursor position for prevent cursor jump to back
  const saveCursorPosition = useCallback(() => {
    if (!textRef.current || !isEditing) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    cursorPositionRef.current = range.startOffset;
  }, [isEditing]);

  // restore cursor position for prevent cursor jump to back
  const restoreCursorPosition = useCallback(() => {
    if (!textRef.current || !isEditing || isEditingStartRef.current) return;

    const selection = window.getSelection();
    const textNode = textRef.current.firstChild;
    if (!textNode || !selection) return;

    const maxOffset = textNode.textContent?.length || 0; // text max length
    const safeOffset = Math.min(cursorPositionRef.current, maxOffset);

    try {
      const range = document.createRange();
      range.setStart(textNode, safeOffset);
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      console.warn("Failed to restore cursor position:", error);
    }
  }, [isEditing]);

  // Debounced update for Korean text
  const debouncedUpdate = useCallback(
    (text: string) => {
      clearUpdateTimer();
      updateTimerRef.current = setTimeout(() => {
        updateText(text);
      }, 300);
    },
    [updateText]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isPlaying) return;

      e.preventDefault();
      e.stopPropagation();

      isEditingStartRef.current = true;
      setIsEditing(true);
    },
    [isPlaying]
  );

  const handleTextInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const isEditingStart = isEditingStartRef.current;

      if (!isEditingStart) {
        saveCursorPosition();
      }

      const newText = getTextContent(e.target as HTMLDivElement);

      if (!isComposing) {
        const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(newText);
        if (hasKorean) {
          debouncedUpdate(newText);
        } else {
          updateText(newText);
        }
      }

      if (!isEditingStart) {
        requestAnimationFrame(() => {
          restoreCursorPosition();
        });
      } else {
        isEditingStartRef.current = false; // for saving cursor position
      }
    },
    [
      isComposing,
      debouncedUpdate,
      updateText,
      saveCursorPosition,
      restoreCursorPosition,
    ]
  );

  const handleTextBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      clearUpdateTimer();

      const newText = getTextContent(e.target as HTMLDivElement);
      updateText(newText);
      setIsEditing(false);
      isEditingStartRef.current = false;
    },
    [updateText]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        clearUpdateTimer();

        const newText = getTextContent(e.target as HTMLDivElement);
        updateText(newText);
        finishEditing();
      } else if (e.key === "Escape") {
        e.preventDefault();
        clearUpdateTimer();

        if (textRef.current) {
          textRef.current.textContent = initialText;
        }
        finishEditing();
      }
    },
    [updateText, initialText]
  );

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLDivElement>) => {
      setIsComposing(false);
      const newText = getTextContent(e.target as HTMLDivElement);
      updateText(newText);
    },
    [updateText]
  );

  // Focus and select text when editing starts
  useEffect(() => {
    if (isEditing && textRef.current && isEditingStartRef.current) {
      const element = textRef.current;

      element.textContent = initialText;
      element.focus();

      const selection = window.getSelection();
      const range = document.createRange();
      if (element.firstChild) {
        range.selectNodeContents(element);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [isEditing, initialText]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, []);

  return {
    isEditing,
    textRef,
    handleDoubleClick,
    handleTextInput,
    handleTextBlur,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  };
};

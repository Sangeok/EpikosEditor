import { useCallback, useRef } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { convertSRTToTextElements, parseSRTContent, readFileAsText } from "@/shared/lib/srtUtils";
import { useDragAndDrop } from "../../../../../model/hooks";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export function useCaptionUpload() {
  const { addTextElement } = useMediaStore();
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragAndDrop = useDragAndDrop();

  const validateSRTFile = useCallback((file: File): boolean => {
    if (!file.name.toLowerCase().endsWith(".srt")) {
      return false;
    }
    return true;
  }, []);

  const processSRTFile = useCallback(
    async (file: File): Promise<void> => {
      if (!validateSRTFile(file)) return;

      try {
        const srtContent = await readFileAsText(file);

        const parsedEntries = parseSRTContent(srtContent);
        const textElements = convertSRTToTextElements(parsedEntries).map((el) => ({
          ...el,
          laneId: activeLaneByType.Text,
        }));

        textElements.forEach((element) => {
          addTextElement(element, true);
        });
      } catch (error) {
        console.error("Error processing SRT file:", error);
      }
    },
    [addTextElement, validateSRTFile, activeLaneByType]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      processSRTFile(file);
    },
    [processSRTFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      dragAndDrop.handleDrop(e, (files) => {
        handleFileSelect(files);
      });
    },
    [dragAndDrop, handleFileSelect]
  );

  const resetUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return {
    fileInputRef,
    state: {
      dragActive: dragAndDrop.dragActive,
    },
    actions: {
      handleFileSelect,
      handleDrag: dragAndDrop.handleDrag,
      handleDrop,
      resetUpload,
    },
  };
}

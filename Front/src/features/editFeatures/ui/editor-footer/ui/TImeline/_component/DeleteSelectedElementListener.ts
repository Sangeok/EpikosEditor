"use client";

import { useEffect } from "react";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import { useMediaStore } from "@/entities/media/useMediaStore";

export default function DeleteSelectedElementListener() {
  const selectedTrack = useSelectedTrackStore((s) => s.selectedTrack);
  const selectedTrackId = useSelectedTrackStore((s) => s.selectedTrackId);
  const setSelectedTrackAndId = useSelectedTrackStore((s) => s.setSelectedTrackAndId);

  const deleteTextElement = useMediaStore((s) => s.deleteTextElement);
  const deleteMediaElement = useMediaStore((s) => s.deleteMediaElement);
  const deleteAudioElement = useMediaStore((s) => s.deleteAudioElement);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (!selectedTrackId) return;

      e.preventDefault();
      switch (selectedTrack) {
        case "Text":
          deleteTextElement(selectedTrackId);
          break;
        case "Video":
        case "Image":
          deleteMediaElement(selectedTrackId);
          break;
        case "Audio":
          deleteAudioElement(selectedTrackId);
          break;
      }
      setSelectedTrackAndId(null, null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    selectedTrack,
    selectedTrackId,
    deleteTextElement,
    deleteMediaElement,
    deleteAudioElement,
    setSelectedTrackAndId,
  ]);

  return null;
}

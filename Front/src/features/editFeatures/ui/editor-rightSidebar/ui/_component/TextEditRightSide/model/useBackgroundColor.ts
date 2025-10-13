"use client";

import { useState, useRef, useCallback } from "react";
import { BACKGROUND_COLOR_CONFIGS, BackgroundColorName } from "../constants";
import { useMediaStore } from "@/entities/media/useMediaStore";

export function useBackgroundColor(selectedTrackId: string | null) {
  const { updateTextBackgroundColor } = useMediaStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const handleColorChange = useCallback(
    (name: string) => {
      const colorName = name as BackgroundColorName;
      const config = BACKGROUND_COLOR_CONFIGS[colorName];

      // Handle "None" case
      if (config === null) {
        setSelectedColor(null);
        return;
      }

      // Handle valid color configurations
      if (config && selectedTrackId) {
        updateTextBackgroundColor(selectedTrackId, config);
        setSelectedColor(colorName);
      }
    },
    [selectedTrackId, updateTextBackgroundColor]
  );

  return {
    isDropdownOpen,
    setIsDropdownOpen,
    selectedColor,
    handleColorChange,
    dropdownRef,
  };
}

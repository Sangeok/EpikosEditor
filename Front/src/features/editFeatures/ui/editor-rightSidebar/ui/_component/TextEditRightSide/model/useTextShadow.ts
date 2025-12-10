"use client";

import { useState, useCallback } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { TEXT_SHADOW_CONFIGS, TextShadowName } from "../constants";

const DEFAULT_INTENSITY = 70; // 0~100

export function useTextShadow(selectedTrackId: string | null) {
  const { updateSameLaneTextElement } = useMediaStore();

  const [selectedShadowName, setSelectedShadowName] = useState<TextShadowName>("None");
  const [intensity, setIntensity] = useState<number>(DEFAULT_INTENSITY);

  const applyShadow = useCallback(
    (presetName: TextShadowName, nextIntensity: number) => {
      if (!selectedTrackId) return;

      const config = TEXT_SHADOW_CONFIGS[presetName];

      // "None" 프리셋: 그림자 제거
      if (config === null) {
        updateSameLaneTextElement(selectedTrackId, { textShadow: "" });
        return;
      }

      const clamped = Math.max(0, Math.min(100, nextIntensity));
      const ratio = clamped / 100;

      const blur = config.blur.min + (config.blur.max - config.blur.min) * ratio;
      const alpha = config.alpha.min + (config.alpha.max - config.alpha.min) * ratio;

      const textShadow = `${config.offsetX}px ${config.offsetY}px ${blur.toFixed(1)}px rgba(${config.rgb.r}, ${
        config.rgb.g
      }, ${config.rgb.b}, ${alpha.toFixed(2)})`;

      // 같은 lane 의 모든 텍스트에 동일한 textShadow 적용
      updateSameLaneTextElement(selectedTrackId, { textShadow });
    },
    [selectedTrackId, updateSameLaneTextElement]
  );

  const handleShadowPresetChange = useCallback(
    (name: string) => {
      const presetName = name as TextShadowName;
      setSelectedShadowName(presetName);
      applyShadow(presetName, intensity);
    },
    [applyShadow, intensity]
  );

  const handleIntensityChange = useCallback(
    (value: number) => {
      const clamped = Math.max(0, Math.min(100, value));
      setIntensity(clamped);
      applyShadow(selectedShadowName, clamped);
    },
    [applyShadow, selectedShadowName]
  );

  return {
    selectedShadowName,
    intensity,
    handleShadowPresetChange,
    handleIntensityChange,
  };
}

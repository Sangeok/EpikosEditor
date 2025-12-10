"use client";

import { useDebouncedTextEdit } from "../model/useDebouncedTextEdit";
import { useBackgroundColor } from "../model/useBackgroundColor";
import { useTextShadow } from "../model/useTextShadow";
import { FontStyleValue, TextEditRightSideProps } from "../model/types";
import { useMediaStore } from "@/entities/media/useMediaStore";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import MatchWidthDropdown from "@/shared/ui/atoms/Dropdown/ui/MatchWidthDropdown";
import {
  FONT_STYLE_ITEMS,
  FONT_STYLE_LABEL_BY_VALUE,
  FONT_WEIGHT_ITEMS,
  FONT_WEIGHT_LABEL_BY_VALUE,
  TextBackgroundColorItems,
  TextShadowItems,
} from "../constants";
import TextInputField from "./_component/TextInputField/ui/TextInputField";
import LabeledSlider from "./_component/LabeledSlider";
import { useDropdown } from "../model/useDropdown";

export default function TextEditRightSide({ selectedTrackId }: TextEditRightSideProps) {
  const { localText, localFontSize, handleTextChange, handleFontSizeChange } = useDebouncedTextEdit(selectedTrackId);

  const textElement = useMediaStore((state) =>
    state.media.textElement.find((element) => element.id === selectedTrackId)
  );
  const updateSameLaneTextElement = useMediaStore((state) => state.updateSameLaneTextElement);

  const { selectedColor, handleColorChange } = useBackgroundColor(selectedTrackId);

  const { selectedShadowName, intensity, handleShadowPresetChange, handleIntensityChange } =
    useTextShadow(selectedTrackId);

  const currentLineHeight = textElement?.lineHeight ?? 1.25;
  const currentFontWeight = textElement?.fontWeight ?? 600;
  const currentLetterSpacing = textElement?.letterSpacing ?? 0;
  const currentBackgroundOpacity = textElement?.backgroundOpacity ?? 0.75;
  const currentFontStyle = textElement?.fontStyle ?? "normal";

  const bgDropdown = useDropdown<HTMLButtonElement>();
  const shadowDropdown = useDropdown<HTMLButtonElement>();
  const fontWeightDropdown = useDropdown<HTMLButtonElement>();
  const fontStyleDropdown = useDropdown<HTMLButtonElement>();

  const currentFontWeightLabel = FONT_WEIGHT_LABEL_BY_VALUE[currentFontWeight] ?? `${currentFontWeight}`;
  const currentFontStyleLabel =
    FONT_STYLE_LABEL_BY_VALUE[(currentFontStyle as FontStyleValue) ?? "normal"] ?? currentFontStyle;

  const handleLineHeightChange = (value: number) => {
    if (!selectedTrackId) return;
    updateSameLaneTextElement(selectedTrackId, { lineHeight: value });
  };

  const handleFontWeightChange = (value: number) => {
    if (!selectedTrackId) return;
    updateSameLaneTextElement(selectedTrackId, { fontWeight: value });
  };

  const handleLetterSpacingChange = (value: number) => {
    if (!selectedTrackId) return;
    updateSameLaneTextElement(selectedTrackId, { letterSpacing: value });
  };

  const handleBackgroundOpacityChange = (value: number) => {
    if (!selectedTrackId) return;
    // 0-100 슬라이더 값을 0-1로 정규화
    const normalized = Math.max(0, Math.min(100, value)) / 100;
    updateSameLaneTextElement(selectedTrackId, { backgroundOpacity: normalized });
  };

  const handleFontStyleChange = (value: string) => {
    if (!selectedTrackId) return;
    updateSameLaneTextElement(selectedTrackId, { fontStyle: value });
  };

  const handleFontWeightPresetChange = (label: string) => {
    const entry = Object.entries(FONT_WEIGHT_LABEL_BY_VALUE).find(([, v]) => v === label);
    if (!entry) return;

    const [weightStr] = entry;
    handleFontWeightChange(Number(weightStr));
  };

  const handleFontStylePresetChange = (label: string) => {
    const entry = Object.entries(FONT_STYLE_LABEL_BY_VALUE).find(([, v]) => v === label);
    if (!entry) return;

    const [styleValue] = entry;
    handleFontStyleChange(styleValue as FontStyleValue);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 w-full">
          <TextInputField
            label="Text Content"
            placeholder="Text Content"
            value={localText}
            onChange={handleTextChange}
          />

          <TextInputField
            label="Font Size"
            placeholder="Font Size"
            value={localFontSize}
            onChange={handleFontSizeChange}
          />

          {/* Text Background */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Text Background</span>
            </div>
            <Button className="w-full" variant="dark" onClick={bgDropdown.open} ref={bgDropdown.triggerRef}>
              {selectedColor || "None"}
              <MatchWidthDropdown
                isOpen={bgDropdown.isOpen}
                setIsOpen={bgDropdown.setIsOpen}
                dropdownItems={TextBackgroundColorItems}
                handleSelectEvent={handleColorChange}
                position="bottom"
                targetEl={bgDropdown.triggerRef.current}
              />
            </Button>
          </div>

          {/* Text Shadow */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Text Shadow</span>
            </div>
            <Button className="w-full" variant="dark" onClick={shadowDropdown.open} ref={shadowDropdown.triggerRef}>
              {selectedShadowName || "None"}
              <MatchWidthDropdown
                isOpen={shadowDropdown.isOpen}
                setIsOpen={shadowDropdown.setIsOpen}
                dropdownItems={TextShadowItems}
                handleSelectEvent={handleShadowPresetChange}
                position="bottom"
                targetEl={shadowDropdown.triggerRef.current}
              />
            </Button>
          </div>

          {/* Font weight */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Font Weight</span>
            </div>

            <Button
              className="w-full mt-1"
              variant="dark"
              onClick={fontWeightDropdown.open}
              ref={fontWeightDropdown.triggerRef}
            >
              {currentFontWeightLabel}
              <MatchWidthDropdown
                isOpen={fontWeightDropdown.isOpen}
                setIsOpen={fontWeightDropdown.setIsOpen}
                dropdownItems={FONT_WEIGHT_ITEMS}
                handleSelectEvent={(label) => handleFontWeightPresetChange(label as string)}
                position="bottom"
                targetEl={fontWeightDropdown.triggerRef.current}
              />
            </Button>
          </div>

          {/* Font style */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Font Style</span>
            </div>

            <Button
              className="w-full mt-1"
              variant="dark"
              onClick={fontStyleDropdown.open}
              ref={fontStyleDropdown.triggerRef}
            >
              {currentFontStyleLabel}
              <MatchWidthDropdown
                isOpen={fontStyleDropdown.isOpen}
                setIsOpen={fontStyleDropdown.setIsOpen}
                dropdownItems={FONT_STYLE_ITEMS}
                handleSelectEvent={(label) => handleFontStylePresetChange(label as string)}
                position="bottom"
                targetEl={fontStyleDropdown.triggerRef.current}
              />
            </Button>
          </div>

          <LabeledSlider
            className="mt-2"
            label="Shadow Intensity"
            displayValue={String(intensity)}
            min={0}
            max={100}
            step={1}
            value={intensity}
            onChange={handleIntensityChange}
          />

          {/* Line height */}
          <LabeledSlider
            label="Line Height"
            displayValue={currentLineHeight.toFixed(2)}
            min={1}
            max={1.6}
            step={0.05}
            value={currentLineHeight}
            onChange={handleLineHeightChange}
          />

          {/* Letter spacing */}
          <LabeledSlider
            className="mt-3"
            label="Letter Spacing"
            displayValue={`${currentLetterSpacing.toFixed(2)}em`}
            min={-0.03}
            max={0.08}
            step={0.01}
            value={currentLetterSpacing}
            onChange={handleLetterSpacingChange}
          />

          {/* Background opacity */}
          <LabeledSlider
            className="mt-3"
            label="Background Opacity"
            displayValue={`${Math.round(currentBackgroundOpacity * 100)}%`}
            min={0}
            max={100}
            step={5}
            value={Math.round(currentBackgroundOpacity * 100)}
            onChange={handleBackgroundOpacityChange}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useDebouncedTextEdit } from "../model/useDebouncedTextEdit";
import { useBackgroundColor } from "../model/useBackgroundColor";
import { TextEditRightSideProps } from "../model/types";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import MatchWidthDropdown from "@/shared/ui/atoms/Dropdown/ui/MatchWidthDropdown";
import { TextBackgroundColorItems } from "../constants";
import TextInputField from "./_component/TextInputField/ui/TextInputField";

export default function TextEditRightSide({ selectedTrackId }: TextEditRightSideProps) {
  const { localText, localFontSize, handleTextChange, handleFontSizeChange } = useDebouncedTextEdit(selectedTrackId);

  const { isDropdownOpen, setIsDropdownOpen, selectedColor, handleColorChange, dropdownRef } =
    useBackgroundColor(selectedTrackId);

  return (
    <div className="w-full h-full flex flex-col gap-2">
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

          <h1>Text Background</h1>
          <Button className="w-full" variant="dark" onClick={() => setIsDropdownOpen(true)} ref={dropdownRef}>
            {selectedColor || "None"}
            <MatchWidthDropdown
              isOpen={isDropdownOpen}
              setIsOpen={setIsDropdownOpen}
              dropdownItems={TextBackgroundColorItems}
              handleSelectEvent={handleColorChange}
              position="bottom"
              targetEl={dropdownRef.current}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

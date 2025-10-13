"use client";

import Button from "@/shared/ui/atoms/Button/ui/Button";
import MatchWidthDropdown from "@/shared/ui/atoms/Dropdown/ui/MatchWidthDropdown";
import Input from "@/shared/ui/atoms/Input/ui/Input";
import { EffectType } from "@/entities/media/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRef, useState } from "react";

interface EffectDropdownProps {
  label: string;
  isActive: boolean;
  effectName: string;
  duration?: number;
  dropdownItems: readonly { id: number; name: EffectType }[];
  onEffectChange: (effect: EffectType) => void;
  onDurationChange?: (value: number) => void;
}

export default function EffectDropdown({
  label,
  isActive,
  effectName,
  duration,
  dropdownItems,
  onEffectChange,
  onDurationChange,
}: EffectDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <h4>{label}</h4>
      <Button className="w-full" variant="dark" onClick={() => setIsDropdownOpen(true)} ref={dropdownRef}>
        <div className="flex items-center gap-2">
          <div className="flex w-full justify-between items-center">
            <span>{isActive ? effectName : "None"}</span>
            {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          <MatchWidthDropdown
            isOpen={isDropdownOpen}
            setIsOpen={setIsDropdownOpen}
            dropdownItems={dropdownItems}
            handleSelectEvent={onEffectChange}
            position="bottom"
            targetEl={dropdownRef.current}
          />
        </div>
      </Button>
      {isActive && duration !== undefined && onDurationChange && (
        <Input type="number" value={duration} onChange={(e) => onDurationChange(Number(e.target.value))} />
      )}
    </div>
  );
}

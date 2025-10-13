import { useRef, useEffect, ReactNode } from "react";

type DropdownPosition = "top" | "bottom" | "left" | "right";
type DropdownSize = "sm" | "md" | "lg";

interface DropdownItem1 {
  id: string | number;
  name: string;
  icon?: ReactNode;
}

interface DropdownItem2 {
  label: string;
  icon?: ReactNode;
}

type DropdownItem = DropdownItem1 | DropdownItem2;

interface DropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  dropdownItems: readonly DropdownItem[];
  handleSelectEvent?: (item: string) => void;
  position?: DropdownPosition; // 위치 옵션 추가
  size?: DropdownSize;
}

export default function Dropdown({
  isOpen,
  setIsOpen,
  dropdownItems,
  handleSelectEvent,
  position = "bottom", // 기본값은 아래쪽
  size = "md",
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // 위치에 따른 CSS 클래스 결정
  const getPositionClasses = (position: DropdownPosition): string => {
    switch (position) {
      case "top":
        return "bottom-full left-0 mb-1";
      case "bottom":
        return "top-full left-0 mt-1";
      case "left":
        return "right-full top-0 mr-1";
      case "right":
        return "left-full top-0 ml-1";
      default:
        return "top-full left-0 mt-1";
    }
  };

  const getSizeClasses = (size: DropdownSize): string => {
    switch (size) {
      case "sm":
        return "w-32";
      case "md":
        return "w-48";
      case "lg":
        return "w-56";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen && (
        <div
          className={`absolute ${getPositionClasses(position)} ${getSizeClasses(
            size
          )} bg-black dark-border z-50 shadow-lg rounded-md overflow-hidden`}
        >
          {dropdownItems.map((item, index) => {
            const label = "name" in item ? item.name : item.label;
            const key = "id" in item ? item.id : label ?? index;

            return (
              <div
                onClick={() => {
                  setIsOpen(false);
                  handleSelectEvent?.(label);
                }}
                key={key}
                className="text-white py-2 px-2 cursor-pointer transition-colors duration-200 text-sm"
              >
                <div className="flex gap-2 py-2 px-4 dark-button-hover rounded-md">
                  {item.icon}
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

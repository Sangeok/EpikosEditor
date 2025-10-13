import ReactDOM from "react-dom";
import { useEffect, useRef, useState } from "react";
import { EffectType } from "@/entities/media/types";

type DropdownPosition = "top" | "bottom" | "left" | "right";

type DropdownItem = string | { name: string; [key: string]: unknown };

interface MatchWidthDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  dropdownItems: readonly DropdownItem[];
  handleSelectEvent?: (item: EffectType) => void;
  position?: DropdownPosition; // 위치 옵션 추가
  targetEl?: HTMLElement | null; // 직접 DOM 요소를 받는 prop 추가
}

export default function MatchWidthDropdown({
  isOpen,
  dropdownItems,
  setIsOpen,
  handleSelectEvent,
  targetEl,
}: MatchWidthDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  // 위치 계산 완료 상태 추가
  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);

  // 드롭다운 위치를 트리거 요소 기준으로 계산
  useEffect(() => {
    if (isOpen) {
      setIsPositionReady(false);

      const element = targetEl;
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });

        setIsPositionReady(true);
      }
    } else {
      setIsPositionReady(false);
    }
  }, [isOpen, targetEl]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !(targetEl as HTMLElement | null)?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, setIsOpen, targetEl]);

  // 드롭다운이 닫혀있거나 위치가 계산되지 않았으면 렌더링하지 않음
  if (!isOpen || !isPositionReady) return null;

  // 항목 클릭 핸들러
  const handleItemClick = (item: DropdownItem) => {
    // 약간의 지연을 주어 이벤트 처리 보장
    setTimeout(() => {
      const valueToPass = typeof item === "string" ? item : item.name;
      handleSelectEvent?.(valueToPass as EffectType);
      setIsOpen(false);
    }, 10);
  };

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className="bg-black dark-border z-50 shadow-lg rounded-md overflow-hidden text-white"
      style={{
        position: "fixed", // absolute 대신 fixed 사용
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        pointerEvents: "auto", // 이벤트 전파 보장
      }}
      onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
    >
      {dropdownItems && dropdownItems.length > 0 ? (
        dropdownItems.map((item: DropdownItem, index: number) => (
          <div
            key={index}
            className="dropdown-item px-4 py-3 dark-button-hover text-center cursor-pointer whitespace-nowrap"
            onMouseDown={(e) => {
              e.preventDefault(); // 포커스 방지
              e.stopPropagation(); // 이벤트 버블링 방지
              handleItemClick(item);
            }}
          >
            {typeof item === "string" ? item : item.name}
          </div>
        ))
      ) : (
        <div className="px-4 py-3 text-center">항목 없음</div>
      )}
    </div>,
    document.body
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { TooltipPortalVariants } from "../lib/variants";

interface TooltipProps {
  children: React.ReactNode; // trigger 요소
  content: React.ReactNode; // tooltip 내용
  position?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md";
  theme?: "dark" | "light";
  disabled?: boolean;
  className?: string;
}

const delay = 100;

export default function Tooltip({
  children,
  content,
  position = "top",
  size = "md",
  theme = "dark",
  disabled = false,
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let x = 0;
    let y = 0;

    switch (position) {
      case "top":
        x = rect.left + scrollX + rect.width / 2;
        y = rect.top + scrollY;
        break;
      case "bottom":
        x = rect.left + scrollX + rect.width / 2;
        y = rect.bottom + scrollY;
        break;
      case "left":
        x = rect.left + scrollX;
        y = rect.top + scrollY + rect.height / 2;
        break;
      case "right":
        x = rect.right + scrollX;
        y = rect.top + scrollY + rect.height / 2;
        break;
    }

    setTooltipPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        calculatePosition();
        setIsVisible(true);
        // 약간의 지연 후에 실제 표시 (애니메이션을 위해)
        setTimeout(() => setShowTooltip(true), 10);
      }, delay);
    } else {
      calculatePosition();
      setIsVisible(true);
      setTimeout(() => setShowTooltip(true), 10);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setShowTooltip(false);
    // 애니메이션 완료 후 숨기기
    setTimeout(() => setIsVisible(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className={TooltipPortalVariants({
              size,
              theme,
              position,
              visible: showTooltip,
              className,
            })}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
            role="tooltip"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// Zoom 설정 상수
const PLAYER_ZOOM = {
  MIN: 0.5,
  MAX: 2,
  STEP: 0.1,
} as const;

// 반환 타입 정의
interface UsePlayerZoomReturn {
  zoom: number;
  playerContainerRef: React.RefObject<HTMLDivElement | null>;
  zoomControls: {
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
  };
}

/**
 * Player 컨테이너 zoom 관리 훅
 * - Ctrl + 마우스 휠로 zoom 조절 (0.5x ~ 2x)
 * - playerContainerRef를 반환하여 컨테이너에 연결
 * - 수동 zoom 컨트롤 제공 (zoomIn, zoomOut, resetZoom)
 */
export function usePlayerZoom(): UsePlayerZoomReturn {
  const [zoom, setZoom] = useState<number>(1);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Zoom 값을 범위 내로 제한
  const clampZoom = useCallback((value: number): number => {
    return Math.max(PLAYER_ZOOM.MIN, Math.min(PLAYER_ZOOM.MAX, value));
  }, []);

  // Wheel 이벤트 핸들러 (Ctrl + 휠)
  const handleZoomWheel = useCallback(
    (event: WheelEvent) => {
      if (!event.ctrlKey) {
        return;
      }

      const containerNode = playerContainerRef.current;
      if (!containerNode || !containerNode.contains(event.target as Node)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const delta = event.deltaY < 0 ? PLAYER_ZOOM.STEP : -PLAYER_ZOOM.STEP;
      setZoom((prev) => clampZoom(prev + delta));
    },
    [clampZoom]
  );

  // 수동 zoom 컨트롤
  const zoomIn = useCallback(() => {
    setZoom((prev) => clampZoom(prev + PLAYER_ZOOM.STEP));
  }, [clampZoom]);

  const zoomOut = useCallback(() => {
    setZoom((prev) => clampZoom(prev - PLAYER_ZOOM.STEP));
  }, [clampZoom]);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  // Wheel 이벤트 리스너 등록/해제
  useEffect(() => {
    window.addEventListener("wheel", handleZoomWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleZoomWheel);
    };
  }, [handleZoomWheel]);

  return {
    zoom,
    playerContainerRef,
    zoomControls: {
      zoomIn,
      zoomOut,
      resetZoom,
    },
  };
}

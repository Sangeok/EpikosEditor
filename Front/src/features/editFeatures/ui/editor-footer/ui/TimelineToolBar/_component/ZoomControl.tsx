"use client";

import { ZoomIn, ZoomOut } from "lucide-react";
import clsx from "clsx";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";

export default function ZoomControl() {
  const { zoom, zoomIn, zoomOut, setZoom } = useTimelineStore();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    // 슬라이더 값(0-100)을 zoom 레벨(1-10)로 변환
    const zoomLevel = 1 + (value / 100) * 9;
    setZoom(zoomLevel);
  };

  // zoom 레벨(1-10)을 슬라이더 값(0-100)으로 변환
  const sliderValue = ((zoom - 1) / 9) * 100;

  // zoom 버튼 비활성화 상태 계산
  const isZoomOutDisabled = zoom <= 1;
  const isZoomInDisabled = zoom >= 10;

  return (
    <div className="flex items-center gap-2">
      {/* Zoom Out 버튼 */}
      <IconButton
        onClick={zoomOut}
        className={clsx(
          "p-1 hover:bg-white/10 rounded",
          isZoomOutDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
        disabled={isZoomOutDisabled}
      >
        <ZoomOut size={16} />
      </IconButton>

      {/* Zoom 슬라이더 */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none 
                   [&::-webkit-slider-thumb]:w-3 
                   [&::-webkit-slider-thumb]:h-3 
                   [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:bg-white 
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:w-3 
                   [&::-moz-range-thumb]:h-3 
                   [&::-moz-range-thumb]:rounded-full 
                   [&::-moz-range-thumb]:bg-white 
                   [&::-moz-range-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:border-none"
        />
      </div>

      {/* Zoom In 버튼 */}
      <IconButton
        onClick={zoomIn}
        className={clsx(
          "p-1 hover:bg-white/10 rounded",
          isZoomInDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
        disabled={isZoomInDisabled}
      >
        <ZoomIn size={16} />
      </IconButton>
    </div>
  );
}

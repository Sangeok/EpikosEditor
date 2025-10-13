"use client";

import { useRef } from "react";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { calculateTicks } from "@/features/editFeatures/ui/editor-footer/lib/zoomUtils";
import { useMediaStore } from "@/entities/media/useMediaStore";

export default function TimelineRuler() {
  const rulerRef = useRef<HTMLDivElement>(null);

  const { media } = useMediaStore();
  const duration = media.projectDuration || 0;
  const { zoom, pixelsPerSecond, viewportStartTime, viewportEndTime, setTimelineClick } = useTimelineStore();

  // calculate ticks(눈금)
  const { majorTicks, minorTicks } = calculateTicks(viewportStartTime, viewportEndTime, zoom, pixelsPerSecond);

  // move time by clicking
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!rulerRef.current) return;

    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickedTime = clickX / pixelsPerSecond;

    // move only within duration range
    const clampedTime = Math.max(0, Math.min(clickedTime, duration));
    setTimelineClick(clampedTime);
  };

  return (
    <div ref={rulerRef} className="relative h-8 bg-black overflow-hidden cursor-pointer" onClick={handleTimelineClick}>
      {/* background */}
      <div className="absolute inset-0 bg-black" />

      {/* minor ticks */}
      {minorTicks.map((tick: { time: number; position: number }, index: number) => (
        <div
          key={`minor-${index}`}
          className="absolute top-4 w-px h-4 bg-gray-600"
          style={{
            left: `${tick.position}px`,
          }}
        />
      ))}

      {/* major ticks and time labels */}
      {majorTicks.map((tick: { time: number; position: number; label: string }, index: number) => (
        <div
          key={`major-${index}`}
          className="absolute top-0 flex flex-col items-center"
          style={{
            left: `${tick.position}px`,
            transform: "translateX(-50%)",
          }}
        >
          {/* time label */}
          <span className="text-xs text-gray-600 mb-1 whitespace-nowrap">{tick.label}</span>
          {/* major ticks */}
          <div className="w-px h-6 bg-gray-600" />
        </div>
      ))}

      {/* 0s baseline */}
      <div className="absolute top-0 left-0 w-px h-full bg-white/50" />
    </div>
  );
}

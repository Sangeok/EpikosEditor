"use client";

import { memo } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { useCurrentTimeIndicator } from "../model/hooks/useCurrentTimeIndicator";

const CurrentTimeIndicator = memo(() => {
  const { media } = useMediaStore();
  const duration = media.projectDuration || 0;

  const { currentTimePosition, leftPosition } = useCurrentTimeIndicator();

  // if there is no duration( any media is not loaded), hide the current time indicator
  if (duration <= 0) {
    return null;
  }

  // if the current time position or left position is less than 0, hide the current time indicator
  if (currentTimePosition < 0 || leftPosition < 0) {
    return null;
  }

  return (
    <div
      className="absolute left-0 top-0 w-0.5 h-full pointer-events-none z-[150]"
      style={{
        transform: `translateX(${leftPosition}px)`,
      }}
    >
      {/* vertical line */}
      <div className="absolute left-0 w-0.5 h-full bg-white shadow-md" />

      {/* top circular display */}
      <div
        className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-gray-100 border-gray-300"
        style={{
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        }}
      />
    </div>
  );
});

CurrentTimeIndicator.displayName = "CurrentTimeIndicator";

export default CurrentTimeIndicator;

"use client";

import { memo } from "react";
import { useSnapGuideStore } from "@/features/editFeatures/model/store/useSnapGuideStore";

/**
 * Vertical snap guide overlay spanning the whole timeline area.
 * Render under CurrentTimeIndicator (z-index lower than 150) but above tracks.
 */
const SnapGuideIndicator = memo(() => {
  const { isVisible, xPositionPx } = useSnapGuideStore();

  if (!isVisible || xPositionPx == null) return null;

  return (
    <div
      className="absolute left-0 top-0 w-0.5 h-full pointer-events-none z-[140]"
      style={{
        transform: `translateX(${xPositionPx}px)`,
      }}
    >
      <div
        className="absolute left-0 h-full w-px opacity-90"
        style={{
          background: "#9370DB",
          boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
        }}
      />
    </div>
  );
});

SnapGuideIndicator.displayName = "SnapGuideIndicator";

export default SnapGuideIndicator;

"use client";

import { memo } from "react";
import { PLAYER_CONFIG } from "@/features/editFeatures/ui/player/config/playerConfig";

const BaseSmartGuide = memo(() => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 999,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `${PLAYER_CONFIG.COMPOSITION_WIDTH / 2}px`,
          top: 0,
          width: "1px",
          height: "100%",
          background: "#9370DB",
          opacity: 0.9,
          boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: `${PLAYER_CONFIG.COMPOSITION_HEIGHT / 2}px`,
          left: 0,
          width: "100%",
          height: "1px",
          background: "#9370DB",
          opacity: 0.9,
          boxShadow: "0 0 0 1px rgba(147,112,219,0.6)",
        }}
      />
    </div>
  );
});

BaseSmartGuide.displayName = "BaseSmartGuide";

export default BaseSmartGuide;

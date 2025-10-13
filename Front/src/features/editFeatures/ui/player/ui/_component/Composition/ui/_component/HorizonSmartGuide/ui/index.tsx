"use client";

import { useSmartGuideStore } from "@/features/editFeatures/ui/player/model/hooks/useSmartGuideStore";

export default function HorizonSmartGuide() {
  const nearObjEdgeData = useSmartGuideStore((state) => state.nearObjEdgeData);

  return (
    <div
      style={{
        position: "absolute",
        top: (nearObjEdgeData?.edgeXorYPosition ?? 0) - 2.5,
        left: 0,
        width: "100%",
        height: 5,
        zIndex: 999,
        pointerEvents: "none",
        backgroundColor: "red",
      }}
    />
  );
}

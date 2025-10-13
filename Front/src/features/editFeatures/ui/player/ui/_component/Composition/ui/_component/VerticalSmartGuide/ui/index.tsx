"use client";

import { useSmartGuideStore } from "@/features/editFeatures/ui/player/model/hooks/useSmartGuideStore";

export default function VerticalSmartGuide() {
  const nearObjEdgeData = useSmartGuideStore((state) => state.nearObjEdgeData);

  return (
    <div
      style={{
        position: "absolute",
        left: nearObjEdgeData?.edgeXorYPosition ?? 0,
        top: nearObjEdgeData?.top ?? 0,
        width: 5,
        height: nearObjEdgeData?.height ?? 0,
        zIndex: 999,
        pointerEvents: "none",
        backgroundColor: "red",
      }}
    />
  );
}

"use client";

import { use } from "react";
import { useCheckProject } from "@/page/editPage/model/hooks/useCheckProject";
import Player from "@/features/editFeatures/ui/player/ui/Player";
import { usePlayerZoom } from "../model/hooks/usePlayerZomm";
import { PLAYER_CONFIG } from "@/features/editFeatures/ui/player/config/playerConfig";

interface EditPageProps {
  params: Promise<{ projectId: string }>;
}

export default function EditPage({ params }: EditPageProps) {
  const { projectId } = use(params);

  const { isLoading, projectExists } = useCheckProject({ projectId });
  const { zoom, playerContainerRef } = usePlayerZoom();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center">
        <div className="text-white">Loading project...</div>
      </div>
    );
  }

  if (!projectExists) {
    return null;
  }

  return (
    <div className="flex flex-col h-full w-full justify-center items-center bg-zinc-950 overflow-hidden">
      <div
        ref={playerContainerRef}
        style={{
          width: `${PLAYER_CONFIG.PLAYER_DISPLAY_WIDTH}px`,
          height: "100%",
          overflow: "hidden",
          transform: `scale(${zoom})`,
        }}
      >
        <Player />
      </div>
    </div>
  );
}

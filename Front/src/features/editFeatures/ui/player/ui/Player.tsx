"use client";

import { Player as RemotionPlayer } from "@remotion/player";
import { useMediaStore } from "@/entities/media/useMediaStore";
import Composition from "./_component/Composition/ui";
import { usePlayerController } from "../model/hooks/usePlayerController";
import { usePlayerSync } from "../model/hooks/usePlayerSync";
import { PlayerService } from "../model/services/playerService";
import { PLAYER_CONFIG } from "../config/playerConfig";

export default function Player() {
  const fps = useMediaStore((state) => state.media.fps);
  const projectDuration = useMediaStore((state) => state.media.projectDuration);

  const playerController = usePlayerController({ projectDuration });

  // synchronize timeline and player
  usePlayerSync({
    playerRef: playerController.playerRef,
    fps,
  });

  // show message if no media
  if (projectDuration === 0) {
    return <div>No media</div>;
  }

  const durationInFrames = PlayerService.getDurationInFrames(
    projectDuration,
    fps
  );

  return (
    <RemotionPlayer
      ref={playerController.playerRef}
      component={Composition}
      durationInFrames={durationInFrames}
      compositionWidth={PLAYER_CONFIG.COMPOSITION_WIDTH}
      compositionHeight={PLAYER_CONFIG.COMPOSITION_HEIGHT}
      fps={fps}
      style={{
        width: `${PLAYER_CONFIG.PLAYER_DISPLAY_WIDTH}px`,
        height: "100%",
        border: "2px solid #333",
        borderRadius: "10px",
        overflow: "hidden",
      }}
      overflowVisible
      acknowledgeRemotionLicense={true}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
    />
  );
}

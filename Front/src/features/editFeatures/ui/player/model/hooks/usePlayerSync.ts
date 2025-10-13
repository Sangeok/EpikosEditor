"use client";

import { useEffect, useRef, RefObject } from "react";
import { PlayerRef } from "@remotion/player";
import { PlayerService } from "../services/playerService";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";

interface UsePlayerSyncProps {
  playerRef: RefObject<PlayerRef | null>;
  fps: number;
}

/**
 * synchronize timeline and player
 * handle currentTime synchronization and periodic state updates
 */
export const usePlayerSync = ({ playerRef, fps }: UsePlayerSyncProps) => {
  const { currentTime, isPlaying, setCurrentTime } = useTimelineStore();

  // Track sync state with timestamps to prevent circular updates
  const syncStateRef = useRef<{
    lastPlayerUpdate: number;
    lastTimelineUpdate: number;
  }>({
    lastPlayerUpdate: -1,
    lastTimelineUpdate: -1,
  });

  // synchronize player based on timeline's currentTime
  // Works when stopping the player and dragging the timeline
  useEffect(() => {
    // Ignore timeline updates that happen within 100ms of player updates
    // This prevents circular references
    if (Date.now() - syncStateRef.current.lastPlayerUpdate < 100) {
      return;
    }

    if (playerRef.current && !isPlaying) {
      const frameToSeek = PlayerService.timeToFrame(currentTime, fps);
      const currentFrame = playerRef.current.getCurrentFrame();

      // only seek if the current frame is different
      if (Math.abs(currentFrame - frameToSeek) > 1) {
        syncStateRef.current.lastTimelineUpdate = Date.now();
        playerRef.current.seekTo(frameToSeek);
      }
    }
  }, [currentTime, fps, playerRef, isPlaying]);

  // synchronize player state periodically
  // synchronize timeline based on player's currentTime
  useEffect(() => {
    if (!isPlaying) return;

    // update roughly every 33ms (~30Hz) for smoother ms precision without overloading
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentFrame = playerRef.current.getCurrentFrame();
        const timeInSeconds = PlayerService.frameToTime(currentFrame, fps);
        const roundedTime = PlayerService.roundTime(timeInSeconds);

        // only update if the value actually changed
        if (roundedTime !== currentTime) {
          syncStateRef.current.lastPlayerUpdate = Date.now();
          setCurrentTime(roundedTime);
        }
      }
    }, 33);

    return () => clearInterval(interval);
  }, [isPlaying, fps, playerRef, setCurrentTime, currentTime]);
};

"use client";

import { useRef, useEffect, RefObject } from "react";
import { PlayerRef } from "@remotion/player";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { PlayerService } from "../services/playerService";

interface UsePlayerControllerReturn {
  playerRef: RefObject<PlayerRef | null>;
  play: () => void;
  pause: () => void;
  seekTo: (time: number, fps: number) => void;
}

/**
 * control RemotionPlayer
 * provide play/pause, seek functionality
 */
export const usePlayerController = ({
  projectDuration,
}: {
  projectDuration: number;
}): UsePlayerControllerReturn => {
  const playerRef = useRef<PlayerRef>(null);
  const isPlaying = useTimelineStore((state) => state.isPlaying);

  // control RemotionPlayer based on timeline's playing state
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  }, [isPlaying]);

  const play = () => {
    if (projectDuration > 0 && playerRef.current) {
      playerRef.current.play();
    }
  };

  const pause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  const seekTo = (time: number, fps: number) => {
    if (playerRef.current) {
      const frameToSeek = PlayerService.timeToFrame(time, fps);
      playerRef.current.seekTo(frameToSeek);
    }
  };

  return {
    playerRef,
    play,
    pause,
    seekTo,
  };
};

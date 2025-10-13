"use client";

import { useEffect, useMemo } from "react";
import useTimelineStore, {
  TimelineStore,
} from "@/features/editFeatures/model/store/useTimelineStore";
import { useMediaStore } from "@/entities/media/useMediaStore";

// high precision timer
let playbackTimer: number | null = null;

const startTimer = (store: () => TimelineStore) => {
  if (playbackTimer) cancelAnimationFrame(playbackTimer);
  let lastUpdate = performance.now();

  const updateTime = () => {
    const state = store();
    if (state.isPlaying) {
      const now = performance.now();
      const delta = (now - lastUpdate) / 1000; // milliseconds to seconds
      lastUpdate = now;

      const newTime = state.currentTime + delta;
      const { media } = useMediaStore.getState();
      const duration = media.projectDuration || 0;

      if (newTime < duration) {
        state.setCurrentTime(newTime);
        playbackTimer = requestAnimationFrame(updateTime);
      } else {
        state.setCurrentTime(duration);
        state.setIsPlaying(false);
      }
    }
  };

  playbackTimer = requestAnimationFrame(updateTime);
};

const stopTimer = () => {
  if (playbackTimer) {
    cancelAnimationFrame(playbackTimer);
    playbackTimer = null;
  }
};

export const useCurrentTimeIndicator = () => {
  const { currentTime, pixelsPerSecond, isPlaying } = useTimelineStore();

  // high precision timer management
  useEffect(() => {
    if (isPlaying) {
      startTimer(useTimelineStore.getState);
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [isPlaying]);

  // when the component is unmounted, stop the timer
  useEffect(() => {
    return () => stopTimer();
  }, []);

  // calculate the position of the current time indicator
  // currentTimeIndicator : current time (seconds)
  const currentTimePosition = useMemo(() => {
    return currentTime;
  }, [currentTime]);

  // currentTimeIndicator Pixel position
  const leftPosition = useMemo(() => {
    return currentTimePosition * pixelsPerSecond;
  }, [currentTimePosition, pixelsPerSecond]);

  // automatic scroll system
  useEffect(() => {
    // find the timeline container using DOM query
    const container = document.querySelector(
      "[data-timeline-container]"
    ) as HTMLDivElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const indicatorPx = leftPosition;

    // 100px buffer for predictive scroll
    const bufferZone = 100;
    const shouldScrollLeft = indicatorPx < scrollLeft + bufferZone;
    const shouldScrollRight =
      indicatorPx > scrollLeft + containerWidth - bufferZone;

    if (shouldScrollLeft || shouldScrollRight) {
      const targetScroll = Math.max(0, indicatorPx - containerWidth / 2);
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  }, [leftPosition]);

  return {
    currentTimePosition,
    leftPosition,
  };
};

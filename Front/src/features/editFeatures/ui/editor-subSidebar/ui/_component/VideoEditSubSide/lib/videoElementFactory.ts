import { MediaElement } from "@/entities/media/types";

const DEFAULT_OPACITY = 1;
const DEFAULT_ROTATION = "0deg";
const DEFAULT_VISIBILITY = "visible" as const;
const DEFAULT_POSITION = "50%";
const DEFAULT_VOLUME = 50;
const DEFAULT_SPEED = 1;

interface VideoData {
  url: string;
  duration: number;
  width: number;
  height: number;
}

export function createVideoElement(videoData: VideoData, laneId: string): MediaElement {
  return {
    id: generateVideoId(),
    type: "video",
    laneId,
    startTime: 0,
    endTime: videoData.duration,
    duration: videoData.duration,
    url: videoData.url,
    width: videoData.width,
    height: videoData.height,
    opacity: DEFAULT_OPACITY,
    rotate: DEFAULT_ROTATION,
    visibility: DEFAULT_VISIBILITY,
    top: DEFAULT_POSITION,
    left: DEFAULT_POSITION,
    volume: DEFAULT_VOLUME,
    speed: DEFAULT_SPEED,
  };
}

function generateVideoId(): string {
  return `video-${Date.now()}-${Math.random()}`;
}

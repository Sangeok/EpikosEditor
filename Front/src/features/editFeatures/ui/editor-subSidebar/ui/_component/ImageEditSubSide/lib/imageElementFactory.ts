import { MediaElement } from "@/entities/media/types";

const DEFAULT_IMAGE_DURATION = 5;
const DEFAULT_IMAGE_WIDTH = 400;
const DEFAULT_IMAGE_HEIGHT = 300;
const DEFAULT_OPACITY = 1;
const DEFAULT_ROTATION = "0deg";
const DEFAULT_VISIBILITY = "visible" as const;
const DEFAULT_POSITION = "50%";
const DEFAULT_VOLUME = 0;
const DEFAULT_SPEED = 1;

export function createImageElement(imageUrl: string, laneId: string): MediaElement {
  return {
    id: generateImageId(),
    type: "image",
    laneId,
    startTime: 0,
    endTime: DEFAULT_IMAGE_DURATION,
    duration: DEFAULT_IMAGE_DURATION,
    url: imageUrl,
    width: DEFAULT_IMAGE_WIDTH,
    height: DEFAULT_IMAGE_HEIGHT,
    opacity: DEFAULT_OPACITY,
    rotate: DEFAULT_ROTATION,
    visibility: DEFAULT_VISIBILITY,
    top: DEFAULT_POSITION,
    left: DEFAULT_POSITION,
    volume: DEFAULT_VOLUME,
    speed: DEFAULT_SPEED,
  };
}

function generateImageId(): string {
  return `image-${Date.now()}-${Math.random()}`;
}

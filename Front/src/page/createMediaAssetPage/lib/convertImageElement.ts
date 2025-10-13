import { MediaElement } from "@/entities/media/types";
import { ImageDataType } from "@/entities/mediaAsset/types";

const DEFAULT_IMAGE_DURATION = 5;
const DEFAULT_IMAGE_WIDTH = 400;
const DEFAULT_IMAGE_HEIGHT = 300;
const DEFAULT_OPACITY = 1;
const DEFAULT_ROTATION = "0deg";
const DEFAULT_VISIBILITY = "visible" as const;
const DEFAULT_POSITION = "50%";
const DEFAULT_VOLUME = 0;
const DEFAULT_SPEED = 1;

export function convertImageElement(imageData: ImageDataType, laneId: string): MediaElement {
  return {
    id: generateImageId(),
    type: "image",
    laneId,
    startTime: imageData.startTime || 0,
    endTime: imageData.endTime || DEFAULT_IMAGE_DURATION,
    duration: imageData.duration || DEFAULT_IMAGE_DURATION,
    url: imageData.url,
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

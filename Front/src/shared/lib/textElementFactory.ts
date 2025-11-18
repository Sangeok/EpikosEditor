import { TextElement } from "@/entities/media/types";

const DEFAULT_TEXT_DURATION = 5;
const DEFAULT_TEXT_POSITION_X = 425;
const DEFAULT_TEXT_POSITION_Y = 500;
const DEFAULT_TEXT_FONT_SIZE = 120;
const DEFAULT_TEXT_COLOR = "#ffffff";
const DEFAULT_TEXT_BACKGROUND_COLOR = "bg-transparent";
const DEFAULT_TEXT_FONT = "Arial";
const DEFAULT_TEXT_WIDTH = 300;
const DEFAULT_TEXT_HEIGHT = 300;
const DEFAULT_TEXT_ANIMATION = "none";
const DEFAULT_TEXT_ORIGIN = "user";

export function createTextElement(textElementData: Partial<TextElement>, laneId: string): TextElement {
  return {
    id: crypto.randomUUID(),
    type: "text",
    laneId,
    startTime: textElementData.startTime ?? 0,
    endTime: textElementData.endTime ?? DEFAULT_TEXT_DURATION,
    duration: textElementData.duration ?? DEFAULT_TEXT_DURATION,

    text: textElementData.text ?? "No Text",
    positionX: textElementData.positionX ?? DEFAULT_TEXT_POSITION_X,
    positionY: textElementData.positionY ?? DEFAULT_TEXT_POSITION_Y,
    fontSize: textElementData.fontSize ?? DEFAULT_TEXT_FONT_SIZE,
    textColor: textElementData.textColor ?? DEFAULT_TEXT_COLOR,
    backgroundColor: textElementData.backgroundColor ?? DEFAULT_TEXT_BACKGROUND_COLOR,
    font: textElementData.font ?? DEFAULT_TEXT_FONT,
    width: textElementData.width ?? DEFAULT_TEXT_WIDTH,
    height: textElementData.height ?? DEFAULT_TEXT_HEIGHT,
    animation: textElementData.animation ?? DEFAULT_TEXT_ANIMATION,
    origin: textElementData.origin ?? DEFAULT_TEXT_ORIGIN,
  };
}

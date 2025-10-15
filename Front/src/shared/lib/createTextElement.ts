import { TextElement } from "@/entities/media/types";

export const createTextElement = (defaultTextElement: Partial<TextElement>, laneId: string) => {
  return {
    id: crypto.randomUUID(),
    type: "text",
    startTime: defaultTextElement.startTime ?? 0,
    endTime: defaultTextElement.endTime ?? 5,
    duration: defaultTextElement.duration ?? 5,
    text: defaultTextElement.text ?? "",
    laneId,

    positionX: defaultTextElement.positionX ?? 540,
    positionY: defaultTextElement.positionY ?? 480,
    fontSize: defaultTextElement.fontSize ?? 30,
    textColor: defaultTextElement.textColor ?? "#ffffff",
    backgroundColor: defaultTextElement.backgroundColor ?? "#000000",
    font: defaultTextElement.font ?? "Arial",
    width: defaultTextElement.width ?? 900,
    height: defaultTextElement.height ?? 50,
    animation: defaultTextElement.animation ?? "none",
    maxWidth: defaultTextElement.maxWidth ?? "90%",
    whiteSpace: "pre-wrap",
    origin: defaultTextElement.origin ?? "user",
  };
};

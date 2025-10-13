import { AudioElement } from "@/entities/media/types";
import { v4 as uuidv4 } from "uuid";

export function createAudioElement(audioUrl: string, laneId: string): Promise<AudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration;
      const audioElement: AudioElement = {
        id: uuidv4(),
        type: "audio",
        startTime: 0,
        endTime: duration,
        duration: duration,
        laneId,
        url: audioUrl,
        volume: 1,
        speed: 1,
        sourceStart: 0,
      };
      resolve(audioElement);
    });
    audio.addEventListener("error", (e) => {
      reject(e);
    });
  });
}

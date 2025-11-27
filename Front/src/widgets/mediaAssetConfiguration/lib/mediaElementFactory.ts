import { MediaElement } from "@/entities/media/types";
import { ImageDataType } from "@/entities/mediaAsset/types";
import { convertImageElement } from "./convertImageElement";
import { createAudioElement } from "@/shared/lib/audioElementFactory";
import { convertSRTToTextElements, parseSRTContent } from "@/shared/lib/srtUtils";

/**
 * 이미지 데이터 배열을 MediaElement 배열로 변환
 */
export function createImageElements(imageData: ImageDataType[] | undefined, mediaLaneId: string): MediaElement[] {
  if (!imageData) return [];

  return imageData.map((data) => convertImageElement(data, mediaLaneId));
}

/**
 * 다중 TTS URL을 단일 오디오 요소로 변환
 */
export async function createAudioElementFromTTS(ttsUrls: string[] | undefined, audioLaneId: string) {
  if (!ttsUrls || ttsUrls.length === 0) {
    return null;
  }

  let mergedUrl = ttsUrls[0];

  if (ttsUrls.length > 1) {
    try {
      const blobs = await Promise.all(
        ttsUrls.map(async (url) => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch TTS segment: ${response.status}`);
          }
          return response.blob();
        })
      );

      const mimeType = blobs.find((blob) => blob.type)?.type || "audio/mpeg";
      const mergedBlob = new Blob(blobs, { type: mimeType });
      mergedUrl = URL.createObjectURL(mergedBlob);
    } catch (error) {
      console.error("Failed to merge TTS URLs", error);
      return null;
    }
  }

  return await createAudioElement(mergedUrl, audioLaneId, "create-init");
}

/**
 * SRT 자막 문자열을 TextElement 배열로 변환
 */
export function createTextElementsFromSRT(captions: string | undefined, textLaneId: string) {
  if (!captions) return [];

  const parsedEntries = parseSRTContent(captions);
  const textElements = convertSRTToTextElements(parsedEntries);

  return textElements.map((element) => ({
    ...element,
    laneId: textLaneId,
  }));
}

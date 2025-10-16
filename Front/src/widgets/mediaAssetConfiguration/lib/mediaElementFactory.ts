import { MediaElement } from "@/entities/media/types";
import { ImageDataType } from "@/entities/mediaAsset/types";
import { convertImageElement } from "./convertImageElement";
import { createAudioElement } from "@/shared/lib/audioElementFactory";
import { convertSRTToTextElements, parseSRTContent } from "@/shared/lib/srtUtils";

/**
 * 이미지 데이터 배열을 MediaElement 배열로 변환
 */
export function createImageElements(
  imageData: ImageDataType[] | undefined,
  mediaLaneId: string
): MediaElement[] {
  if (!imageData) return [];

  return imageData.map((data) => convertImageElement(data, mediaLaneId));
}

/**
 * TTS URL로부터 오디오 요소 생성
 */
export async function createAudioElementFromTTS(
  ttsUrl: string | undefined,
  audioLaneId: string
) {
  if (!ttsUrl) return null;

  return await createAudioElement(ttsUrl, audioLaneId);
}

/**
 * SRT 자막 문자열을 TextElement 배열로 변환
 */
export function createTextElementsFromSRT(
  captions: string | undefined,
  textLaneId: string
) {
  if (!captions) return [];

  const parsedEntries = parseSRTContent(captions);
  const textElements = convertSRTToTextElements(parsedEntries);

  return textElements.map((element) => ({
    ...element,
    laneId: textLaneId,
  }));
}

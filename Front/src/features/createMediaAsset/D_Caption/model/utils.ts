import axios from "axios";
import { parseSRT, segmentSRTBySentence } from "../lib/sceneSegmentation";
import { CAPTION_CONFIG, ERROR_MESSAGES } from "../constants";

/**
 * Blob URL에서 오디오 파일을 가져와 File 객체로 변환
 */
export async function fetchAudioFile(ttsUrl: string): Promise<File> {
  const response = await fetch(ttsUrl);

  if (!response.ok) {
    throw new Error(`${ERROR_MESSAGES.FETCH_FAILED}: ${response.status}`);
  }

  const blob = await response.blob();
  const fileType = blob.type || CAPTION_CONFIG.AUDIO_TYPE;

  return new File([blob], CAPTION_CONFIG.AUDIO_FILENAME, { type: fileType });
}

/**
 * 자막 생성 API 호출
 */
export async function generateCaptionsAPI(audioFile: File, language: string) {
  const formData = new FormData();
  formData.append("audio", audioFile);
  formData.append("language", language);

  const response = await axios.post("/api/generate-captions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`${ERROR_MESSAGES.CONVERSION_FAILED}: ${response.status}`);
  }

  return response.data;
}

/**
 * 자막 번역 API 호출
 */
export async function translateCaption(text: string, targetLanguage: string): Promise<string> {
  const response = await axios.post("/api/generate-translatedCaption", {
    text,
    targetLanguage,
  });

  return response.data.translatedText;
}

/**
 * SRT 콘텐츠를 파싱하고 씬으로 세그먼트화
 */
export function processSRT(srtContent: string) {
  const subs = parseSRT(srtContent);
  const scenes = segmentSRTBySentence(subs, {
    minDurSec: CAPTION_CONFIG.MIN_DURATION,
    minLastSec: CAPTION_CONFIG.MIN_LAST_DURATION,
  });

  return { subs, scenes };
}

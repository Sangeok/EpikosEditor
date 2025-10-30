export const CAPTION_CONFIG = {
  AUDIO_FILENAME: "audio.mp3",
  AUDIO_TYPE: "audio/mpeg",
  MIN_DURATION: 2,
  MIN_LAST_DURATION: 4,
} as const;

export const ERROR_MESSAGES = {
  NO_TTS: "Please generate TTS first.",
  FETCH_FAILED: "Failed to fetch audio file",
  CONVERSION_FAILED: "Caption conversion request failed",
} as const;

import { MAX_TTS_CHARS } from "../constants/constants";

export const splitText = (text: string, chunkSize = MAX_TTS_CHARS) => {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

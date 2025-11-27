import { videoScriptType } from "@/entities/mediaAsset/types";
import axios from "axios";

const MAX_TTS_CHARS = 4000;

const splitText = (text: string, chunkSize = MAX_TTS_CHARS) => {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

export const useGenTTs = ({
  language,
  selectedVideoScript,
  voice,
  setTts, // string[] 받을 수 있게 타입 업데이트 필요
  setLoading,
}: {
  language: "English" | "Korean";
  selectedVideoScript: videoScriptType | null;
  voice: string;
  setTts: (ttsUrls: string[]) => void;
  setLoading: (loading: boolean) => void;
}) => {
  const GenerateTTS = async () => {
    const targetText = language === "English" ? selectedVideoScript?.content : selectedVideoScript?.translatedContent;

    if (!targetText) return;

    const textChunks = splitText(targetText);
    setLoading(true);

    try {
      const urls: string[] = [];
      for (const chunk of textChunks) {
        const response = await axios.post("/api/generate-voice", { text: chunk, voice }, { responseType: "blob" });
        const audioBlob = response.data;
        urls.push(URL.createObjectURL(audioBlob));
      }
      setTts(urls);
    } catch (error) {
      console.error("TTS 생성 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return { GenerateTTS };
};

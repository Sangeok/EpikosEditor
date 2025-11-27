import { videoScriptType } from "@/entities/mediaAsset/types";
import axios from "axios";

export const useGenTTs = ({
  language,
  selectedVideoScript,
  voice,
  setTts,
  setLoading,
}: {
  language: "English" | "Korean";
  selectedVideoScript: videoScriptType | null;
  voice: string;
  setTts: (ttsUrls: string[]) => void;
  setLoading: (loading: boolean) => void;
}) => {
  const GenerateTTS = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/generate-voice",
        {
          text: language === "English" ? selectedVideoScript?.content : selectedVideoScript?.translatedContent,
          voice: voice,
        },
        {
          responseType: "blob",
        }
      );

      const audioBlob = response.data;
      const url = URL.createObjectURL(audioBlob);

      setTts([url]);
    } catch (error) {
      console.error("TTS 생성 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return { GenerateTTS };
};

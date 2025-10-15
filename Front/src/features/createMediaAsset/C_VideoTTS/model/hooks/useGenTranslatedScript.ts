import { videoScriptType } from "@/entities/mediaAsset/types";
import axios from "axios";
import { useState } from "react";

export const useGenTranslatedScript = ({
  selectedVideoScript,
  translateLanguage,
  setLoading,
}: {
  selectedVideoScript: videoScriptType | null;
  translateLanguage: string;
  setLoading: (loading: boolean) => void;
}) => {
  const [translatedVideoScript, setTranslatedVideoScript] = useState<string>("");

  const TranslateScript = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/generate-translatedScript", {
        text: selectedVideoScript?.content,
        targetLanguage: translateLanguage,
      });

      setTranslatedVideoScript(response.data.translatedText);
    } catch (error) {
      console.error("TTS 생성 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    translatedVideoScript,
    TranslateScript,
  };
};

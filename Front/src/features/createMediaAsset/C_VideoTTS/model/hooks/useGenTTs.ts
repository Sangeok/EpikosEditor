import { videoScriptType } from "@/entities/mediaAsset/types";
import axios from "axios";
import { splitText } from "../../lib/splitText";

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
  setTts: (ttsUrl: string) => void;
  setLoading: (loading: boolean) => void;
}) => {
  const GenerateTTS = async () => {
    const targetText = language === "English" ? selectedVideoScript?.content : selectedVideoScript?.translatedContent;

    if (!targetText) {
      return;
    }

    const textChunks = splitText(targetText);
    if (!textChunks.length) {
      return;
    }

    const chunkUrls: string[] = [];
    const audioBlobs: Blob[] = [];

    setLoading(true);
    try {
      for (const chunk of textChunks) {
        const response = await axios.post(
          language === "English" ? "/api/generate-voice-en" : "/api/generate-voice",
          { text: chunk, voice },
          {
            responseType: "blob",
          }
        );

        const audioBlob = response.data as Blob;
        audioBlobs.push(audioBlob);
        chunkUrls.push(URL.createObjectURL(audioBlob));
      }

      const mergedBlob = new Blob(audioBlobs, { type: audioBlobs[0]?.type ?? "audio/mpeg" });
      const url = URL.createObjectURL(mergedBlob);

      chunkUrls.forEach((tempUrl) => URL.revokeObjectURL(tempUrl));

      setTts(url);
    } catch (error) {
      console.error("TTS 생성 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return { GenerateTTS };
};

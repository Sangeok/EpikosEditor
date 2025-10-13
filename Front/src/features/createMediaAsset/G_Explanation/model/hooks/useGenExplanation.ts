import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import axios from "axios";
import { useState } from "react";

export const useGenExplanation = () => {
  const topic = useMediaAssetStore((state) => state.initialCreateVideoData.topic);
  const language = useMediaAssetStore((state) => state.initialCreateVideoData.language);
  const topicDetail = useMediaAssetStore((state) => state.initialCreateVideoData.topicDetail);

  const [loading, setLoading] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>("");

  const GenerateExplanation = async () => {
    setLoading(true);

    try {
      const response = await axios.post("/api/generate-explanation", {
        topic,
        topicDetail,
        language,
      });

      setExplanation(response.data.explanation);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, explanation, GenerateExplanation };
};

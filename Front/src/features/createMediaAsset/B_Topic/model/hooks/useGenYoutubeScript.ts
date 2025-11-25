"use client";

import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import axios from "axios";
import { useState } from "react";

export const useGenYoutubeScript = () => {
  const topic = useMediaAssetStore((state) => state.initialCreateVideoData.topic);
  const topicDetail = useMediaAssetStore((state) => state.initialCreateVideoData.topicDetail);
  const language = useMediaAssetStore((state) => state.initialCreateVideoData.language);

  const setVideoScript = useMediaAssetStore((state) => state.setCreateVideoDataByField);

  const [loading, setLoading] = useState<boolean>(false);

  const GenerateScript = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/generate-youtubeScript/shortForm", {
        topic,
        language,
        topicDetail,
      });
      setVideoScript("videoScript", result?.data?.scripts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, GenerateScript };
};

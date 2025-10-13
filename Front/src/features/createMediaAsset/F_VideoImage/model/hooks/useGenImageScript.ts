"use client";

import useCaptionStore from "@/entities/mediaAsset/useCaptionStore";
import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import axios from "axios";
import { useState } from "react";

interface GenImageScriptProps {
  setIsDoneCreateImage: (isDoneCreateImage: Record<number, boolean>) => void;
  setLoading: (loading: boolean) => void;
}

export const useGenImageScript = ({ setIsDoneCreateImage, setLoading }: GenImageScriptProps) => {
  const [resVideoScript, setResVideoScript] = useState<any[]>([]);

  const topic = useMediaAssetStore((state) => state.initialCreateVideoData.topic);
  const topicDetail = useMediaAssetStore((state) => state.initialCreateVideoData.topicDetail);
  const language = useMediaAssetStore((state) => state.initialCreateVideoData.language);
  const videoStyle = useMediaAssetStore((state) => state.initialCreateVideoData.generateImage.generateImageStyle);
  const videoScript = useMediaAssetStore((state) => state.initialCreateVideoData.generateImage.generateImageScript);

  const scenes = useCaptionStore((state) => state.scenes);

  const GenerateScript = async () => {
    setLoading(true);
    try {
      // const result = await axios.post("/api/generate-imageScript", {
      //   style: videoStyle,
      //   script: videoScript?.content || "",
      //   language: language,
      //   topic,
      //   topicDetail,
      // });

      const result = await axios.post("/api/generate-imageScriptUsingCaption", {
        style: videoStyle,
        script: videoScript?.content || "",
        language: language,
        topic,
        topicDetail,
        scenes,
      });

      setResVideoScript(result?.data);

      // 새 스크립트가 생성되면 이미지 생성 상태 초기화
      const initialImageStatus = Object.fromEntries(Array.from({ length: result?.data.length }, (_, i) => [i, false]));
      setIsDoneCreateImage(initialImageStatus);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { resVideoScript, GenerateScript };
};

"use client";

import useCaptionStore from "@/entities/mediaAsset/useCaptionStore";
import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import axios from "axios";

interface GenImageScriptProps {
  setLoading: (loading: boolean) => void;
}

export const useGenImageScript = ({ setLoading }: GenImageScriptProps) => {
  const imageScript = useMediaAssetStore((state) => state.initialCreateVideoData.imageScript);
  const topic = useMediaAssetStore((state) => state.initialCreateVideoData.topic);
  const topicDetail = useMediaAssetStore((state) => state.initialCreateVideoData.topicDetail);
  const language = useMediaAssetStore((state) => state.initialCreateVideoData.language);
  const videoStyle = useMediaAssetStore((state) => state.initialCreateVideoData.generateImage.generateImageStyle);
  const selectedVideoScript = useMediaAssetStore(
    (state) => state.initialCreateVideoData.generateImage.selectedVideoScript
  );

  const scenes = useCaptionStore((state) => state.scenes);

  console.log("scenes", scenes);

  const setImageScript = useMediaAssetStore((state) => state.setCreateVideoDataByField);

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
        script: selectedVideoScript?.content || "",
        language: language,
        topic,
        topicDetail,
        scenes,
      });

      setImageScript("imageScript", result?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { imageScript, GenerateScript };
};

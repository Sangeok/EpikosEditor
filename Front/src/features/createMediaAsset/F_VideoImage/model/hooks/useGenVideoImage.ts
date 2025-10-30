"use client";

import { ImageDataType, ImageScriptType } from "@/entities/mediaAsset/types";
import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import axios from "axios";

export const useGenVideoImage = ({
  imageScript,
  setLoading,
  imageData,
}: {
  imageScript: ImageScriptType[];
  setLoading: (loading: boolean) => void;
  imageData: ImageDataType[];
}) => {
  const setImageData = useMediaAssetStore((state) => state.setCreateVideoDataByField);

  const GenerateImage = async (index: number) => {
    const imagePrompt = imageScript[index].imagePrompt;

    setLoading(true);
    try {
      const result = await axios.post("/api/generate-image", {
        imagePrompt: imagePrompt,
      });

      if (imageData.length > 0 && imageData[index]?.url) {
        const updatedImageUrl: ImageDataType[] = imageData.map((item, i) =>
          item.imageId === index
            ? {
                imageId: index,
                url: result?.data.data.imageUrl,
                startTime: imageScript[index].startTime ?? 0,
                endTime: imageScript[index].endTime ?? 0,
                duration: imageScript[index].duration ?? 0,
                type: imageScript[index].type ?? "",
                isCreated: true,
              }
            : item
        );
        setImageData("imageData", updatedImageUrl);
      } else {
        const imageUrlData = {
          imageId: index,
          url: result?.data.data.imageUrl,
          startTime: imageScript[index].startTime ?? 0,
          endTime: imageScript[index].endTime ?? 0,
          duration: imageScript[index].duration ?? 0,
          type: imageScript[index].type ?? "",
          isCreated: true,
        };
        console.log("imageUrlData", imageUrlData);
        const updatedImageUrl: ImageDataType[] = [...imageData, imageUrlData];
        setImageData("imageData", updatedImageUrl);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { GenerateImage };
};

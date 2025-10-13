import { useMediaStore } from "@/entities/media/useMediaStore";
import { createImageElement } from "../../lib/imageElementFactory";
import { MediaElement } from "@/entities/media/types";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export function useImageProjectManagement() {
  const { media, addMediaElement, updateMediaElement, deleteMediaElement } = useMediaStore();
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);

  const addImageToTimeLine = (imageUrl: string) => {
    const laneId = activeLaneByType.Media;
    const imageElement = createImageElement(imageUrl, laneId);

    const existingImage = media.mediaElement.find((el) => el.url === imageUrl);
    if (existingImage) {
      alert("Image already exists in the timeline");
      return;
    }

    addMediaElement(imageElement);
  };

  const updateImageSettings = (imageId: string, updates: Partial<MediaElement>) => {
    updateMediaElement(imageId, updates);
  };

  const deleteImage = (imageId: string) => {
    deleteMediaElement(imageId);
  };

  return {
    addImageToTimeLine,
    updateImageSettings,
    deleteImage,
  };
}

import { MediaElement as MediaElementType } from "@/entities/media/types";

export const getMediaElementType = (mediaElement: MediaElementType) => {
  const IsMediaElementImage = mediaElement.type === "image" && mediaElement.url;
  const IsMediaElementVideo = mediaElement.type === "video" && mediaElement.url;

  if (IsMediaElementImage) {
    return "image";
  }
  if (IsMediaElementVideo) {
    return "video";
  }
  return "not_media_element";
};

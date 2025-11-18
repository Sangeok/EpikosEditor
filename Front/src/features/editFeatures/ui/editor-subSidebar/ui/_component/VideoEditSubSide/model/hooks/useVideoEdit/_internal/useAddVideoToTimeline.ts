import { useMediaStore } from "@/entities/media/useMediaStore";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";
import { createVideoElement } from "../../../../lib/videoElementFactory";

interface VideoData {
  url: string;
  duration: number;
  width: number;
  height: number;
}

export function useAddVideoToTimeline() {
  const { media, addMediaElement } = useMediaStore();
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);

  const addVideoToTimeline = (videoData: VideoData) => {
    const laneId = activeLaneByType.Media;
    const videoElement = createVideoElement(videoData, laneId);

    const existingVideo = media.mediaElement.find((el) => el.url === videoData.url);
    if (existingVideo) {
      alert("Video already exists in the timeline");
      return;
    }

    addMediaElement(videoElement);
  };

  return {
    addVideoToTimeline,
  };
}

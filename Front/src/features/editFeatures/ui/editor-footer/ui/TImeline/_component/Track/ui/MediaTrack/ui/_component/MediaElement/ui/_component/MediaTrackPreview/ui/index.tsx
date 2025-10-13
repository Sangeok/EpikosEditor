import { MediaElement as MediaElementType } from "@/entities/media/types";
import ImageFilmstrip from "./_component/ImageFilmstrip";
import VideoFilmstrip from "./_component/VideoFilmstrip";
import IsNotMediaElement from "./_component/IsNotMediaElement";
import { getMediaElementType } from "../lib/getMediaElementType";

interface MediaTrackPreviewProps {
  mediaElement: MediaElementType;
  isResizeDragging?: boolean;
}

export default function MediaTrackPreview({ mediaElement, isResizeDragging }: MediaTrackPreviewProps) {
  const mediaElementType = getMediaElementType(mediaElement);

  const renderMediaTrackPreview = () => {
    switch (mediaElementType) {
      case "image":
        return <ImageFilmstrip url={mediaElement.url ?? ""} isResizeDragging={isResizeDragging} />;
      case "video":
        return (
          <VideoFilmstrip
            src={mediaElement.url ?? ""}
            startTime={mediaElement.startTime}
            endTime={mediaElement.endTime}
            isResizing={isResizeDragging}
          />
        );
      default:
        return <IsNotMediaElement />;
    }
  };

  return renderMediaTrackPreview();
}

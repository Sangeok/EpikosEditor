import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import VideoStyleOptionItem from "./_component/VideoStyleOptionItem";

export default function VideoStyle() {
  const videoStyle = useMediaAssetStore((state) => state.initialCreateVideoData.generateImage.generateImageStyle);
  const setVideoStyle = useMediaAssetStore((state) => state.setGenerateImageDataByFied);
  return (
    <div className="mt-5 border-b border-gray-200 pb-5">
      <h2 className="text-xl">Video Styles</h2>
      <p className="text-sm text-gray-400">Select Video Style</p>

      <VideoStyleOptionItem videoStyle={videoStyle} setVideoStyle={setVideoStyle} />
    </div>
  );
}

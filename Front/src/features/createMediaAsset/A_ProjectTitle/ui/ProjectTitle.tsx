import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import Input from "@/shared/ui/atoms/Input/ui/Input";

export default function ProjectTitle() {
  const title = useMediaAssetStore((state) => state.initialCreateVideoData.title);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    useMediaAssetStore.getState().setCreateVideoDataByField("title", event.target.value);
  };

  return (
    <div className="border-b border-gray-200 pb-5">
      <h2 className="mb-4 text-xl">Project Title</h2>
      <Input placeholder="Enter Proejct Title..." value={title} onChange={(e) => handleTitleChange(e)} />
    </div>
  );
}

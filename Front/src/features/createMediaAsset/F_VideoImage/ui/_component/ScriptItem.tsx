import { ImageDataType } from "@/entities/mediaAsset/types";
import ImageGenerateButton from "./ImageGenerateButton";
import { Download } from "lucide-react";
import { useImageDownload } from "../../model/hooks/useImageDownload";
import Button from "@/shared/ui/atoms/Button/ui/Button";

interface ScriptItemProps {
  item: any;
  index: number;
  isDone: boolean;
  isLoading: boolean;
  imageData: ImageDataType[];
  onGenerateImage: (index: number) => Promise<void>;
}

export function ScriptItem({ item, index, isDone, isLoading, imageData, onGenerateImage }: ScriptItemProps) {
  const { handleDownload } = useImageDownload();

  return (
    <div className="flex flex-col gap-1 mb-8" key={item.imagePrompt}>
      <div className="border border-gray-300 rounded-md p-2">{item.imagePrompt}</div>
      <ImageGenerateButton isDone={isDone} isLoading={isLoading} onClick={() => onGenerateImage(index)} />
      {imageData.some((img) => img.imageId === index) && (
        <>
          <Button
            size="sm"
            variant="dark"
            className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-black font-medium shadow-sm transition-colors cursor-pointer"
            onClick={() => handleDownload(index, imageData)}
          >
            <Download />
            Image Download
          </Button>
        </>
      )}
    </div>
  );
}

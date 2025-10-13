import { X } from "lucide-react";

interface ImagePreviewAreaProps {
  uploadedImages: string[];
  removeImage: (index: number) => void;
  addImageToTimeLine: (imageUrl: string) => void;
}

export default function ImagePreviewArea({ uploadedImages, removeImage, addImageToTimeLine }: ImagePreviewAreaProps) {
  const isUploaded = uploadedImages.length > 0;

  if (!isUploaded) return;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-zinc-300">Uploaded Images</h3>
      <div className="grid grid-cols-2 gap-2">
        {uploadedImages.map((imageUrl, index) => (
          <div key={index} className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-24 object-cover rounded border border-zinc-600"
              onDoubleClick={() => addImageToTimeLine(imageUrl)}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

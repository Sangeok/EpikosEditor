import Button from "@/shared/ui/atoms/Button/ui/Button";
import { Upload, Music, FileText } from "lucide-react";
import { RefObject } from "react";

type MediaType = "video" | "image" | "audio" | "caption";

interface MediaFileUploadAreaProps {
  mediaType: MediaType;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (files: FileList | null) => void;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  dragActive: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const MEDIA_CONFIG = {
  video: {
    accept: "video/*",
    icon: Upload,
    text: "Drag & drop your video file here",
    button: "Choose Video",
    description: "or",
  },
  image: {
    accept: "image/*",
    icon: Upload,
    text: "Drag & drop your image file here",
    button: "Choose Image",
    description: "or",
  },
  audio: {
    accept: "audio/*",
    icon: Music,
    text: "Drag & drop your audio files here",
    button: "Choose Audio Files",
    description: "Supports MP3, WAV, OGG, M4A",
  },
  caption: {
    accept: ".srt",
    icon: FileText,
    text: "Drag & drop your SRT file here",
    button: "Choose SRT File",
    description: "Supports .srt subtitle files",
  },
} as const;

export default function MediaFileUploadArea({
  mediaType,
  fileInputRef,
  onFileSelect,
  onDrag,
  onDrop,
  dragActive,
  loading = false,
  disabled = false,
}: MediaFileUploadAreaProps) {
  const config = MEDIA_CONFIG[mediaType];
  const Icon = config.icon;

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full ${
        dragActive ? "border-blue-500 bg-blue-500/10" : "border-zinc-600 bg-zinc-800/50"
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={config.accept}
        multiple
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files)}
        disabled={disabled || loading}
      />

      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-300 mb-2">{config.text}</p>
      <p className="text-gray-500 text-sm mb-4">{config.description}</p>
      <Button onClick={() => fileInputRef.current?.click()} variant="light" size="sm" disabled={disabled || loading}>
        {loading ? "Processing..." : config.button}
      </Button>
    </div>
  );
}

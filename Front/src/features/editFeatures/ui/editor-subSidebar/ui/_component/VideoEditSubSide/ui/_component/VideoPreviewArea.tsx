import { X } from "lucide-react";
import { UploadedVideo } from "../../model/type";

interface VideoPreviewAreaProps {
  uploadedVideos: UploadedVideo[];
  removeVideo: (index: number) => void;
  addVideoToTimeline: (videoData: { url: string; duration: number; width: number; height: number }) => void;
}

export default function VideoPreviewArea({ uploadedVideos, removeVideo, addVideoToTimeline }: VideoPreviewAreaProps) {
  if (uploadedVideos.length === 0) {
    return null;
  }

  const handleAddToTimeline = (video: UploadedVideo) => {
    addVideoToTimeline({ url: video.url, duration: video.duration, width: video.width, height: video.height });
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-300">Uploaded Videos</h4>
      <div className="grid gap-2">
        {uploadedVideos.map((video, index) => (
          <div key={video.id} className="relative bg-zinc-800 rounded-lg p-3 border border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3" onDoubleClick={() => handleAddToTimeline(video)}>
                <video src={video.url} className="w-16 h-12 object-cover rounded border border-zinc-600" muted />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{video.file.name}</p>
                  <p className="text-xs text-gray-400">
                    {video.width} × {video.height} • {Math.round(video.duration)}s
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeVideo(index)}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

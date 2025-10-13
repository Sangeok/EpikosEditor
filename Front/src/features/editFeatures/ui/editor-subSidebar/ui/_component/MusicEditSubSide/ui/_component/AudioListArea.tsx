import { Music, Play, Pause, X } from "lucide-react";
import { UploadedAudio } from "../../model/types";

interface AudioListAreaProps {
  uploadedAudios: UploadedAudio[];
  playingIndex: number | null;
  togglePreview: (audioUrl: string, index: number) => void;
  removeAudio: (index: number) => void;
  addAudioToTimeLine: (audio: UploadedAudio) => void;
}

export default function AudioListArea({
  uploadedAudios,
  playingIndex,
  togglePreview,
  removeAudio,
  addAudioToTimeLine,
}: AudioListAreaProps) {
  if (uploadedAudios.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-zinc-300">Uploaded Audio ({uploadedAudios.length})</h4>
      <div className="space-y-2">
        {uploadedAudios.map((audio, index) => (
          <AudioListItem
            key={index}
            audio={audio}
            index={index}
            isPlaying={playingIndex === index}
            onTogglePreview={togglePreview}
            onRemove={removeAudio}
            onAddToTimeLine={addAudioToTimeLine}
          />
        ))}
      </div>
    </div>
  );
}

interface AudioListItemProps {
  audio: UploadedAudio;
  index: number;
  isPlaying: boolean;
  onTogglePreview: (audioUrl: string, index: number) => void;
  onRemove: (index: number) => void;
  onAddToTimeLine: (audio: UploadedAudio) => void;
}

function AudioListItem({ audio, index, isPlaying, onTogglePreview, onRemove, onAddToTimeLine }: AudioListItemProps) {
  return (
    <div
      className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 group hover:bg-zinc-700/50 transition-colors"
      onDoubleClick={() => onAddToTimeLine({ url: audio.url, name: audio.name })}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={() => onTogglePreview(audio.url, index)}
          className="p-2 hover:bg-zinc-600 rounded-full transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4 text-blue-400" /> : <Play className="w-4 h-4 text-gray-400" />}
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Music className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-300 truncate">{audio.name}</span>
        </div>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="p-1 hover:bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
}

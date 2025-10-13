"use client";

import { useMediaStore } from "@/entities/media/useMediaStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { formatPlaybackTime } from "@/features/editFeatures/ui/editor-footer/lib/formatTimelineTime";

export default function PlaybackDisplay() {
  const { media } = useMediaStore();
  const projectDuration = media.projectDuration || 0;
  const { currentTime, isPlaying, setCurrentTime, setIsPlaying } =
    useTimelineStore();

  // 재생/일시정지 토글
  const handlePlayPause = () => {
    if (projectDuration > 0 && !isPlaying) {
      setIsPlaying(true);
    } else if (projectDuration > 0 && isPlaying) {
      setIsPlaying(false);
    }
  };

  // 이전으로 건너뛰기 (5초)
  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 5);
    setCurrentTime(newTime);
  };

  // 다음으로 건너뛰기 (5초)
  const handleSkipForward = () => {
    const newTime = Math.min(projectDuration, currentTime + 5);
    setCurrentTime(newTime);
  };

  const playbackControls = [
    {
      label: "Skip Back",
      icon: <SkipBack size={15} />,
      onClick: handleSkipBack,
    },
    {
      label: isPlaying ? "Pause" : "Play",
      icon: isPlaying ? <Pause size={15} /> : <Play size={15} />,
      onClick: handlePlayPause,
    },
    {
      label: "Skip Forward",
      icon: <SkipForward size={15} />,
      onClick: handleSkipForward,
    },
  ];

  return (
    <div className="flex items-center gap-4">
      {playbackControls.map((control) => (
        <IconButton
          key={control.label}
          onClick={control.onClick}
          title={control.label}
        >
          {control.icon}
        </IconButton>
      ))}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-mono text-white">
          {formatPlaybackTime(currentTime)}
        </span>
        <span className="text-white/50">/</span>
        <span className="font-mono text-white/50">
          {formatPlaybackTime(media.projectDuration)}
        </span>
      </div>
    </div>
  );
}

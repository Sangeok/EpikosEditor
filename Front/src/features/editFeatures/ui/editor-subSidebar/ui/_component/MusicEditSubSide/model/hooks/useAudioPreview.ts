import { useState } from "react";

export function useAudioPreview() {
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const playAudio = (audioUrl: string, index: number) => {
    const audio = new Audio(audioUrl);
    audio.volume = 0.5;
    audio.play();

    audio.onended = () => {
      setPlayingIndex(null);
      setPreviewAudio(null);
    };

    setPreviewAudio(audio);
    setPlayingIndex(index);
  };

  const togglePreview = (audioUrl: string, index: number) => {
    // 현재 재생 중인 오디오 정리
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    }

    if (playingIndex === index) {
      setPlayingIndex(null);
      setPreviewAudio(null);
    } else {
      playAudio(audioUrl, index);
    }
  };

  const stopPreviewForIndex = (index: number) => {
    if (playingIndex === index && previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
      setPlayingIndex(null);
    }
  };

  return {
    previewAudio,
    playingIndex,
    togglePreview,
    stopPreviewForIndex,
  };
}
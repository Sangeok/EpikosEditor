"use client";

import { AudioElement } from "@/entities/media/types";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { useMemo } from "react";

interface AudioEditRightSideProps {
  selectedTrackId: string | null;
}

export default function AudioEditRightSide({ selectedTrackId }: AudioEditRightSideProps) {
  const audioElement = useMediaStore((state) =>
    state.media.audioElement.find((element) => element.id === selectedTrackId)
  ) as AudioElement;
  const updateAudioElement = useMediaStore((state) => state.updateAudioElement);

  // Slider는 0-100 UI를 사용하고, 저장은 0-1 정규화 값으로 저장한다
  const sliderValue = useMemo(() => {
    if (!audioElement) return 100;
    const vol = audioElement.volume;
    // 기존 데이터 호환: 0-1 범위면 퍼센트로 변환, 그 외(예: 50, 100)는 그대로 사용
    const percent = vol <= 1 ? vol * 100 : vol;
    const clamped = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 100));
    return Math.round(clamped);
  }, [audioElement]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioElement) return;
    const nextPercent = Math.max(0, Math.min(100, Number(e.target.value)));
    const normalized = nextPercent / 100; // 0-1로 저장
    updateAudioElement(audioElement.id, { volume: normalized });
  };

  if (!audioElement || audioElement.type !== "audio") {
    return <div>No audio selected</div>;
  }

  return (
    <div className="w-full h-full flex flex-col gap-3 p-2">
      <h1>Auido Volume</h1>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/80">Volume</span>
        <span className="text-sm tabular-nums text-white/80">{sliderValue}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={sliderValue}
        onChange={handleVolumeChange}
        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none 
                   [&::-webkit-slider-thumb]:w-3 
                   [&::-webkit-slider-thumb]:h-3 
                   [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:bg-white 
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:w-3 
                   [&::-moz-range-thumb]:h-3 
                   [&::-moz-range-thumb]:rounded-full 
                   [&::-moz-range-thumb]:bg-white 
                   [&::-moz-range-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:border-none"
      />
    </div>
  );
}

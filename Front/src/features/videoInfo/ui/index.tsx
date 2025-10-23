"use client";

import Dialog from "@/shared/ui/atoms/Dialog/ui/Dialog";
import Image from "next/image";
import useCreateVideoStore from "@/entities/mediaAsset/useMediaAssetStore";

interface VideoInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function VideoInfoModal({ open, onClose }: VideoInfoModalProps) {
  const { topic, topicDetail, generateImage, videoExplanation, imageData, language } = useCreateVideoStore(
    (s) => s.initialCreateVideoData
  );

  const selectedScript = generateImage?.selectedVideoScript ?? null;
  const selectedScriptText = language === "English" ? selectedScript?.content : selectedScript?.translatedContent ?? "";
  const thumbnailUrl = imageData?.length ? imageData[0]?.url : "";

  return (
    <Dialog open={open} onClose={onClose} title="Export Video" size="3xl">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white">영상 정보 요약</h3>

        {/* Thumbnail Preview */}
        <div className="rounded-xl border border-zinc-700/80 bg-gradient-to-b from-zinc-800/60 to-zinc-900/60 p-3">
          <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg bg-zinc-800">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt="영상 썸네일"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 512px"
                priority
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">
                이미지가 없습니다
              </div>
            )}
            <div className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs text-zinc-200 border border-white/10">
              미리보기
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-4">
          <InfoRow label="Topic" value={topic || "-"} />
          <InfoRow label="Topic Detail" value={topicDetail || "-"} />
          <InfoRow label="Selected Script" value={selectedScriptText || "선택된 스크립트가 없습니다"} multiline />
          <InfoRow label="Video Explanation" value={videoExplanation || "-"} multiline />
          <InfoRow label="Image URL" value={thumbnailUrl || "-"} isMonospace copyable />
        </div>
      </div>
    </Dialog>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  multiline?: boolean;
  isMonospace?: boolean;
  copyable?: boolean;
};

function InfoRow({ label, value, multiline = false, isMonospace = false, copyable = false }: InfoRowProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (_) {
      // noop
    }
  };

  return (
    <div className="rounded-lg border border-zinc-700/70 bg-zinc-900/40 p-4">
      <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">{label}</div>
      <div
        className={
          "text-sm text-zinc-200" +
          (isMonospace ? " font-mono" : "") +
          (multiline ? " max-h-32 overflow-y-auto whitespace-pre-wrap" : " truncate")
        }
        title={!multiline ? value : undefined}
      >
        {value}
      </div>
      {copyable && value !== "-" && (
        <div className="mt-3">
          <button onClick={handleCopy} className="text-xs text-zinc-300 hover:text-white underline underline-offset-4">
            복사하기
          </button>
        </div>
      )}
    </div>
  );
}

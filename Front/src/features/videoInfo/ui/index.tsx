"use client";

import Dialog from "@/shared/ui/atoms/Dialog/ui/Dialog";
import useCreateVideoStore from "@/entities/mediaAsset/useMediaAssetStore";
import ExportThumbnail from "./_component/ExportThumbnail";
import InfoRow from "./_component/InfoRow";

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

        <ExportThumbnail thumbnailUrl={thumbnailUrl} />

        {/* Details */}
        <div className="grid gap-4">
          <InfoRow label="Topic" value={topic || "-"} />
          <InfoRow label="Topic Detail" value={topicDetail || "-"} copyable />
          <InfoRow label="Selected Script" value={selectedScriptText || "선택된 스크립트가 없습니다"} multiline />
          <InfoRow label="Video Explanation" value={videoExplanation || "-"} multiline copyable />
          <InfoRow label="Image URL" value={thumbnailUrl || "-"} isMonospace copyable />
        </div>
      </div>
    </Dialog>
  );
}

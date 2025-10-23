"use client";

import React from "react";
import Dialog from "@/shared/ui/atoms/Dialog/ui/Dialog";
import { ExportStatus } from "../model/type";
import ProgressDisplay from "./_component/ProgressDisplay";
import { STATUS_CONFIG } from "../constants";
import ErrorDisplay from "./_component/ErrorDisplay";
import SuccessDisplay from "./_component/SuccessDisplay";
import ActionButtons from "./_component/ActionButtons";

interface ExportProgressModalProps {
  open: boolean;
  onClose: () => void;
  progress: number;
  status: ExportStatus;
  error?: string;
  outputPath?: string;
  filename?: string;
  downloadUrl?: string;
  cancel: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function buildDownloadUrl(downloadUrl?: string, filename?: string, outputPath?: string): string | null {
  if (downloadUrl) return downloadUrl;

  if (filename) {
    return `${API_BASE_URL}/video/download/${filename}`;
  }

  if (outputPath) {
    const file = outputPath.split(/[\\\/]/).pop();
    if (file) {
      return `${API_BASE_URL}/video/download/${file}`;
    }
  }

  return null;
}

// ===== 메인 컴포넌트 =====
export default function ExportProgressModal({
  open,
  onClose,
  progress,
  status,
  error,
  outputPath,
  filename,
  downloadUrl,
  cancel,
}: ExportProgressModalProps) {
  const finalDownloadUrl = React.useMemo(
    () => buildDownloadUrl(downloadUrl, filename, outputPath),
    [downloadUrl, filename, outputPath]
  );

  const handleCancel = async () => {
    await cancel();
    onClose();
  };

  const statusConfig = STATUS_CONFIG[status];

  return (
    <Dialog open={open} onClose={onClose} title="Export Video">
      <div className="space-y-6">
        {/* Status Header */}
        <h3 className={`text-lg font-semibold ${statusConfig.color}`}>{statusConfig.text}</h3>

        {/* Progress Bar */}
        {status === "exporting" && <ProgressDisplay progress={progress} />}

        {/* Error Message */}
        {status === "error" && error && <ErrorDisplay error={error} />}

        {/* Success Message */}
        {status === "completed" && <SuccessDisplay outputPath={outputPath} hasDownloadUrl={!!finalDownloadUrl} />}

        {/* Action Buttons */}
        <div className="flex w-full">
          <ActionButtons status={status} downloadUrl={finalDownloadUrl} onClose={onClose} onCancel={handleCancel} />
        </div>
      </div>
    </Dialog>
  );
}

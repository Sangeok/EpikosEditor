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
  downloadUrl?: string;
  cancel: () => void;
}

export default function ExportProgressModal({
  open,
  onClose,
  progress,
  status,
  error,
  downloadUrl,
  cancel,
}: ExportProgressModalProps) {
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
        {status === "completed" && <SuccessDisplay hasDownloadUrl={!!downloadUrl} />}

        {/* Action Buttons */}
        <div className="flex w-full">
          <ActionButtons status={status} downloadUrl={downloadUrl || null} onClose={onClose} onCancel={handleCancel} />
        </div>
      </div>
    </Dialog>
  );
}

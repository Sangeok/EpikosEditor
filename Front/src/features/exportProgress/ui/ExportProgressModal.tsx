"use client";

import React from "react";
import Dialog from "@/shared/ui/atoms/Dialog/ui/Dialog";
import Button from "@/shared/ui/atoms/Button/ui/Button";

interface ExportProgressModalProps {
  open: boolean;
  onClose: () => void;
  progress: number;
  status: "idle" | "exporting" | "completed" | "error";
  error?: string;
  outputPath?: string;
  filename?: string;
  downloadUrl?: string;
  cancel: () => void;
}

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
  const getStatusText = () => {
    switch (status) {
      case "exporting":
        return "Exporting...";
      case "completed":
        return "Export completed!";
      case "error":
        return "Export failed";
      default:
        return "Waiting...";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "exporting":
        return "text-blue-400";
      case "completed":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const handleCancel = async () => {
    await cancel();
    onClose();
  };

  // Compute final download URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const finalDownloadUrl = React.useMemo(() => {
    if (downloadUrl) return downloadUrl;
    const base = API_BASE_URL;
    if (filename) return `${base}/video/download/${filename}`;
    if (outputPath) {
      const file = outputPath.split(/[\\\/]/).pop();
      if (file) return `${base}/video/download/${file}`;
    }
    return null;
  }, [downloadUrl, filename, outputPath, API_BASE_URL]);

  return (
    <Dialog open={open} onClose={onClose} title="Export Video">
      <div className="space-y-6">
        {/* Status Header */}
        <h3 className={`text-lg font-semibold ${getStatusColor()}`}>{getStatusText()}</h3>

        {/* Progress Bar */}
        {status === "exporting" && (
          <div className="flex justify-between text-2xl font-semibold">
            <span className="text-gray-300">진행률</span>
            <span className="text-white">{progress}%</span>
          </div>
        )}

        {/* Error Message */}
        {status === "error" && error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {status === "completed" && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <p className="text-green-300 text-sm">Video has been successfully created!</p>
            {outputPath && <p className="text-gray-400 text-xs mt-2">File path: {outputPath}</p>}
            {finalDownloadUrl && <p className="text-gray-400 text-xs mt-2">Ready to download</p>}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex w-full">
          {status === "completed" && (
            <div className="flex w-full justify-between">
              <Button onClick={onClose}>Close</Button>
              <Button
                onClick={() => {
                  if (finalDownloadUrl) window.location.href = finalDownloadUrl;
                }}
                disabled={!finalDownloadUrl}
              >
                Download
              </Button>
            </div>
          )}
          {status === "error" && (
            <div className="flex w-full justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          )}
          {status === "exporting" && (
            <div className="flex justify-between w-full ">
              <Button onClick={onClose}>Continue in background</Button>

              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}

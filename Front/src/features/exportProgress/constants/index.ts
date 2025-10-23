export const STATUS_CONFIG = {
  idle: {
    text: "Waiting...",
    color: "text-gray-400",
  },
  exporting: {
    text: "Exporting...",
    color: "text-blue-400",
  },
  completed: {
    text: "Export completed!",
    color: "text-green-400",
  },
  error: {
    text: "Export failed",
    color: "text-red-400",
  },
} as const;

export const MESSAGES = {
  SUCCESS: "Video has been successfully created!",
  FILE_PATH_LABEL: "File path:",
  DOWNLOAD_READY: "Ready to download",
  PROGRESS_LABEL: "진행률",
  BUTTON_CLOSE: "Close",
  BUTTON_DOWNLOAD: "Download",
  BUTTON_BACKGROUND: "Continue in background",
  BUTTON_CANCEL: "Cancel",
} as const;

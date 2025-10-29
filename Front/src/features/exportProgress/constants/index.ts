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

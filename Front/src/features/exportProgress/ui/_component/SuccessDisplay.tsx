import { MESSAGES } from "../../constants";

interface SuccessDisplayProps {
  outputPath?: string;
  hasDownloadUrl: boolean;
}

export default function SuccessDisplay({ outputPath, hasDownloadUrl }: SuccessDisplayProps) {
  return (
    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
      <p className="text-green-300 text-sm">{MESSAGES.SUCCESS}</p>
      {outputPath && (
        <p className="text-gray-400 text-xs mt-2">
          {MESSAGES.FILE_PATH_LABEL} {outputPath}
        </p>
      )}
      {hasDownloadUrl && <p className="text-gray-400 text-xs mt-2">{MESSAGES.DOWNLOAD_READY}</p>}
    </div>
  );
}

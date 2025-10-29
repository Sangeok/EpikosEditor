interface SuccessDisplayProps {
  hasDownloadUrl: boolean;
}

export default function SuccessDisplay({ hasDownloadUrl }: SuccessDisplayProps) {
  return (
    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
      <p className="text-green-300 text-sm">Video has been successfully created!</p>
      {hasDownloadUrl && <p className="text-gray-400 text-xs mt-2">Ready to download</p>}
    </div>
  );
}

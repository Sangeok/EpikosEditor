interface ErrorDisplayProps {
  error: string;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
      <p className="text-red-300 text-sm">{error}</p>
    </div>
  );
}

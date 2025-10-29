interface ProgressDisplayProps {
  progress: number;
}

export default function ProgressDisplay({ progress }: ProgressDisplayProps) {
  return (
    <div className="flex justify-between text-2xl font-semibold">
      <span className="text-gray-300">Progress</span>
      <span className="text-white">{progress}%</span>
    </div>
  );
}

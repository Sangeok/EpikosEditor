interface InfoRowProps {
  label: string;
  value: string;
  multiline?: boolean;
  isMonospace?: boolean;
  copyable?: boolean;
}

export default function InfoRow({
  label,
  value,
  multiline = false,
  isMonospace = false,
  copyable = false,
}: InfoRowProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (_) {
      // noop
    }
  };

  return (
    <div className="rounded-lg border border-zinc-700/70 bg-zinc-900/40 p-4">
      <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">{label}</div>
      <div
        className={
          "text-sm text-zinc-200" +
          (isMonospace ? " font-mono" : "") +
          (multiline ? " max-h-32 overflow-y-auto whitespace-pre-wrap" : " truncate")
        }
        title={!multiline ? value : undefined}
      >
        {value}
      </div>
      {copyable && value !== "-" && (
        <div className="mt-3">
          <button onClick={handleCopy} className="text-xs text-zinc-300 hover:text-white underline underline-offset-4">
            복사하기
          </button>
        </div>
      )}
    </div>
  );
}

type TTSPlayerProps = {
  ttsUrls: string[];
};

export default function TTSPlayer({ ttsUrls }: TTSPlayerProps) {
  if (!ttsUrls || ttsUrls.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      {ttsUrls.map((url, index) => (
        <div key={`${url}-${index}`}>
          {ttsUrls.length > 1 && <p className="text-sm text-gray-400">Segment {index + 1}</p>}
          <audio controls className="w-full mt-2">
            <source src={url} type="audio/mpeg" />
            브라우저가 오디오 요소를 지원하지 않습니다.
          </audio>
        </div>
      ))}
    </div>
  );
}

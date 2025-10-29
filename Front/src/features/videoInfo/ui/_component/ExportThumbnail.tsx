import Image from "next/image";

export default function ExportThumbnail({ thumbnailUrl }: { thumbnailUrl: string }) {
  return (
    <div className="rounded-xl border border-zinc-700/80 bg-gradient-to-b from-zinc-800/60 to-zinc-900/60 p-3">
      <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg bg-zinc-800">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt="영상 썸네일"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 512px"
            priority
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">
            이미지가 없습니다
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs text-zinc-200 border border-white/10">
          미리보기
        </div>
      </div>
    </div>
  );
}

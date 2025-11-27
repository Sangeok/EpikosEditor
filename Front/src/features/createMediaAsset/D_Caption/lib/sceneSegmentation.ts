import { ImageScene, SrtItem } from "@/entities/mediaAsset/types/SceneTypes";

function toSeconds(hmsMs: string): number {
  const [hh, mm, ssMs] = hmsMs.split(":");
  const [ss, ms] = ssMs.split(",");
  return Number(hh) * 3600 + Number(mm) * 60 + Number(ss) + Number(ms) / 1000;
}

function fixed3(n: number): number {
  return Number(n.toFixed(3));
}

export function parseSRT(srt: string): SrtItem[] {
  if (!srt) return [];
  const normalized = srt.replace(/\r/g, "").trim();
  if (!normalized) return [];
  const sanitized = normalized.replace(
    /\n(?=\s*\d+\s*\n\s*\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3})/g,
    "\n\n"
  );
  const blocks = sanitized.split(/\n{2,}/);
  const items: SrtItem[] = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) continue;

    const timeLine = lines[1].includes("-->") ? lines[1] : lines.find((l) => l.includes("-->"));
    if (!timeLine) continue;

    const m = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
    if (!m) continue;

    const start = toSeconds(m[1]);
    const end = toSeconds(m[2]);
    if (!(end > start)) continue;

    const idxOfTime = lines.indexOf(timeLine);
    const text = lines
      .slice(idxOfTime + 1)
      .join(" ")
      .trim();
    items.push({ start, end, text });
  }

  return items.sort((a, b) => a.start - b.start);
}

function normalizeScenes(scenes: ImageScene[], tFirst: number, tLast: number): ImageScene[] {
  if (!scenes.length) return scenes;
  const sorted = [...scenes].sort((a, b) => a.startTime - b.startTime);

  sorted[0].startTime = fixed3(tFirst);
  for (let i = 1; i < sorted.length; i++) {
    sorted[i].startTime = fixed3(sorted[i - 1].endTime);
  }
  sorted[sorted.length - 1].endTime = fixed3(tLast);

  for (const s of sorted) {
    s.duration = fixed3(s.endTime - s.startTime);
  }
  return sorted;
}

// 자막 아이템들을 문장 단위로 병합하여 문장 경계에 맞춘 단위(SrtItem)를 생성
export function buildSentenceSubs(subs: SrtItem[]): SrtItem[] {
  if (!subs.length) return [];
  const sentenceEndRe = /[.!?。！？]["'”’)]?$/; // 문장 종료 부호(따옴표 포함)로 끝나는지 확인

  const sentences: SrtItem[] = [];
  let bufferText = "";
  let bufferStart = subs[0].start;

  for (let i = 0; i < subs.length; i++) {
    const s = subs[i];
    const clean = s.text.replace(/\s+/g, " ").trim();
    if (!clean) continue;
    bufferText = bufferText ? bufferText + " " + clean : clean;

    const isSentenceEnd = sentenceEndRe.test(bufferText);
    const isLastItem = i === subs.length - 1;

    if (isSentenceEnd || isLastItem) {
      sentences.push({ start: bufferStart, end: s.end, text: bufferText });
      bufferText = "";
      bufferStart = subs[i + 1]?.start ?? s.end;
    }
  }

  return sentences.sort((a, b) => a.start - b.start);
}

function forceSplitBySentences(sentenceSubs: SrtItem[], minScenes: number): ImageScene[] {
  if (!sentenceSubs.length || minScenes <= 1) return [];

  const tFirst = sentenceSubs[0].start;
  const tLast = sentenceSubs[sentenceSubs.length - 1].end;

  const n = sentenceSubs.length;
  const base = Math.floor(n / minScenes);
  const rem = n % minScenes;

  let idx = 0;
  const scenes: ImageScene[] = [];

  for (let i = 0; i < minScenes; i++) {
    const size = base + (i < rem ? 1 : 0);
    const slice = sentenceSubs.slice(idx, idx + size);
    idx += size;

    if (!slice.length) continue;

    const startTime = fixed3(slice[0].start);
    const endTime = fixed3(slice[slice.length - 1].end);
    const text = slice
      .map((s) => s.text)
      .join(" ")
      .trim();

    scenes.push({
      id: `scene_${i + 1}`,
      startTime,
      endTime,
      duration: fixed3(endTime - startTime),
      type: "image",
      text,
    });
  }

  const normalized = normalizeScenes(scenes, tFirst, tLast);
  return normalized.map((s, i) => ({ ...s, id: `scene_${i + 1}` }));
}

function decideTargetCount(totalDur: number, preferred: 4 | 5 = 5, minPerScene = 4): 4 | 5 {
  const est = totalDur / preferred;
  return (est < minPerScene ? 4 : preferred) as 4 | 5;
}

export function segmentSRTGreedy(
  subs: SrtItem[],
  opts?: { targetCount?: 4 | 5; minDurSec?: number; minLastSec?: number }
): ImageScene[] {
  if (!subs.length) return [];
  const minDurSec = opts?.minDurSec ?? 2;
  const minLastSec = opts?.minLastSec ?? 4;

  const tFirst = subs[0].start;
  const tLast = subs[subs.length - 1].end;
  const totalDur = tLast - tFirst;
  const preferred = (opts?.targetCount ?? 5) as 4 | 5;
  const targetCount = decideTargetCount(totalDur, preferred, 4);
  const targetDur = totalDur / targetCount;

  const scenes: ImageScene[] = [];
  let curStart = tFirst;
  let accEnd = curStart;

  for (let i = 0; i < subs.length; i++) {
    accEnd = subs[i].end;
    const curDur = accEnd - curStart;

    const remainingSubs = subs.length - (i + 1);
    const remainingSlots = targetCount - scenes.length - 1;
    const canStillFill = remainingSubs >= remainingSlots;
    // 컷 이후 남은 시간 하한(남은 슬롯을 minDurSec 이상으로 보장)
    const remDurIfCut = tLast - accEnd;
    const remMinNeed = remainingSlots * minDurSec;

    if (curDur >= targetDur && canStillFill && remDurIfCut >= remMinNeed) {
      const startTime = fixed3(curStart);
      const endTime = fixed3(accEnd);
      const text = subs
        .filter((x) => x.start < endTime && x.end > startTime)
        .map((x) => x.text)
        .join(" ")
        .trim();

      scenes.push({
        id: `scene_${scenes.length + 1}`,
        startTime,
        endTime,
        duration: fixed3(endTime - startTime),
        type: "image",
        text,
      });
      curStart = accEnd;
    }
  }

  if (curStart < tLast) {
    const startTime = fixed3(curStart);
    const endTime = fixed3(tLast);
    const text = subs
      .filter((x) => x.start < endTime && x.end > startTime)
      .map((x) => x.text)
      .join(" ")
      .trim();

    scenes.push({
      id: `scene_${scenes.length + 1}`,
      startTime,
      endTime,
      duration: fixed3(endTime - startTime),
      type: "image",
      text,
    });
  }

  for (let i = 0; i < scenes.length; i++) {
    if (scenes[i].duration < minDurSec && i > 0) {
      scenes[i - 1].endTime = scenes[i].endTime;
      scenes[i - 1].duration = fixed3(scenes[i - 1].endTime - scenes[i - 1].startTime);
      scenes.splice(i, 1);
      i--;
    }
  }
  // 마지막 씬 보정: 너무 짧으면 이전과 병합
  if (scenes.length >= 2) {
    const last = scenes[scenes.length - 1];
    if (last.duration < minLastSec) {
      const prev = scenes[scenes.length - 2];
      prev.endTime = last.endTime;
      prev.duration = fixed3(prev.endTime - prev.startTime);
      scenes.pop();
    }
  }

  const normalized = normalizeScenes(scenes, tFirst, tLast);
  return normalized.map((s, idx) => ({ ...s, id: `scene_${idx + 1}` }));
}

// 문장 단위 자막으로 변환한 뒤 동일한 그리디 규칙으로 장면을 구성
type SentenceSegmentConfig = {
  targetCount: number;
  minDurSec: number;
  minLastSec: number;
  minScenes: number;
};

function buildScenesFromSentenceSubs(sentenceSubs: SrtItem[], config: SentenceSegmentConfig): ImageScene[] {
  if (!sentenceSubs.length) return [];

  const { minDurSec, minLastSec, minScenes } = config;
  const tFirst = sentenceSubs[0].start;
  const tLast = sentenceSubs[sentenceSubs.length - 1].end;
  const totalDur = tLast - tFirst;
  const targetCount = Math.max(1, Math.min(config.targetCount, sentenceSubs.length));
  const targetDur = targetCount > 0 ? totalDur / targetCount : totalDur;

  const scenes: ImageScene[] = [];
  let curStart = tFirst;
  let accEnd = curStart;

  for (let i = 0; i < sentenceSubs.length; i++) {
    accEnd = sentenceSubs[i].end;
    const curDur = accEnd - curStart;

    const remainingSubs = sentenceSubs.length - (i + 1);
    const remainingSlots = targetCount - scenes.length - 1;
    const canStillFill = remainingSubs >= remainingSlots;
    const remDurIfCut = tLast - accEnd;
    const remMinNeed = remainingSlots * minDurSec;

    if (targetCount === 1 || (curDur >= targetDur && canStillFill && remDurIfCut >= remMinNeed)) {
      const startTime = fixed3(curStart);
      const endTime = fixed3(accEnd);
      const text = sentenceSubs
        .filter((x) => x.start < endTime && x.end > startTime)
        .map((x) => x.text)
        .join(" ")
        .trim();

      scenes.push({
        id: `scene_${scenes.length + 1}`,
        startTime,
        endTime,
        duration: fixed3(endTime - startTime),
        type: "image",
        text,
      });
      curStart = accEnd;
    }
  }

  if (curStart < tLast) {
    const startTime = fixed3(curStart);
    const endTime = fixed3(tLast);
    const text = sentenceSubs
      .filter((x) => x.start < endTime && x.end > startTime)
      .map((x) => x.text)
      .join(" ")
      .trim();

    scenes.push({
      id: `scene_${scenes.length + 1}`,
      startTime,
      endTime,
      duration: fixed3(endTime - startTime),
      type: "image",
      text,
    });
  }

  for (let i = 0; i < scenes.length; i++) {
    if (scenes[i].duration < minDurSec && i > 0) {
      scenes[i - 1].endTime = scenes[i].endTime;
      scenes[i - 1].duration = fixed3(scenes[i - 1].endTime - scenes[i - 1].startTime);
      scenes.splice(i, 1);
      i--;
    }
  }

  if (scenes.length >= 2) {
    const last = scenes[scenes.length - 1];
    if (last.duration < minLastSec) {
      const prev = scenes[scenes.length - 2];
      prev.endTime = last.endTime;
      prev.duration = fixed3(prev.endTime - prev.startTime);
      scenes.pop();
    }
  }

  if (scenes.length < minScenes && sentenceSubs.length >= minScenes) {
    return forceSplitBySentences(sentenceSubs, minScenes);
  }

  const normalized = normalizeScenes(scenes, tFirst, tLast);
  return normalized.map((s, idx) => ({ ...s, id: `scene_${idx + 1}` }));
}

function calculateShortFormTargetCount(totalDur: number, preferred = 5): number {
  const fallback = Math.max(3, preferred - 1);
  if (!Number.isFinite(totalDur) || totalDur <= 0) {
    return fallback;
  }

  const minPerScene = 4;
  const avg = totalDur / preferred;
  return avg < minPerScene ? fallback : preferred;
}

function calculateLongFormTargetCount(
  totalDur: number,
  sentenceCount: number,
  { minScenes, maxScenes }: { minScenes: number; maxScenes: number }
): number {
  if (!Number.isFinite(totalDur) || totalDur <= 0) {
    return Math.max(1, Math.min(sentenceCount, minScenes));
  }

  const approxByDuration = Math.ceil(totalDur / 8); // 목표: 장면당 약 8초
  const bounded = Math.max(minScenes, Math.min(maxScenes, approxByDuration));
  if (sentenceCount === 0) return bounded;
  return Math.max(1, Math.min(sentenceCount, bounded));
}

export function segmentSRTBySentence(
  subs: SrtItem[],
  opts?: { preferredTargetCount?: number; minDurSec?: number; minLastSec?: number; minScenes?: number }
): ImageScene[] {
  const sentenceSubs = buildSentenceSubs(subs);
  if (!sentenceSubs.length) return [];

  const minDurSec = opts?.minDurSec ?? 2;
  const minLastSec = opts?.minLastSec ?? 4;
  const minScenes = Math.max(3, opts?.minScenes ?? 3);
  const preferredTarget = opts?.preferredTargetCount ?? 5;
  const totalDur = sentenceSubs[sentenceSubs.length - 1].end - sentenceSubs[0].start;
  const targetCount = calculateShortFormTargetCount(totalDur, preferredTarget);

  return buildScenesFromSentenceSubs(sentenceSubs, {
    targetCount,
    minDurSec,
    minLastSec,
    minScenes,
  });
}

export function segmentSRTBySentenceLongForm(
  subs: SrtItem[],
  opts?: { minDurSec?: number; minLastSec?: number; minScenes?: number; maxScenes?: number }
): ImageScene[] {
  const sentenceSubs = buildSentenceSubs(subs);
  if (!sentenceSubs.length) return [];

  const minDurSec = opts?.minDurSec ?? 3;
  const minLastSec = opts?.minLastSec ?? 6;
  const minScenes = Math.max(8, opts?.minScenes ?? 8);
  const maxScenes = Math.max(minScenes, opts?.maxScenes ?? 15);
  const tFirst = sentenceSubs[0].start;
  const tLast = sentenceSubs[sentenceSubs.length - 1].end;
  const totalDur = tLast - tFirst;
  const targetCount = calculateLongFormTargetCount(totalDur, sentenceSubs.length, { minScenes, maxScenes });

  return buildScenesFromSentenceSubs(sentenceSubs, {
    targetCount,
    minDurSec,
    minLastSec,
    minScenes,
  });
}

// Lightweight waveform generation utility with in-memory caching
// Computes peak amplitudes at a fixed resolution (peaksPerSecond)

/**
 * 오디오 파형 데이터
 * - `peaks`: 초당 `peaksPerSecond` 개수로 샘플링된 최대 진폭 값들 (0..1 범위)
 * - `peaksPerSecond`: 초당 피크 샘플 개수 (해상도)
 * - `duration`: 전체 오디오 길이(초)
 */
export interface WaveformData {
  peaks: Float32Array;
  peaksPerSecond: number;
  duration: number; // seconds
}

/**
 * URL + 해상도(`peaksPerSecond`)를 키로 사용하는 메모리 캐시
 * - 동일한 요청에 대해 디코딩/계산을 재사용하여 성능 최적화
 * - Promise 자체를 캐싱해 동시 중복 호출도 단일 작업으로 합쳐짐
 */
const waveformCache: Map<string, Promise<WaveformData>> = new Map();

/**
 * 파형 데이터 생성 옵션
 * - `peaksPerSecond`: 초당 피크 샘플 수 (기본 1000, 최소 100, 최대 2000으로 클램프)
 * - `signal`: 외부에서 전달된 AbortSignal (취소 지원)
 */
interface GetWaveformOptions {
  peaksPerSecond?: number; // default 1000 (1ms resolution)
  signal?: AbortSignal;
}

/**
 * 주어진 오디오 URL로부터 파형 데이터를 계산해 반환합니다.
 *
 * 동작 개요:
 * - SSR 환경에서는 빈 파형을 즉시 반환합니다.
 * - `data:` URL은 fetch를 우회하고 직접 디코딩합니다(CORS 이슈 방지).
 * - 일반 URL은 fetch로 ArrayBuffer를 받아 Web Audio API로 디코딩합니다.
 * - 디코딩된 `AudioBuffer`를 기반으로 초당 `peaksPerSecond` 해상도로 최대 진폭 피크를 계산합니다.
 * - 동일한 URL/해상도의 중복 호출을 캐시로 방지합니다.
 *
 * 취소:
 * - 내부적으로 AbortController를 생성하고, 외부 `options.signal`과 병합해 fetch를 취소할 수 있습니다.
 *
 * @param url 오디오 소스 URL (http(s) 또는 data URL)
 * @param options 파형 생성 옵션
 * @returns 계산된 `WaveformData` (피크 배열, 해상도, 전체 길이)
 * @throws Web Audio API 미지원 시 에러 발생
 */
export async function getWaveformData(url: string, options: GetWaveformOptions = {}): Promise<WaveformData> {
  const peaksPerSecond = Math.max(100, Math.min(options.peaksPerSecond ?? 1000, 2000));

  const cacheKey = `${url}::pps=${peaksPerSecond}`;
  const existing = waveformCache.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
    if (typeof window === "undefined") {
      // SSR guard: return empty waveform placeholder
      return { peaks: new Float32Array(0), peaksPerSecond, duration: 0 };
    }

    const controller = new AbortController();
    const signals: AbortSignal[] = [];
    if (options.signal) signals.push(options.signal);
    signals.push(controller.signal);

    let arrayBuffer: ArrayBuffer;
    if (url.startsWith("data:")) {
      // Avoid fetch for data URLs to prevent CORS/mode quirks
      arrayBuffer = dataUrlToArrayBuffer(url);
    } else {
      const fetchSignal = mergeAbortSignals(signals);
      const response = await fetch(url, { signal: fetchSignal });
      arrayBuffer = await response.arrayBuffer();
    }

    const audioBuffer = await decodeAudioData(arrayBuffer);
    const peaks = computePeaks(audioBuffer, peaksPerSecond);

    try {
      // Close the context if we created one in decodeAudioData
      // No-op here; decodeAudioData manages closing.
    } catch {}

    return {
      peaks,
      peaksPerSecond,
      duration: audioBuffer.duration,
    };
  })();

  waveformCache.set(cacheKey, promise);
  return promise;
}

/**
 * 여러 AbortSignal을 하나의 AbortSignal로 병합합니다.
 * - 전달된 신호 중 하나라도 abort되면 병합된 신호도 abort됩니다.
 * - 신호가 없으면 `undefined`를 반환합니다.
 *
 * 주의: addEventListener로 리스너를 등록하므로, 장시간 유지되는 경우 정리 로직이 필요할 수 있습니다.
 *
 * @param signals 병합할 AbortSignal 배열
 * @returns 병합된 AbortSignal 또는 `undefined`
 */
function mergeAbortSignals(signals: AbortSignal[]): AbortSignal | undefined {
  const valid = signals.filter(Boolean);
  if (valid.length === 0) return undefined;
  if (valid.length === 1) return valid[0];
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  valid.forEach((s) => {
    if (s.aborted) controller.abort();
    else s.addEventListener("abort", onAbort);
  });
  return controller.signal;
}

/**
 * ArrayBuffer로부터 오디오 데이터를 디코딩하여 `AudioBuffer`를 생성합니다.
 *
 * 구현 세부:
 * - 표준 `AudioContext` 또는 Safari용 `webkitAudioContext`를 사용합니다.
 * - 디코딩 후에는 `audioCtx.close()`로 리소스를 신속히 해제합니다.
 * - 일부 브라우저 호환성을 위해 `arrayBuffer.slice(0)`로 복사본을 전달합니다.
 *
 * @param arrayBuffer 오디오 바이너리 데이터
 * @returns 디코딩된 `AudioBuffer`
 * @throws 브라우저가 Web Audio API를 지원하지 않으면 에러
 */
async function decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
  const w = window as Window & { webkitAudioContext?: typeof AudioContext };
  const AudioCtx: typeof AudioContext | undefined =
    typeof AudioContext !== "undefined" ? AudioContext : w.webkitAudioContext;
  if (!AudioCtx) {
    throw new Error("Web Audio API not supported in this browser");
  }

  const audioCtx = new AudioCtx();
  try {
    // Prefer promise-based API if available
    const decode = (ab: ArrayBuffer) =>
      new Promise<AudioBuffer>((resolve, reject) => {
        try {
          // Some browsers require copying the buffer
          audioCtx.decodeAudioData(ab.slice(0), resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    const audioBuffer = await decode(arrayBuffer);
    return audioBuffer;
  } finally {
    // Release resources quickly
    try {
      await audioCtx.close();
    } catch {}
  }
}

/**
 * `data:` URL을 ArrayBuffer로 변환합니다.
 *
 * 지원 포맷:
 * - base64 인코딩: `data:[<mediatype>];base64,<data>`
 * - URL 인코딩: `data:[<mediatype>],<percent-encoded-data>`
 *
 * @param dataUrl data URL 문자열
 * @returns 디코딩된 ArrayBuffer
 * @throws 잘못된 data URL 형식일 때 에러
 */
function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  // data:[<mediatype>][;base64],<data>
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) {
    throw new Error("Invalid data URL");
  }
  const metadata = dataUrl.slice(0, commaIndex);
  const data = dataUrl.slice(commaIndex + 1);
  const isBase64 = /;base64$/i.test(metadata);
  if (isBase64) {
    const binary = atob(data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
  // URL-encoded fallback
  const decoded = decodeURIComponent(data);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(decoded);
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  return ab;
}

/**
 * `AudioBuffer`로부터 일정 해상도(`peaksPerSecond`)로 최대 진폭 피크 배열을 계산합니다.
 *
 * 계산 방식:
 * - `blockSize = floor(sampleRate / peaksPerSecond)` 크기 블록 단위로 순회
 * - 각 블록에서 모든 채널 절댓값을 합산 후 평균(채널 수로 나눔) → 0..1 스케일 유지
 * - 블록 범위 내 최대값을 피크로 사용
 *
 * @param buffer 디코딩된 오디오 버퍼
 * @param peaksPerSecond 초당 피크 샘플 수
 * @returns 길이 `ceil(buffer.length / blockSize)`의 `Float32Array` (0..1)
 */
function computePeaks(buffer: AudioBuffer, peaksPerSecond: number): Float32Array {
  const { numberOfChannels, length, sampleRate } = buffer;
  if (length === 0) return new Float32Array(0);

  const blockSize = Math.max(1, Math.floor(sampleRate / peaksPerSecond));
  const numPeaks = Math.ceil(length / blockSize);
  const peaks = new Float32Array(numPeaks);

  // Pre-read channel data
  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numberOfChannels; ch++) {
    channels.push(buffer.getChannelData(ch));
  }

  for (let i = 0; i < numPeaks; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, length);
    let maxAbs = 0;
    for (let s = start; s < end; s++) {
      let mixed = 0;
      for (let ch = 0; ch < numberOfChannels; ch++) {
        mixed += Math.abs(channels[ch][s] || 0);
      }
      // Average across channels to keep 0..1 scale
      mixed = mixed / numberOfChannels;
      if (mixed > maxAbs) maxAbs = mixed;
    }
    peaks[i] = maxAbs;
  }

  return peaks;
}

/**
 * 파형 캔버스 렌더링 옵션
 * - `color`: 파형 색상 (기본 lime-400)
 * - `backgroundColor`: 배경색 (기본 transparent)
 * - `lineWidth`: 선 두께 (기본 1px)
 */
export interface DrawWaveformOptions {
  color?: string;
  backgroundColor?: string;
  lineWidth?: number;
}

/**
 * 캔버스에 특정 구간의 파형을 그립니다.
 *
 * 동작 개요:
 * - DPR(devicePixelRatio)을 고려해 레티나 디스플레이에서도 선명하게 렌더링합니다.
 * - `segmentStartSec` ~ `segmentEndSec` 범위를 `peaksPerSecond` 기준 인덱스로 변환합니다.
 * - 화면 상의 x픽셀 하나에 대응하는 피크 구간에서 최대값을 사용해 수직 라인을 그립니다(센터 기준 상하 대칭).
 * - 라인 x좌표에 0.5를 더해 크리스프한 1px 선을 유지합니다.
 *
 * @param canvas 그릴 대상 캔버스 요소
 * @param peaks `computePeaks`로 계산된 피크 배열
 * @param segmentStartSec 시작 구간(초)
 * @param segmentEndSec 종료 구간(초)
 * @param peaksPerSecond 피크 해상도 (초당 샘플 수)
 * @param options 색상/배경/라인두께 옵션
 */
export function drawWaveform(
  canvas: HTMLCanvasElement,
  peaks: Float32Array,
  segmentStartSec: number,
  segmentEndSec: number,
  peaksPerSecond: number,
  options: DrawWaveformOptions = {}
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const bg = options.backgroundColor ?? "transparent";
  const color = options.color ?? "#a3e635"; // lime-400
  const lineWidth = options.lineWidth ?? 1;

  // Clear
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const half = height / 2;
  const startIndex = Math.floor(segmentStartSec * peaksPerSecond);
  const endIndex = Math.max(startIndex + 1, Math.floor(segmentEndSec * peaksPerSecond));
  const totalPeaks = Math.max(1, endIndex - startIndex);
  const samplesPerPixel = totalPeaks / width;

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  for (let x = 0; x < width; x++) {
    const rangeStart = Math.floor(startIndex + x * samplesPerPixel);
    const rangeEnd = Math.min(endIndex, Math.floor(startIndex + (x + 1) * samplesPerPixel));
    let peak = 0;
    for (let i = rangeStart; i < rangeEnd; i++) {
      const v = peaks[i] || 0;
      if (v > peak) peak = v;
    }
    const y = peak * half;
    // vertical line from center
    const xpos = x + 0.5; // crisp line
    ctx.moveTo(xpos, half - y);
    ctx.lineTo(xpos, half + y);
  }

  ctx.stroke();
}

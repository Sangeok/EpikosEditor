// Lightweight waveform generation utility with in-memory caching
// Computes peak amplitudes at a fixed resolution (peaksPerSecond)

export interface WaveformData {
  peaks: Float32Array;
  peaksPerSecond: number;
  duration: number; // seconds
}

const waveformCache: Map<string, Promise<WaveformData>> = new Map();

interface GetWaveformOptions {
  peaksPerSecond?: number; // default 1000 (1ms resolution)
  signal?: AbortSignal;
}

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

export interface DrawWaveformOptions {
  color?: string;
  backgroundColor?: string;
  lineWidth?: number;
}

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

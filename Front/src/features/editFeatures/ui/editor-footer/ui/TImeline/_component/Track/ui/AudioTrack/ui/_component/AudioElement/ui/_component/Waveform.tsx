"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DrawWaveformOptions, WaveformData, drawWaveform, getWaveformData } from "@/shared/lib/waveform";

interface WaveformProps extends DrawWaveformOptions {
  url: string;
  segmentStartSec?: number; // default 0
  segmentEndSec?: number; // default waveform duration
  className?: string;
}

export default function Waveform({
  url,
  segmentStartSec = 0,
  segmentEndSec,
  className,
  color,
  backgroundColor,
  lineWidth,
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [waveform, setWaveform] = useState<WaveformData | null>(null);

  // Load & cache waveform
  useEffect(() => {
    const abort = new AbortController();
    getWaveformData(url, { signal: abort.signal })
      .then((data) => {
        if (!abort.signal.aborted) setWaveform(data);
      })
      .catch(() => {
        // swallow errors for UI; keep empty
      });
    return () => abort.abort();
  }, [url]);

  const drawingOptions = useMemo<DrawWaveformOptions>(
    () => ({
      color,
      backgroundColor,
      lineWidth,
    }),
    [color, backgroundColor, lineWidth]
  );

  // Draw when ready, and on resize
  useEffect(() => {
    if (!waveform || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const { peaks, peaksPerSecond, duration } = waveform;
    const start = Math.max(0, segmentStartSec);
    const end = Math.max(start, segmentEndSec ?? duration);

    const draw = () => drawWaveform(canvas, peaks, start, end, peaksPerSecond, drawingOptions);

    // initial draw
    draw();

    // Observe container for size changes
    const ro = new ResizeObserver(() => draw());
    ro.observe(containerRef.current);

    // Redraw on DPR changes (zoom)
    const dprMedia = window.matchMedia(`(resolution: ${Math.round(window.devicePixelRatio || 1)}dppx)`);
    const onDprChange = () => draw();
    try {
      // Some browsers might not support addEventListener on MediaQueryList
      dprMedia.addEventListener?.("change", onDprChange);
    } catch {}

    return () => {
      ro.disconnect();
      try {
        dprMedia.removeEventListener?.("change", onDprChange);
      } catch {}
    };
  }, [waveform, segmentStartSec, segmentEndSec, drawingOptions]);

  return (
    <div ref={containerRef} className={className} style={{ pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}


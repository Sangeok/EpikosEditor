"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface VideoFilmstripProps {
  src: string;
  startTime: number;
  endTime: number;
  isResizing?: boolean;
}

/** Ideal thumbnail width (in px) to calculate how many thumbnails to render */
const IDEAL_THUMBNAIL_WIDTH_PX = 80;
/** Upper bound for number of thumbnails to generate for performance safety */
const MAX_THUMBNAIL_COUNT = 80;

/** In-memory cache for filmstrip thumbnails keyed by video src + segment + dimensions */
const filmstripThumbnailsCache = new Map<string, string[]>();

export default function VideoFilmstrip({ src, startTime, endTime, isResizing }: VideoFilmstripProps) {
  /** Container element to measure available width/height */
  const containerRef = useRef<HTMLDivElement>(null);
  /** Current container dimensions (width/height in px) */
  const [containerDimensions, setContainerDimensions] = useState({ w: 0, h: 0 });
  /** Generated thumbnails (data URLs) */
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  /** Whether thumbnail generation failed; show fallback video preview */
  const [thumbnailGenerationFailed, setThumbnailGenerationFailed] = useState(false);
  /** Duration of the target segment in seconds */
  const segmentDurationSeconds = Math.max(0.001, endTime - startTime);

  /**
   * Observe container resize and update measured width/height.
   */
  useLayoutEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;
    const resizeObserver = new ResizeObserver(() => {
      const rect = containerElement.getBoundingClientRect();
      setContainerDimensions({ w: Math.max(0, Math.floor(rect.width)), h: Math.max(1, Math.floor(rect.height)) });
    });
    resizeObserver.observe(containerElement);
    return () => resizeObserver.disconnect();
  }, []);

  /**
   * Compute how many thumbnails should be rendered to fill the width.
   */
  const thumbnailCount = useMemo(() => {
    if (!containerDimensions.w) return 0;
    const idealCount = Math.ceil(containerDimensions.w / IDEAL_THUMBNAIL_WIDTH_PX);
    return Math.min(Math.max(1, idealCount), MAX_THUMBNAIL_COUNT);
  }, [containerDimensions.w]);

  /**
   * Cache key depends on src, time range, count and container height.
   */
  const filmstripCacheKey = useMemo(() => {
    if (!thumbnailCount || !containerDimensions.h) return "";
    return `${src}|${startTime.toFixed(3)}-${endTime.toFixed(3)}|c=${thumbnailCount}|h=${containerDimensions.h}`;
  }, [src, startTime, endTime, thumbnailCount, containerDimensions.h]);

  /**
   * Generate thumbnails for the filmstrip by sampling frames across the time segment.
   * Uses an offscreen <video> + <canvas>, caches results, and progressively updates UI.
   */
  useEffect(() => {
    let isAborted = false;
    if (!containerRef.current || !thumbnailCount || !containerDimensions.h) return;
    if (isResizing) return;

    const generateFilmstripThumbnails = async () => {
      try {
        // Serve from memory cache when available
        if (filmstripCacheKey && filmstripThumbnailsCache.has(filmstripCacheKey)) {
          if (!isAborted) setThumbnails(filmstripThumbnailsCache.get(filmstripCacheKey)!);
          return;
        }

        // Prepare an offscreen video element for frame extraction
        const videoElement = document.createElement("video");
        videoElement.src = src;
        videoElement.crossOrigin = "anonymous";
        videoElement.preload = "auto";
        videoElement.muted = true;
        videoElement.playsInline = true;

        // Wait for metadata to know intrinsic dimensions and duration
        await new Promise<void>((resolve, reject) => {
          const handleLoadedMetadata = () => resolve();
          const handleVideoError = () => reject(new Error("video load error"));
          videoElement.addEventListener("loadedmetadata", handleLoadedMetadata, { once: true });
          videoElement.addEventListener("error", handleVideoError, { once: true });
        });

        if (isAborted) return;

        // Evenly distribute timestamps across the requested segment
        const sampleTimestamps = Array.from({ length: thumbnailCount }, (_, index) => {
          const t = startTime + ((index + 0.5) / thumbnailCount) * segmentDurationSeconds;
          return Math.min(endTime - 0.001, Math.max(startTime, t));
        });

        const thumbnailWidthPx = Math.max(1, Math.floor(containerDimensions.w / thumbnailCount));
        const thumbnailHeightPx = containerDimensions.h;

        // Offscreen canvas used to draw each sampled frame
        const canvas = document.createElement("canvas");
        canvas.width = thumbnailWidthPx;
        canvas.height = thumbnailHeightPx;
        const canvas2dContext = canvas.getContext("2d", { willReadFrequently: true });

        const generatedThumbnailUrls: string[] = [];

        /**
         * Seek the video to a specific time and resolve when the frame is ready.
         */
        const seekVideoToTime = (t: number) =>
          new Promise<void>((resolve) => {
            const onSeeked = () => {
              videoElement.removeEventListener("seeked", onSeeked);
              resolve();
            };
            videoElement.addEventListener("seeked", onSeeked);
            try {
              videoElement.currentTime = t;
            } catch {
              setTimeout(() => (videoElement.currentTime = t), 16);
            }
          });

        /**
         * Draw the current video frame onto the canvas using a "cover" fit.
         * This preserves aspect ratio and fills the entire thumbnail area.
         */
        const drawVideoFrameCoverFit = () => {
          if (!canvas2dContext) return;
          const videoWidth = Math.max(1, videoElement.videoWidth || 1);
          const videoHeight = Math.max(1, videoElement.videoHeight || 1);
          const scale = Math.max(thumbnailWidthPx / videoWidth, thumbnailHeightPx / videoHeight);
          const sourceWidth = Math.min(videoWidth, thumbnailWidthPx / scale);
          const sourceHeight = Math.min(videoHeight, thumbnailHeightPx / scale);
          const sourceX = Math.max(0, (videoWidth - sourceWidth) / 2);
          const sourceY = Math.max(0, (videoHeight - sourceHeight) / 2);
          canvas2dContext.clearRect(0, 0, thumbnailWidthPx, thumbnailHeightPx);
          canvas2dContext.drawImage(
            videoElement,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            thumbnailWidthPx,
            thumbnailHeightPx
          );
        };

        for (let i = 0; i < sampleTimestamps.length; i++) {
          if (isAborted) return;
          await seekVideoToTime(sampleTimestamps[i]);
          drawVideoFrameCoverFit();
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          generatedThumbnailUrls.push(dataUrl);
          if (!isAborted) setThumbnails((prev) => (prev.length === thumbnailCount ? prev : [...prev, dataUrl]));
          await new Promise((resolveOnNextTick) => setTimeout(resolveOnNextTick, 0));
        }
        if (filmstripCacheKey) filmstripThumbnailsCache.set(filmstripCacheKey, generatedThumbnailUrls);
      } catch {
        if (!isAborted) setThumbnailGenerationFailed(true);
      }
    };

    generateFilmstripThumbnails();

    return () => {
      isAborted = true;
    };
  }, [
    src,
    startTime,
    endTime,
    thumbnailCount,
    containerDimensions.h,
    isResizing,
    filmstripCacheKey,
    segmentDurationSeconds,
  ]);

  if (!thumbnailCount || !containerDimensions.w) {
    return <div ref={containerRef} className="w-full h-full" />;
  }

  if (thumbnailGenerationFailed) {
    return (
      <div ref={containerRef} className="w-full h-full">
        <video
          src={src}
          className="w-full h-full object-cover opacity-90"
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          controls={false}
        />
      </div>
    );
  }

  if (thumbnails.length === 0 && !isResizing) {
    return <div ref={containerRef} className="w-full h-full bg-black/30" />;
  }

  const thumbnailItemWidthPx = thumbnailCount ? Math.max(1, Math.floor(containerDimensions.w / thumbnailCount)) : 0;

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <div className="flex h-full">
        {thumbnails.map((thumbnail, index) => (
          <Image
            key={index}
            src={thumbnail}
            alt=""
            width={thumbnailItemWidthPx}
            height={containerDimensions.h}
            unoptimized
            className="h-full object-cover select-none pointer-events-none"
            draggable={false}
            style={{ width: `${thumbnailItemWidthPx}px` }}
          />
        ))}
      </div>
    </div>
  );
}

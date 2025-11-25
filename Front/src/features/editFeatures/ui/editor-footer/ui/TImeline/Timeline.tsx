"use client";

import { useEffect, useMemo, useRef } from "react";
import TimelineRuler from "./_component/TimelineRuler/TimelineRuler";
import CurrentTimeIndicator from "./_component/CurrentTimeIndicator/ui/CurrentTimeIndicator";

import SnapGuideIndicator from "./_component/SnapGuide/SnapGuideIndicator";
import TextTrack from "./_component/Track/ui/TextTrack/ui/TextTrack";
import MediaTrack from "./_component/Track/ui/MediaTrack/ui";
import AudioTrack from "./_component/Track/ui/AudioTrack/ui/AudioTrack";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";
import DeleteSelectedElementListener from "./_component/DeleteSelectedElementListener";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { useMediaStore } from "@/entities/media/useMediaStore";

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { media } = useMediaStore();

  const textLanes = useTrackLaneStore((s) => s.textLanes);
  const mediaLanes = useTrackLaneStore((s) => s.mediaLanes);
  const audioLanes = useTrackLaneStore((s) => s.audioLanes);

  const { pixelsPerSecond, timelineWidth, setTimelineWidth, setViewportFromContainer } = useTimelineStore();

  // total timeline pixel length (content width)
  const contentWidth = useMemo(() => {
    const duration = media.projectDuration || 0;
    const padSeconds = duration > 50 ? 5 : 0; // 55s 초과 시 최소 +10s 확장
    const totalPx = (duration + padSeconds) * pixelsPerSecond;
    return Math.max(totalPx, timelineWidth);
  }, [media.projectDuration, pixelsPerSecond, timelineWidth]);

  // measure container initial/resize and sync viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateFromContainer = () => {
      setTimelineWidth(el.clientWidth);
      setViewportFromContainer(el.scrollLeft, el.clientWidth);
    };

    updateFromContainer();

    const handleScroll = () => setViewportFromContainer(el.scrollLeft, el.clientWidth);
    el.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => updateFromContainer());
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [setTimelineWidth, setViewportFromContainer]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 min-h-0 flex flex-col border border-gray-700 overflow-x-auto overflow-y-hidden"
      data-timeline-container="true"
    >
      <div className="relative flex h-full flex-col" style={{ width: `${contentWidth}px` }}>
        {/* dynamic ruler */}
        <TimelineRuler />

        {/* main timeline area */}
        <div className="flex-1 min-h-0 bg-black overflow-y-auto overflow-x-hidden">
          {/* area for timeline tracks */}
          <div className="relative flex flex-col min-h-[100px]">
            {textLanes.map((id) => (
              <div key={`text-${id}`} className="shrink-0" style={{ height: `${55}px` }}>
                <TextTrack laneId={id} />
              </div>
            ))}
            {mediaLanes.map((id) => (
              <div key={`media-${id}`} className="shrink-0" style={{ height: `${55}px` }}>
                <MediaTrack laneId={id} />
              </div>
            ))}
            {audioLanes.map((id) => (
              <div key={`audio-${id}`} className="shrink-0" style={{ height: `${55}px` }}>
                <AudioTrack laneId={id} />
              </div>
            ))}
            {/* future timeline track components will be rendered here */}
          </div>
        </div>

        <DeleteSelectedElementListener />
        {/* Snap vertical guide overlay (beneath current time indicator) */}
        <SnapGuideIndicator />
        <CurrentTimeIndicator />
      </div>
    </div>
  );
}

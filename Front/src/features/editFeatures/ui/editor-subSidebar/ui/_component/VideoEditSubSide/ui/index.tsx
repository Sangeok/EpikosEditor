"use client";

import { useVideoEdit } from "../model/hooks/useVideoEdit/useVideoEdit";
import MediaFileUploadArea from "../../MediaFileUploadArea";
import VideoPreviewArea from "./_component/VideoPreviewArea";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";
import LaneSelector from "../../SelectTextTrack";

export default function VideoEditSubSide() {
  const { state, actions, fileInputRef } = useVideoEdit();

  const mediaLanes = useTrackLaneStore((s) => s.mediaLanes);
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);

  const setActiveLane = useTrackLaneStore((s) => s.setActiveLane);
  const addMediaLane = useTrackLaneStore((s) => s.addMediaLane);

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Video</h3>

      {/* Lane selector */}
      <LaneSelector
        title="Media"
        addLane={addMediaLane}
        activeLaneByType={activeLaneByType}
        setActiveLane={setActiveLane}
        lanes={mediaLanes}
      />

      <MediaFileUploadArea
        mediaType="video"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
      />

      <VideoPreviewArea
        uploadedVideos={state.uploadedVideos}
        removeVideo={actions.removeVideo}
        addVideoToTimeline={actions.addVideoToTimeline}
      />
    </div>
  );
}

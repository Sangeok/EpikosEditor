"use client";

import MediaFileUploadArea from "../../MediaFileUploadArea";
import LaneSelector from "../../SelectTextTrack";
import { useImageEdit } from "../model/hooks/useImageEdit";
import ImagePreviewArea from "./_component/ImagePreviewArea";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export default function ImageEditSubSide() {
  const { state, actions, fileInputRef } = useImageEdit();

  const mediaLanes = useTrackLaneStore((s) => s.mediaLanes);
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);
  const setActiveLane = useTrackLaneStore((s) => s.setActiveLane);
  const addMediaLane = useTrackLaneStore((s) => s.addMediaLane);

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Image</h3>

      {/* Lane selector */}
      <LaneSelector
        title="Media"
        addLane={addMediaLane}
        activeLaneByType={activeLaneByType}
        setActiveLane={setActiveLane}
        lanes={mediaLanes}
      />

      <MediaFileUploadArea
        mediaType="image"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
      />

      <ImagePreviewArea
        uploadedImages={state.uploadedImages}
        addImageToTimeLine={actions.addImageToTimeLine}
        removeImage={actions.removeImage}
      />
    </div>
  );
}

"use client";

import { useCaptionUpload } from "../model/hooks/useCaptionUpload";
import MediaFileUploadArea from "../../MediaFileUploadArea";
import CaptionEdit from "./_components/captionEdit/ui";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";
import LaneSelector from "../../SelectTextTrack";

export default function CaptionEditSubSide() {
  const { state, actions, fileInputRef } = useCaptionUpload();

  const textLanes = useTrackLaneStore((s) => s.textLanes);
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);
  const setActiveLane = useTrackLaneStore((s) => s.setActiveLane);
  const addTextLane = useTrackLaneStore((s) => s.addTextLane);

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Captions</h3>

      {/* Lane selector */}
      <LaneSelector
        title="Text"
        addLane={addTextLane}
        activeLaneByType={activeLaneByType}
        setActiveLane={setActiveLane}
        lanes={textLanes}
      />

      <MediaFileUploadArea
        mediaType="caption"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
      />

      <CaptionEdit />
    </div>
  );
}

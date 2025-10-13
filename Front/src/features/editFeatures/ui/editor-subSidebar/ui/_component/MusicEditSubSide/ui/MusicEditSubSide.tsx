"use client";

import { useAudioEdit } from "../model/hooks/useAudioEdit";
import MediaFileUploadArea from "../../MediaFileUploadArea";
import AudioListArea from "./_component/AudioListArea";
import AudioInstructions from "./_component/AudioInstructions";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";
import LaneSelector from "../../SelectTextTrack";

export default function MusicEditSubSide() {
  const { state, actions, fileInputRef } = useAudioEdit();

  const audioLanes = useTrackLaneStore((s) => s.audioLanes);
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);
  const setActiveLane = useTrackLaneStore((s) => s.setActiveLane);
  const addAudioLane = useTrackLaneStore((s) => s.addAudioLane);

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Audio</h3>

      {/* Lane selector */}
      <LaneSelector
        title="Audio"
        addLane={addAudioLane}
        activeLaneByType={activeLaneByType}
        setActiveLane={setActiveLane}
        lanes={audioLanes}
      />

      <MediaFileUploadArea
        mediaType="audio"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
        loading={state.loading}
      />

      <AudioListArea
        uploadedAudios={state.uploadedAudios}
        playingIndex={state.playingIndex}
        togglePreview={actions.togglePreview}
        removeAudio={actions.removeAudio}
        addAudioToTimeLine={actions.addAudioToTimeLine}
      />

      <AudioInstructions />
    </div>
  );
}

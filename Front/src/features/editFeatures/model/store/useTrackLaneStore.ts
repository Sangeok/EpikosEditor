import { create } from "zustand";

export type LaneKind = "Text" | "Media" | "Audio";

interface TrackLaneState {
  textLanes: string[];
  mediaLanes: string[];
  audioLanes: string[];
  activeLaneByType: { Text: string; Media: string; Audio: string };
  addTextLane: () => string;
  addMediaLane: () => string;
  addAudioLane: () => string;
  setActiveLane: (kind: LaneKind, laneId: string) => void;
}

const generateLaneId = (prefix: LaneKind, index: number): string => `${prefix}-${index}`;

export const useTrackLaneStore = create<TrackLaneState>((set, get) => ({
  textLanes: ["Text-0"],
  mediaLanes: ["Media-0"],
  audioLanes: ["Audio-0"],
  activeLaneByType: { Text: "Text-0", Media: "Media-0", Audio: "Audio-0" },

  addTextLane: () => {
    const { textLanes } = get();
    const nextId = generateLaneId("Text", textLanes.length);
    const nextLanes = [...textLanes, nextId];
    set({ textLanes: nextLanes, activeLaneByType: { ...get().activeLaneByType, Text: nextId } });
    return nextId;
  },

  addMediaLane: () => {
    const { mediaLanes } = get();
    const nextId = generateLaneId("Media", mediaLanes.length);
    const nextLanes = [...mediaLanes, nextId];
    set({ mediaLanes: nextLanes, activeLaneByType: { ...get().activeLaneByType, Media: nextId } });
    return nextId;
  },

  addAudioLane: () => {
    const { audioLanes } = get();
    const nextId = generateLaneId("Audio", audioLanes.length);
    const nextLanes = [...audioLanes, nextId];
    set({ audioLanes: nextLanes, activeLaneByType: { ...get().activeLaneByType, Audio: nextId } });
    return nextId;
  },

  setActiveLane: (kind, laneId) => {
    const { activeLaneByType } = get();
    set({ activeLaneByType: { ...activeLaneByType, [kind]: laneId } as TrackLaneState["activeLaneByType"] });
  },
}));

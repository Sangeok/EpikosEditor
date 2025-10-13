import { create } from "zustand";

export type SelectedTrack = "Text" | "Video" | "Audio" | "Image" | null;

interface SelectedTrackStore {
  selectedTrack: string | null;
  selectedTrackId: string | null;
  setSelectedTrack: (track: string | null) => void;
  setSelectedTrackId: (trackId: string | null) => void;
  setSelectedTrackAndId: (track: string | null, trackId: string | null) => void;
}

export const useSelectedTrackStore = create<SelectedTrackStore>((set) => ({
  selectedTrack: null,
  selectedTrackId: null,

  setSelectedTrack: (track: string | null) => set({ selectedTrack: track }),
  setSelectedTrackId: (trackId: string | null) =>
    set({ selectedTrackId: trackId }),

  setSelectedTrackAndId: (track: string | null, trackId: string | null) =>
    set({ selectedTrack: track, selectedTrackId: trackId }),
}));

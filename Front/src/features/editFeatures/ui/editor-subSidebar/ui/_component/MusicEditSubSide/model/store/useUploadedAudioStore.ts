import { create } from "zustand";
import { UploadedAudio } from "../types";

interface UploadedAudioStore {
  audios: UploadedAudio[];
  addAudio: (audio: UploadedAudio) => void;
  removeAudio: (index: number) => void;
  clear: () => void;
}

export const useUploadedAudioStore = create<UploadedAudioStore>((set) => ({
  audios: [],
  addAudio: (audio) => set((s) => ({ audios: [...s.audios, audio] })),
  removeAudio: (index) => set((s) => ({ audios: s.audios.filter((_, i) => i !== index) })),
  clear: () => set({ audios: [] }),
}));

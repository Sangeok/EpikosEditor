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
  addAudio: (audio) => set((state) => ({ audios: [...state.audios, audio] })),
  removeAudio: (index) => set((state) => ({ audios: state.audios.filter((_, i) => i !== index) })),
  clear: () => set({ audios: [] }),
}));

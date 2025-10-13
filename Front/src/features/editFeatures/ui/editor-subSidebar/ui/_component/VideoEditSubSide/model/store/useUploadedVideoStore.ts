import { create } from "zustand";
import { UploadedVideo } from "../type";

interface UploadedVideoStore {
  videos: UploadedVideo[];
  addVideo: (video: UploadedVideo) => void;
  removeVideo: (index: number) => void;
  clear: () => void;
}

export const useUploadedVideoStore = create<UploadedVideoStore>((set) => ({
  videos: [],
  addVideo: (video) => set((s) => ({ videos: [...s.videos, video] })),
  removeVideo: (index) =>
    set((s) => {
      const target = s.videos[index];
      if (target?.url) {
        URL.revokeObjectURL(target.url);
      }
      return { videos: s.videos.filter((_, i) => i !== index) };
    }),
  clear: () => set({ videos: [] }),
}));

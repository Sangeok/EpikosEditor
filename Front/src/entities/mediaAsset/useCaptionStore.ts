import { create } from "zustand";
import type { ImageScene } from "@/entities/mediaAsset/types/SceneTypes";

type CaptionStore = {
  scenes: ImageScene[];
  setScenes: (scenes: ImageScene[]) => void;
};

export const useCaptionStore = create<CaptionStore>((set) => ({
  scenes: [],
  setScenes: (scenes: ImageScene[]) => set({ scenes }),
}));

export default useCaptionStore;

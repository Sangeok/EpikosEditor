import { create } from "zustand";

export type ActiveSideButtonType =
  | "Text"
  | "Video"
  | "Captions"
  | "Image"
  | "Music"
  | null;

interface SideButtonStore {
  activeSideButton: ActiveSideButtonType;
  setActiveSideButton: (buttonType: ActiveSideButtonType) => void;
  isSideButtonActive: (buttonType: ActiveSideButtonType) => boolean;
}

const useSideButtonStore = create<SideButtonStore>((set, get) => ({
  activeSideButton: null,

  setActiveSideButton: (buttonType: ActiveSideButtonType) =>
    set({ activeSideButton: buttonType }),

  isSideButtonActive: (buttonType: ActiveSideButtonType) =>
    get().activeSideButton === buttonType,
}));

export default useSideButtonStore;

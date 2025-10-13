import { create } from "zustand";

interface SnapGuideState {
  /** Whether the vertical snap guide should be visible */
  isVisible: boolean;
  /** X position in pixels from the left of the timeline container */
  xPositionPx: number | null;
  /** Optional time in seconds of the guide (for debugging/tooltip) */
  timeSeconds?: number | null;
}

interface SnapGuideActions {
  /** Show guide at a specific pixel position (and optional time) */
  showGuide: (xPositionPx: number, timeSeconds?: number | null) => void;
  /** Hide guide */
  hideGuide: () => void;
}

export type SnapGuideStore = SnapGuideState & SnapGuideActions;

export const useSnapGuideStore = create<SnapGuideStore>((set) => ({
  isVisible: false,
  xPositionPx: null,
  timeSeconds: null,

  showGuide: (xPositionPx, timeSeconds = null) =>
    set({ isVisible: true, xPositionPx, timeSeconds }),

  hideGuide: () =>
    set({ isVisible: false, xPositionPx: null, timeSeconds: null }),
}));

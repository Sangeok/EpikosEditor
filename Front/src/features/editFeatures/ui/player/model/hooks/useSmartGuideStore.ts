import { create } from "zustand";

// if the object(text) is near the edge of the composition(image), the data is stored
interface NearObjEdgeData {
  edgeKey: "left" | "right" | "top" | "bottom";
  distance: number;
  edgeXorYPosition: number;
  top: number;
  height: number;
}

export interface DraggingTextRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface SmartGuideState {
  showVerticalSmartGuide: boolean;
  showHorizonSmartGuide: boolean;

  isDraggingText: boolean;

  draggingTextRect: DraggingTextRect | null;

  nearObjEdgeData: NearObjEdgeData | null;
}

interface SmartGuideActions {
  setShowVerticalSmartGuide: (showVerticalSmartGuide: boolean) => void;
  setShowHorizonSmartGuide: (showHorizonSmartGuide: boolean) => void;

  setSmartGuides: (showVerticalSmartGuide: boolean, showHorizonSmartGuide: boolean) => void;
  setNearObjEdgeData: (nearObjEdgeData: NearObjEdgeData | null) => void;

  setIsDraggingText: (isDraggingText: boolean) => void;
  setDraggingTextRect: (rect: DraggingTextRect | null) => void;

  clearSmartGuides: () => void;
}

export type SmartGuideStore = SmartGuideState & SmartGuideActions;

export const useSmartGuideStore = create<SmartGuideStore>((set) => ({
  showVerticalSmartGuide: false,
  showHorizonSmartGuide: false,
  isDraggingText: false,
  draggingTextRect: null,
  nearObjEdgeData: null,

  setSmartGuides: (showVerticalSmartGuide, showHorizonSmartGuide) =>
    set({ showVerticalSmartGuide, showHorizonSmartGuide }),

  setShowVerticalSmartGuide: (showVerticalSmartGuide) => set({ showVerticalSmartGuide }),
  setShowHorizonSmartGuide: (showHorizonSmartGuide) => set({ showHorizonSmartGuide }),
  setIsDraggingText: (isDraggingText) => set({ isDraggingText }),
  setNearObjEdgeData: (nearObjEdgeData) => set({ nearObjEdgeData }),

  setDraggingTextRect: (rect) => set({ draggingTextRect: rect }),

  clearSmartGuides: () =>
    set({
      isDraggingText: false,
      showVerticalSmartGuide: false,
      showHorizonSmartGuide: false,
      nearObjEdgeData: null,
      draggingTextRect: null,
    }),
}));

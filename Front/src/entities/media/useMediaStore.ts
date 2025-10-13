import { create } from "zustand";
import { AudioElement, Media, MediaElement, TextElement } from "./types";
import { roundTime } from "@/shared/lib/timeConversion";

export const initialMedia: Media = {
  // video duration
  projectDuration: 0,
  fps: 30,

  textElement: [],
  mediaElement: [],
  audioElement: [],
};

interface MediaStore {
  media: Media;
  setMedia: (media: Media) => void;
  setFps: (fps: number) => void;
  addTextElement: (textElement: TextElement, preserveTiming?: boolean) => void;
  deleteTextElement: (textElementId: string) => void;
  updateTextElement: (textElementId: string, updates: Partial<TextElement>) => void;
  updateSameLaneTextElement: (sourceTextElementId: string, updates: Partial<TextElement>) => void;
  updateTextElementPosition: (elementId: string, position: { x: number; y: number }) => void;
  updateTextBackgroundColor: (
    sourceTextElementId: string,
    style: { backgroundColor: string; textColor: string }
  ) => void;
  updateMultipleTextElements: (updates: Array<{ id: string; updates: Partial<TextElement> }>) => void;
  splitTextElement: (textElementId: string, splitTime: number) => void;
  cloneTextElement: (textElementId: string) => string | null;
  addMediaElement: (mediaElement: MediaElement) => void;
  addMediaElements: (mediaElements: MediaElement[]) => void;
  deleteMediaElement: (mediaElementId: string) => void;
  updateMediaElement: (mediaElementId: string, updates: Partial<MediaElement>) => void;
  updateAllMediaElement: (
    sourceMediaElementId: string,
    mediaType: "image" | "video",
    updates: Partial<MediaElement>
  ) => void;
  updateMultipleMediaElements: (updates: Array<{ id: string; updates: Partial<MediaElement> }>) => void;
  splitMediaElement: (mediaElementId: string, splitTime: number) => void;
  cloneMediaElement: (mediaElementId: string) => string | null;
  addAudioElement: (audioElement: AudioElement) => void;
  deleteAudioElement: (audioElementId: string) => void;
  updateAudioElement: (audioElementId: string, updates: Partial<AudioElement>) => void;
  updateMultipleAudioElements: (updates: Array<{ id: string; updates: Partial<AudioElement> }>) => void;
  splitAudioElement: (audioElementId: string, splitTime: number) => void;
  cloneAudioElement: (audioElementId: string) => string | null;
}

export const useMediaStore = create<MediaStore>((set, get) => ({
  media: initialMedia,
  setMedia: (media) => set({ media }),
  setFps: (fps) => set({ media: { ...get().media, fps } }),
  addTextElement: (textElement: TextElement, preserveTiming = false) =>
    set((state) => {
      const all = state.media.textElement;
      const laneId = textElement.laneId ?? "Text-0";
      const inLane = all.filter((el) => (el.laneId ?? "Text-0") === laneId);

      const newTextElement: TextElement = { ...textElement };
      if (!preserveTiming && inLane.length > 0) {
        const lastInLane = inLane[inLane.length - 1];
        const addedElementDuration = textElement.duration;
        newTextElement.startTime = lastInLane.endTime;
        newTextElement.endTime = lastInLane.endTime + addedElementDuration;
      }

      const updatedTextElements = [...all, newTextElement];
      const newProjectDuration = Math.max(state.media.projectDuration, newTextElement.endTime);

      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    }),
  deleteTextElement: (textElementId: string) =>
    set((state) => {
      const updatedTextElements = state.media.textElement.filter((textElement) => textElement.id !== textElementId);

      const allElements = [...state.media.mediaElement, ...state.media.audioElement, ...updatedTextElements];

      // recalculate projectDuration after deletion
      const newProjectDuration =
        allElements.length > 0 ? Math.max(...allElements.map((element) => element.endTime)) : 0;

      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    }),
  updateTextElementPosition: (elementId: string, position: { x: number; y: number }) =>
    set((state) => {
      const target = state.media.textElement.find((el) => el.id === elementId);
      if (!target) {
        return { media: state.media };
      }
      const laneId = target.laneId ?? "Text-0";
      const updatedTextElements = state.media.textElement.map((element) => {
        const sameLane = (element.laneId ?? "Text-0") === laneId;
        return sameLane ? { ...element, positionX: position.x, positionY: position.y } : element;
      });

      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
        },
      };
    }),
  updateSameLaneTextElement: (sourceTextElementId: string, updates: Partial<TextElement>) =>
    set((state) => {
      const source = state.media.textElement.find((el) => el.id === sourceTextElementId);
      if (!source) {
        return { media: state.media };
      }
      const laneId = source.laneId ?? "Text-0";

      const updatedTextElements = state.media.textElement.map((element) =>
        (element.laneId ?? "Text-0") === laneId ? { ...element, ...updates } : element
      );

      return {
        media: { ...state.media, textElement: updatedTextElements },
      };
    }),
  updateTextElement: (textElementId: string, updates: Partial<TextElement>) =>
    set((state) => {
      const updatedTextElements = state.media.textElement.map((element) =>
        element.id === textElementId ? { ...element, ...updates } : element
      );

      const allEndTimes = [
        ...updatedTextElements.map((element) => element.endTime),
        ...state.media.mediaElement.map((element) => element.endTime),
        ...state.media.audioElement.map((element) => element.endTime),
      ];

      const newProjectDuration = allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  splitTextElement: (textElementId: string, splitTime: number) =>
    set((state) => {
      const elementIndex = state.media.textElement.findIndex((el) => el.id === textElementId);
      if (elementIndex === -1) {
        return { media: state.media };
      }
      const originalTextElement = state.media.textElement[elementIndex];
      const originalStartTime = originalTextElement.startTime;
      const originalEndTime = originalTextElement.endTime;
      const splitTimeRounded = roundTime(splitTime);
      if (splitTimeRounded <= originalStartTime || splitTimeRounded >= originalEndTime) {
        return { media: state.media };
      }

      const leftTextElement: TextElement = {
        ...originalTextElement,
        endTime: splitTimeRounded,
        duration: roundTime(splitTimeRounded - originalStartTime),
      };

      const rightTextElement: TextElement = {
        ...originalTextElement,
        id: crypto.randomUUID(),
        startTime: splitTimeRounded,
        duration: roundTime(originalEndTime - splitTimeRounded),
      };

      const updatedTextElements = state.media.textElement.slice();
      updatedTextElements[elementIndex] = leftTextElement;
      updatedTextElements.splice(elementIndex + 1, 0, rightTextElement);

      const allTrackEndTimes = [
        ...state.media.mediaElement.map((el) => el.endTime),
        ...updatedTextElements.map((el) => el.endTime),
        ...state.media.audioElement.map((el) => el.endTime),
      ];
      const newProjectDuration = allTrackEndTimes.length > 0 ? Math.max(...allTrackEndTimes) : 0;

      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  updateMultipleTextElements: (updates: Array<{ id: string; updates: Partial<TextElement> }>) =>
    set((state) => {
      const updatedTextElements = state.media.textElement.map((element) => {
        const update = updates.find((u) => u.id === element.id);
        return update ? { ...element, ...update.updates } : element;
      });

      // recalculate projectDuration after update
      const allEndTimes = [
        ...state.media.mediaElement.map((element) => element.endTime),
        ...updatedTextElements.map((element) => element.endTime),
        ...state.media.audioElement.map((element) => element.endTime),
      ];

      const newProjectDuration = allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  updateTextBackgroundColor: (sourceTextElementId: string, style: { backgroundColor: string; textColor: string }) =>
    set((state) => {
      const source = state.media.textElement.find((el) => el.id === sourceTextElementId);
      if (!source) {
        return { media: state.media };
      }
      const laneId = source.laneId ?? "Text-0";

      const updatedTextElements = state.media.textElement.map((element) =>
        (element.laneId ?? "Text-0") === laneId
          ? { ...element, backgroundColor: style.backgroundColor, textColor: style.textColor }
          : element
      );

      return {
        media: { ...state.media, textElement: updatedTextElements },
      };
    }),

  cloneTextElement: (textElementId: string) => {
    let createdId: string | null = null;
    set((state) => {
      const source = state.media.textElement.find((el) => el.id === textElementId);
      if (!source) {
        return { media: state.media };
      }

      const laneId = source.laneId ?? "Text-0";
      const inLane = state.media.textElement.filter((el) => (el.laneId ?? "Text-0") === laneId);
      const lastInLane = inLane[inLane.length - 1];

      const newId = crypto.randomUUID();
      const startTime = lastInLane ? lastInLane.endTime : 0;
      const endTime = startTime + source.duration;

      const cloned: TextElement = { ...source, id: newId, startTime, endTime };

      const updatedTextElements = [...state.media.textElement, cloned];
      const newProjectDuration = Math.max(state.media.projectDuration, cloned.endTime);

      createdId = newId;
      return {
        media: {
          ...state.media,
          textElement: updatedTextElements,
          projectDuration: newProjectDuration,
        },
      };
    });
    return createdId;
  },

  addMediaElement: (mediaElement: MediaElement) =>
    set((state) => {
      const all = state.media.mediaElement;
      const laneId = mediaElement.laneId ?? "Media-0";
      const inLane = all.filter((el) => (el.laneId ?? "Media-0") === laneId);

      const newMediaElement: MediaElement = { ...mediaElement };
      if (inLane.length > 0) {
        const lastInLane = inLane[inLane.length - 1];
        newMediaElement.startTime = lastInLane.endTime;
        newMediaElement.endTime = lastInLane.endTime + mediaElement.duration;
      }

      const updatedMediaElements = [...all, newMediaElement];
      const newProjectDuration = Math.max(state.media.projectDuration, newMediaElement.endTime);

      return {
        media: {
          ...state.media,
          mediaElement: updatedMediaElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  addMediaElements: (mediaElements: MediaElement[]) =>
    set((state) => {
      const all = state.media.mediaElement;

      // lane별 마지막 endTime 계산(기존 상태 기준)
      const laneLastEnd = new Map<string, number>();
      for (const el of all) {
        const lane = el.laneId ?? "Media-0";
        laneLastEnd.set(lane, Math.max(laneLastEnd.get(lane) ?? 0, el.endTime));
      }

      // 새로 추가할 요소들 계산
      const toAdd: MediaElement[] = [];
      for (const el of mediaElements) {
        const lane = el.laneId ?? "Media-0";
        const hasExisting = laneLastEnd.has(lane);
        const base = laneLastEnd.get(lane) ?? 0;

        // 기존 요소가 있으면 무조건 이어 붙이고,
        // 없으면 주어진 startTime을 우선, 없으면 0부터 시작
        const startTime = hasExisting ? base : el.startTime ?? 0;
        const endTime = startTime + el.duration;

        const next: MediaElement = { ...el, startTime, endTime };
        toAdd.push(next);
        laneLastEnd.set(lane, endTime);
      }

      const updated = [...all, ...toAdd];
      const addedMaxEnd = toAdd.length ? Math.max(...toAdd.map((e) => e.endTime)) : state.media.projectDuration;
      const newProjectDuration = Math.max(state.media.projectDuration, addedMaxEnd);

      return {
        media: {
          ...state.media,
          mediaElement: updated,
          projectDuration: newProjectDuration,
        },
      };
    }),
  deleteMediaElement: (mediaElementId: string) =>
    set((state) => {
      const updatedMediaElements = state.media.mediaElement.filter(
        (mediaElement) => mediaElement.id !== mediaElementId
      );

      const allElements = [...state.media.textElement, ...state.media.audioElement, ...updatedMediaElements];

      const newProjectDuration =
        allElements.length > 0 ? Math.max(...allElements.map((element) => element.endTime)) : 0;

      return {
        media: {
          ...state.media,
          mediaElement: updatedMediaElements,
          projectDuration: newProjectDuration,
        },
      };
    }),
  updateMediaElement: (mediaElementId: string, updates: Partial<MediaElement>) =>
    set((state) => {
      const updatedMediaElements = state.media.mediaElement.map((element) =>
        element.id === mediaElementId ? { ...element, ...updates } : element
      );

      // recalculate projectDuration after update
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...updatedMediaElements.map((element) => element.endTime),
        ...state.media.audioElement.map((element) => element.endTime),
      ];

      const newProjectDuration = allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          mediaElement: updatedMediaElements,
          projectDuration: newProjectDuration,
        },
      };
    }),
  updateAllMediaElement: (sourceMediaElementId: string, mediaType: "image" | "video", updates: Partial<MediaElement>) =>
    set((state) => {
      const source = state.media.mediaElement.find((el) => el.id === sourceMediaElementId);
      if (!source) {
        return { media: state.media };
      }
      const laneId = source.laneId ?? "Media-0";

      const updatedMediaElements = state.media.mediaElement.map((element) =>
        element.type === mediaType && (element.laneId ?? "Media-0") === laneId ? { ...element, ...updates } : element
      );

      return {
        media: { ...state.media, mediaElement: updatedMediaElements },
      };
    }),

  updateMultipleMediaElements: (updates: Array<{ id: string; updates: Partial<MediaElement> }>) =>
    set((state) => {
      const updatedMediaElements = state.media.mediaElement.map((element) => {
        const update = updates.find((u) => u.id === element.id);
        return update ? { ...element, ...update.updates } : element;
      });

      // recalculate projectDuration after update
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...updatedMediaElements.map((element) => element.endTime),
        ...state.media.audioElement.map((element) => element.endTime),
      ];

      const newProjectDuration = allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          mediaElement: updatedMediaElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  splitMediaElement: (mediaElementId: string, splitTime: number) =>
    set((state) => {
      const elementIndex = state.media.mediaElement.findIndex((el) => el.id === mediaElementId);
      if (elementIndex === -1) {
        return { media: state.media };
      }
      const originalMediaElement = state.media.mediaElement[elementIndex];
      const originalStartTime = originalMediaElement.startTime;
      const originalEndTime = originalMediaElement.endTime;
      const splitTimeRounded = roundTime(splitTime);
      if (splitTimeRounded <= originalStartTime || splitTimeRounded >= originalEndTime) {
        return { media: state.media };
      }

      const leftMediaElement: MediaElement = {
        ...originalMediaElement,
        endTime: splitTimeRounded,
        duration: roundTime(splitTimeRounded - originalStartTime),
      };

      const rightMediaElement: MediaElement = {
        ...originalMediaElement,
        id: crypto.randomUUID(),
        startTime: splitTimeRounded,
        duration: roundTime(originalEndTime - splitTimeRounded),
      };

      const updatedMediaElements = state.media.mediaElement.slice();
      updatedMediaElements[elementIndex] = leftMediaElement;
      updatedMediaElements.splice(elementIndex + 1, 0, rightMediaElement);

      const allTrackEndTimes = [
        ...updatedMediaElements.map((el) => el.endTime),
        ...state.media.textElement.map((el) => el.endTime),
        ...state.media.audioElement.map((el) => el.endTime),
      ];
      const newProjectDuration = allTrackEndTimes.length > 0 ? Math.max(...allTrackEndTimes) : 0;

      return {
        media: {
          ...state.media,
          mediaElement: updatedMediaElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  cloneMediaElement: (mediaElementId: string) => {
    let createdId: string | null = null;
    set((state) => {
      const source = state.media.mediaElement.find((el) => el.id === mediaElementId);
      if (!source) {
        return { media: state.media };
      }

      const laneId = source.laneId ?? "Media-0";
      const inLane = state.media.mediaElement.filter((el) => (el.laneId ?? "Media-0") === laneId);
      const lastInLane = inLane[inLane.length - 1];

      const newId = crypto.randomUUID();
      const startTime = lastInLane ? lastInLane.endTime : 0;
      const endTime = startTime + source.duration;

      const cloned: MediaElement = { ...source, id: newId, startTime, endTime };

      const updatedMediaElements = [...state.media.mediaElement, cloned];
      const newProjectDuration = Math.max(state.media.projectDuration, cloned.endTime);

      createdId = newId;
      return {
        media: {
          ...state.media,
          mediaElement: updatedMediaElements,
          projectDuration: newProjectDuration,
        },
      };
    });
    return createdId;
  },

  addAudioElement: (audioElement: AudioElement) =>
    set((state) => {
      const all = state.media.audioElement;
      const laneId = audioElement.laneId ?? "Audio-0";
      const inLane = all.filter((el) => (el.laneId ?? "Audio-0") === laneId);

      let newAudioElement: AudioElement;
      if (inLane.length === 0) {
        newAudioElement = { ...audioElement, startTime: 0, endTime: audioElement.duration };
      } else {
        const lastInLane = inLane[inLane.length - 1];
        newAudioElement = {
          ...audioElement,
          startTime: lastInLane.endTime,
          endTime: lastInLane.endTime + audioElement.duration,
        };
      }

      const updatedAudioElements = [...all, newAudioElement];
      const newProjectDuration = Math.max(state.media.projectDuration, newAudioElement.endTime);

      return {
        media: {
          ...state.media,
          audioElement: updatedAudioElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  deleteAudioElement: (audioElementId: string) =>
    set((state) => {
      const updatedAudioElements = state.media.audioElement.filter((element) => element.id !== audioElementId);

      // recalculate projectDuration after deletion
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...state.media.mediaElement.map((element) => element.endTime),
        ...updatedAudioElements.map((element) => element.endTime),
      ];

      const newProjectDuration = allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          audioElement: updatedAudioElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  updateAudioElement: (audioElementId: string, updates: Partial<AudioElement>) =>
    set((state) => {
      const updatedAudioElements = state.media.audioElement.map((element) =>
        element.id === audioElementId ? { ...element, ...updates } : element
      );

      // recalculate projectDuration after update
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...state.media.mediaElement.map((element) => element.endTime),
        ...updatedAudioElements.map((element) => element.endTime),
      ];

      const newProjectDuration = allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          audioElement: updatedAudioElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  updateMultipleAudioElements: (updates: Array<{ id: string; updates: Partial<AudioElement> }>) =>
    set((state) => {
      const updatedAudioElements = state.media.audioElement.map((element) => {
        const update = updates.find((u) => u.id === element.id);
        return update ? { ...element, ...update.updates } : element;
      });

      // recalculate projectDuration after update
      const allEndTimes = [
        ...state.media.textElement.map((element) => element.endTime),
        ...state.media.mediaElement.map((element) => element.endTime),
        ...updatedAudioElements.map((element) => element.endTime),
      ];

      const newProjectDuration = allEndTimes.length > 0 ? Math.max(...allEndTimes) : 0;

      return {
        media: {
          ...state.media,
          audioElement: updatedAudioElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  splitAudioElement: (audioElementId: string, splitTime: number) =>
    set((state) => {
      const elementIndex = state.media.audioElement.findIndex((el) => el.id === audioElementId);
      if (elementIndex === -1) {
        return { media: state.media };
      }
      const originalAudioElement = state.media.audioElement[elementIndex];
      const originalStartTime = originalAudioElement.startTime;
      const originalEndTime = originalAudioElement.endTime;
      const splitTimeRounded = roundTime(splitTime);
      if (splitTimeRounded <= originalStartTime || splitTimeRounded >= originalEndTime) {
        return { media: state.media };
      }

      const leftAudioElement: AudioElement = {
        ...originalAudioElement,
        endTime: splitTimeRounded,
        duration: roundTime(splitTimeRounded - originalStartTime),
      };

      const originalSourceStartOffsetSeconds = originalAudioElement.sourceStart ?? 0;
      const rightAudioElement: AudioElement = {
        ...originalAudioElement,
        id: crypto.randomUUID(),
        startTime: splitTimeRounded,
        duration: roundTime(originalEndTime - splitTimeRounded),
        sourceStart: roundTime(originalSourceStartOffsetSeconds + (splitTimeRounded - originalStartTime)),
      };

      const updatedAudioElements = state.media.audioElement.slice();
      updatedAudioElements[elementIndex] = leftAudioElement;
      updatedAudioElements.splice(elementIndex + 1, 0, rightAudioElement);

      const allTrackEndTimes = [
        ...state.media.mediaElement.map((el) => el.endTime),
        ...state.media.textElement.map((el) => el.endTime),
        ...updatedAudioElements.map((el) => el.endTime),
      ];
      const newProjectDuration = allTrackEndTimes.length > 0 ? Math.max(...allTrackEndTimes) : 0;

      return {
        media: {
          ...state.media,
          audioElement: updatedAudioElements,
          projectDuration: newProjectDuration,
        },
      };
    }),

  cloneAudioElement: (audioElementId: string) => {
    let createdId: string | null = null;
    set((state) => {
      const source = state.media.audioElement.find((el) => el.id === audioElementId);
      if (!source) {
        return { media: state.media };
      }

      const laneId = source.laneId ?? "Audio-0";
      const inLane = state.media.audioElement.filter((el) => (el.laneId ?? "Audio-0") === laneId);
      const lastInLane = inLane[inLane.length - 1];

      const newId = crypto.randomUUID();
      const startTime = lastInLane ? lastInLane.endTime : 0;
      const endTime = startTime + source.duration;

      const cloned: AudioElement = { ...source, id: newId, startTime, endTime };

      const updatedAudioElements = [...state.media.audioElement, cloned];
      const newProjectDuration = Math.max(state.media.projectDuration, cloned.endTime);

      createdId = newId;
      return {
        media: {
          ...state.media,
          audioElement: updatedAudioElements,
          projectDuration: newProjectDuration,
        },
      };
    });
    return createdId;
  },
}));

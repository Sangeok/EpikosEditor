import { create } from "zustand";
import {
  CreateVideoField,
  ImageDataType,
  videoScriptType,
  VideoStyleOptionsType,
  CreateVideoType,
} from "./types/index";
export const initialCreateVideoData: CreateVideoType = {
  title: "",
  topic: "",
  topicDetail: "",
  videoScript: [],
  videoCaption: "",
  imageData: [],
  language: "English",
  generateImage: {
    generateImageStyle: "",
    selectedVideoScript: null,
  },
  imageScript: [],
  ttsUrl: "",
  captions: "",
};

interface CreateVideoStore {
  initialCreateVideoData: CreateVideoType;
  setCreateVideoDataByField: (field: CreateVideoField, data: string | ImageDataType[] | any) => void;
  setGenerateImageDataByFied: (field1: string, data: VideoStyleOptionsType | videoScriptType) => void;
  setTts: (ttsUrl: string) => void;
  // 추가: 전체 세터/리셋
  setCreateVideoData: (data: CreateVideoType) => void;
  resetCreateVideoData: () => void;
}

const useCreateVideoStore = create<CreateVideoStore>((set) => ({
  initialCreateVideoData: initialCreateVideoData,

  setCreateVideoDataByField: (field: CreateVideoField, data: string | ImageDataType[] | string[]) =>
    set((state) => ({
      initialCreateVideoData: {
        ...state.initialCreateVideoData,
        [field]: data,
      },
    })),

  setGenerateImageDataByFied: (field: string, data: VideoStyleOptionsType | videoScriptType) =>
    set((state) => ({
      initialCreateVideoData: {
        ...state.initialCreateVideoData,
        generateImage: {
          ...state.initialCreateVideoData.generateImage,
          [field]: data,
        },
      },
    })),

  setTts: (ttsUrl: string) =>
    set((state) => ({
      initialCreateVideoData: {
        ...state.initialCreateVideoData,
        ttsUrl: ttsUrl,
      },
    })),

  // 전체 세터/리셋 구현
  setCreateVideoData: (data) => set({ initialCreateVideoData: data }),
  resetCreateVideoData: () => set({ initialCreateVideoData }),
}));

export default useCreateVideoStore;

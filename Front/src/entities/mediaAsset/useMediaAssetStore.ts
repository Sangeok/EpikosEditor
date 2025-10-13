import { create } from "zustand";
import { CreateVideoField, ImageDataType, videoScriptType, VideoStyleOptionsType } from "./types/index";

type CreateVideoType = {
  title: string;
  topic: string;
  topicDetail: string;
  videoScript: videoScriptType[];
  videoCaption: string;
  imageData: ImageDataType[];
  language: "English" | "Korean";
  generateImage: {
    generateImageStyle: VideoStyleOptionsType;
    generateImageScript: videoScriptType | null;
  };
  ttsUrl: string;
  captions: string;
};

const initialCreateVideoData: CreateVideoType = {
  title: "",
  topic: "",
  topicDetail: "",
  videoScript: [],
  videoCaption: "",
  imageData: [],
  language: "English",
  generateImage: {
    generateImageStyle: "",
    generateImageScript: null,
  },
  ttsUrl: "",
  captions: "",
};

interface CreateVideoStore {
  initialCreateVideoData: CreateVideoType;
  setCreateVideoDataByField: (field: CreateVideoField, data: string | ImageDataType[] | any) => void;
  setGenerateImageDataByFied: (field1: string, data: VideoStyleOptionsType | videoScriptType) => void;
  setTts: (ttsUrl: string) => void;
}

const useCreateVideoStore = create<CreateVideoStore>((set) => ({
  initialCreateVideoData: initialCreateVideoData,

  setCreateVideoDataByField: (field: CreateVideoField, data: string | ImageDataType[]) =>
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
}));

export default useCreateVideoStore;

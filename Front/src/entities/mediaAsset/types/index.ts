export type VideoStyleOptionsType = "Cartoon" | "Realistic" | "Cyberpunk" | "Cinematic" | "";

export type videoScriptType = {
  content: string;
  translatedContent: string;
};

export type ImageDataType = {
  imageId: number;
  url: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: string;
  isCreated: boolean;
};

export type ImageScriptType = {
  imagePrompt: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
  type?: string;
  sceneContent?: string;
};

// 전체 Create Media Asset 흐름에서 사용하는 상태 구조
export type CreateVideoType = {
  title: string;
  topic: string;
  topicDetail: string;
  videoScript: videoScriptType[];
  videoCaption: string;
  imageData: ImageDataType[];
  language: "English" | "Korean";
  generateImage: {
    generateImageStyle: VideoStyleOptionsType;
    selectedVideoScript: videoScriptType | null;
  };
  imageScript: ImageScriptType[];
  ttsUrl: string;
  captions: string;
  videoExplanation: string;
};

export type CreateVideoField =
  | "title"
  | "topic"
  | "videoScript"
  | "videoStyle"
  | "videoCaption"
  | "imageData"
  | "generateImageStyle"
  | "selectedVideoScript"
  | "ttsUrl"
  | "captions"
  | "language"
  | "cloudinaryTtsUrl"
  | "topicDetail"
  | "imageScript"
  | "videoExplanation"
  | "";

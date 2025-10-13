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
};

export type CreateVideoField =
  | "title"
  | "topic"
  | "videoScript"
  | "videoStyle"
  | "videoCaption"
  | "imageData"
  | "generateImageStyle"
  | "generateImageScript"
  | "ttsUrl"
  | "captions"
  | "language"
  | "cloudinaryTtsUrl"
  | "topicDetail"
  | "";

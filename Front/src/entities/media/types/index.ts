export interface TextElement {
  id: string;
  type: string;
  startTime: number;
  endTime: number;
  duration: number;
  laneId?: string;

  text: string;
  positionX: number;
  positionY: number;
  fontSize: number;
  animation: string;
  textColor: string;
  backgroundColor: string;
  font: string;
  width: number;
  height: number;

  maxWidth?: string;
  whiteSpace?: string;
  origin?: "create-init" | "user" | string;
}

export interface MediaElement {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: "video" | "image" | "audio";
  laneId?: string;

  url?: string;
  width?: number;
  height?: number;
  opacity?: number;
  rotate?: string;
  visibility?: "visible" | "hidden";
  top?: number | string;
  left?: number | string;

  // fade effects
  fadeIn?: boolean;
  fadeOut?: boolean;
  fadeInDuration?: number;
  fadeOutDuration?: number;

  // video only
  volume?: number;
  speed?: number;
  origin?: "create-init" | "user" | string;
}

export interface AudioElement {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: "audio";
  laneId?: string;

  url: string;
  volume: number;
  speed: number;
  // source trim offset in seconds (how much to skip from the start of the file)
  sourceStart?: number;
  origin?: "create-init" | "user" | string;
}

export type TrackElement = MediaElement | AudioElement | TextElement;

export type FadeEffectType = "fadeIn" | "fadeOut" | "none";

export type EffectType = FadeEffectType | "none";

export interface Media {
  projectDuration: number;
  fps: number;
  textElement: TextElement[];
  mediaElement: MediaElement[];
  audioElement: AudioElement[];
}

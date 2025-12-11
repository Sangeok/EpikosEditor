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

  // CSS text-shadow 값 (예: "0 0 6.5px rgba(8, 8, 8, 0.82)")
  textShadow?: string;
  fontStyle?: string;

  // 고급 스타일 옵션
  // 여러 줄 자막의 행간 (예: 1.3)
  lineHeight?: number;
  // 자막 가독성을 위한 폰트 두께 (예: 400, 500, 600, 700)
  fontWeight?: number;
  // 글자 간격(em 단위, 예: 0.02 → 0.02em)
  letterSpacing?: number;
  // 배경 박스 불투명도 (0~1, 기본적으로 0.7~1.0 추천)
  backgroundOpacity?: number;

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

  // zoom effects (anchor point is always center)
  zoom?: boolean;
  zoomDirection?: "Zoom In" | "Zoom Out";
  zoomDuration?: number;

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

export type ZoomEffectType = "Zoom In" | "Zoom Out" | "none";

export type EffectType = FadeEffectType | ZoomEffectType | "none";

export interface Media {
  projectDuration: number;
  fps: number;
  textElement: TextElement[];
  mediaElement: MediaElement[];
  audioElement: AudioElement[];
  isUsingMediaAsset: boolean;
}

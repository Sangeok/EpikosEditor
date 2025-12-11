export interface TextElement {
  id: string;
  type: string;
  startTime: number;
  endTime: number;
  duration: number;
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
}

export interface MediaElement {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: 'video' | 'image' | 'audio';
  url?: string;
  width?: number;
  height?: number;
  opacity?: number;
  rotate?: string;
  visibility?: 'visible' | 'hidden';
  top?: number | string;
  left?: number | string;
  fadeIn?: boolean;
  fadeOut?: boolean;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  volume?: number;
  speed?: number;

  zoom?: boolean;
  zoomDirection?: 'Zoom In' | 'Zoom Out';
  zoomDuration?: number;
}

export interface AudioElement {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: 'audio';
  url: string;
  volume: number;
  speed: number;
  // Optional trim offset in seconds to start playback from within the source file
  sourceStart?: number;
}

export interface VideoInputData extends Record<string, unknown> {
  project: {
    id: string;
    name: string;
  };
  media: {
    projectDuration: number;
    fps: number;
    textElement: TextElement[];
    mediaElement: MediaElement[];
    audioElement: AudioElement[];
  };
}

export interface VideoEditorProps {
  project: {
    id: string;
    name: string;
  };
  media: {
    projectDuration: number;
    fps: number;
    textElement: TextElement[];
    mediaElement: MediaElement[];
    audioElement: AudioElement[];
  };
}

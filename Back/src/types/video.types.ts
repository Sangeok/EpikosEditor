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

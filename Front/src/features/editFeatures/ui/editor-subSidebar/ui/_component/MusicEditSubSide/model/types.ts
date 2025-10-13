export interface UploadedAudio {
  url: string;
  name: string;
}

export interface AudioEditState {
  uploadedAudios: UploadedAudio[];
  dragActive: boolean;
  loading: boolean;
  previewAudio: HTMLAudioElement | null;
  playingIndex: number | null;
}

export interface AudioEditActions {
  handleFileSelect: (files: FileList | null) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  togglePreview: (audioUrl: string, index: number) => void;
  removeAudio: (index: number) => void;
  addAudioToTimeLine: (audio: UploadedAudio) => void;
}

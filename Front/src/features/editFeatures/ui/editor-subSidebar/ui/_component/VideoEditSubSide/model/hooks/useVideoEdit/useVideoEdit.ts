import { useDragAndDrop } from "../../../../../../model/hooks";
import { useFileUpload } from "./_internal/useFileUpload";
import { useAddVideoToTimeline } from "./_internal/useAddVideoToTimeline";

export function useVideoEdit() {
  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const videoTimeline = useAddVideoToTimeline();

  const handleFileSelect = (files: FileList | null) => {
    fileUpload.handleFileSelect(files, videoTimeline.addVideoToTimeline);
  };

  const handleDrop = (e: React.DragEvent) => {
    dragAndDrop.handleDrop(e, (files) => {
      fileUpload.handleFileSelect(files, videoTimeline.addVideoToTimeline);
    });
  };

  return {
    fileInputRef: fileUpload.fileInputRef,
    state: {
      uploadedVideos: fileUpload.videos,
      dragActive: dragAndDrop.dragActive,
    },
    actions: {
      handleFileSelect,
      handleDrag: dragAndDrop.handleDrag,
      handleDrop,
      removeVideo: fileUpload.removeVideo,
      addVideoToTimeline: videoTimeline.addVideoToTimeline,
    },
  };
}

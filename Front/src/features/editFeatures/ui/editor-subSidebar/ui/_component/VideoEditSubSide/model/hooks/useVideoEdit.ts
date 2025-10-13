import { useFileUpload } from "./useFileUpload";
import { useDragAndDrop } from "../../../../../model/hooks";
import { useVideoProjectManagement } from "./useVideoProjectManagement";

export function useVideoEdit() {
  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const projectManagement = useVideoProjectManagement();

  const handleFileSelect = (files: FileList | null) => {
    fileUpload.handleFileSelect(files, projectManagement.addVideoToTimeLine);
  };

  const handleDrop = (e: React.DragEvent) => {
    dragAndDrop.handleDrop(e, (files) => {
      fileUpload.handleFileSelect(files, projectManagement.addVideoToTimeLine);
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
      addVideoToTimeLine: projectManagement.addVideoToTimeLine,
    },
  };
}

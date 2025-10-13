import { useFileUpload } from "./useFileUpload";
import { useDragAndDrop } from "../../../../../model/hooks";
import { useImageProjectManagement } from "./useImageProjectManagement";

export function useImageEdit() {
  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const projectManagement = useImageProjectManagement();

  const handleFileSelect = (files: FileList | null) => {
    fileUpload.handleFileSelect(files, projectManagement.addImageToTimeLine);
  };

  const handleDrop = (e: React.DragEvent) => {
    dragAndDrop.handleDrop(e, (files) => {
      fileUpload.handleFileSelect(files, projectManagement.addImageToTimeLine);
    });
  };

  return {
    fileInputRef: fileUpload.fileInputRef,
    state: {
      uploadedImages: fileUpload.images,
      dragActive: dragAndDrop.dragActive,
    },
    actions: {
      handleFileSelect,
      addImageToTimeLine: projectManagement.addImageToTimeLine,
      handleDrag: dragAndDrop.handleDrag,
      handleDrop,
      removeImage: fileUpload.removeImage,
    },
  };
}

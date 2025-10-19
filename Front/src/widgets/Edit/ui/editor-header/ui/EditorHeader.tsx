"use client";

import { useProjectStore } from "@/entities/project/useProjectStore";
import { useMediaStore } from "@/entities/media/useMediaStore";
import ExportProgressModal from "@/features/exportProgress/ui/ExportProgressModal";
import VideoInfoModal from "@/features/videoInfo/ui";
import { useVideoExport } from "../model/hooks/useVideoExport";
import { useEditorModals } from "../model/hooks/useEditorModals";
import { HeaderLeftButtons } from "./_components/HeaderLeftButtons";
import { HeaderRightButtons } from "./_components/HeaderRightButtons";

export default function EditorHeader() {
  const { project } = useProjectStore();
  const { media } = useMediaStore();

  const videoExport = useVideoExport();
  const modals = useEditorModals();

  const handleExport = async () => {
    try {
      modals.openExportModal();
      await videoExport.startExport();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Video export failed");
      modals.closeExportModal();
    }
  };

  const handleExportModalClose = () => {
    modals.closeExportModal();

    const shouldResetExport = videoExport.isCompleted || videoExport.hasError;
    if (shouldResetExport) {
      videoExport.resetExport();
    }
  };

  return (
    <header className="col-span-2 bg-black border-b border-white/20 px-4 py-3">
      <div className="flex items-center justify-between">
        <HeaderLeftButtons />

        <span className="text-white text-sm mr-4">{project.id ? project.name : "Loading..."}</span>

        <HeaderRightButtons
          showVideoInfo={media.isUsingMediaAsset}
          onExportClick={handleExport}
          isExporting={videoExport.isExporting}
          openVideoInfoModal={modals.openVideoInfoModal}
        />
      </div>

      <ExportProgressModal
        open={modals.exportModalOpen}
        onClose={handleExportModalClose}
        progress={videoExport.progress}
        status={videoExport.status}
        error={videoExport.error}
        outputPath={videoExport.outputPath}
        filename={videoExport.filename}
        downloadUrl={videoExport.downloadUrl}
        cancel={videoExport.cancelExport}
      />

      <VideoInfoModal open={modals.videoInfoModalOpen} onClose={modals.closeVideoInfoModal} />
    </header>
  );
}

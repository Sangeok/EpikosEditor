"use client";

import { useCallback, useRef } from "react";
import { useProjectStore } from "@/entities/project/useProjectStore";
import { useMediaStore } from "@/entities/media/useMediaStore";
import ExportProgressModal from "@/features/exportProgress/ui/ExportProgressModal";
import VideoInfoModal from "@/features/videoInfo/ui";
import { useVideoExport } from "../model/hooks/useVideoExport";
import { useEditorModals } from "../model/hooks/useEditorModals";
import { HeaderLeftButtons } from "./_components/HeaderLeftButtons";
import { HeaderRightButtons } from "./_components/HeaderRightButtons";

export default function EditorHeader() {
  const projectName = useProjectStore((s) => s.project.name);
  const showVideoInfo = useMediaStore((s) => s.media.isUsingMediaAsset);

  const videoExport = useVideoExport();
  const modals = useEditorModals();

  const isStartingRef = useRef(false);

  const handleExport = useCallback(async () => {
    if (isStartingRef.current || videoExport.isExporting) return;
    isStartingRef.current = true;
    try {
      modals.openExportModal();
      await videoExport.startExport();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Video export failed");
      modals.closeExportModal();
    } finally {
      isStartingRef.current = false;
    }
  }, [modals, videoExport]);

  const handleExportModalClose = useCallback(() => {
    modals.closeExportModal();
    if (videoExport.isCompleted || videoExport.hasError) {
      videoExport.resetExport();
    }
  }, [modals, videoExport]);

  return (
    <header className="col-span-2 bg-black border-b border-white/20 px-4 py-3">
      <div className="flex items-center justify-between">
        <HeaderLeftButtons />

        <span className="text-white text-sm mr-4">{projectName}</span>

        <HeaderRightButtons
          showVideoInfo={showVideoInfo}
          onExportClick={handleExport}
          isExporting={videoExport.isExporting}
          openVideoInfoModal={modals.openVideoInfoModal}
        />
      </div>

      {modals.exportModalOpen && (
        <ExportProgressModal
          open={modals.exportModalOpen}
          onClose={handleExportModalClose}
          progress={videoExport.progress}
          status={videoExport.status}
          error={videoExport.error}
          downloadUrl={videoExport.downloadUrl}
          cancel={videoExport.cancelExport}
        />
      )}

      {showVideoInfo && <VideoInfoModal open={modals.videoInfoModalOpen} onClose={modals.closeVideoInfoModal} />}
    </header>
  );
}

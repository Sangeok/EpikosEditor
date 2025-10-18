/**
 * useEditorModals Hook
 * Manages modal state for editor header (export progress and video info)
 */

import { useState, useCallback } from "react";

export function useEditorModals() {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [videoInfoModalOpen, setVideoInfoModalOpen] = useState(false);

  const openExportModal = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const closeExportModal = useCallback(() => {
    setExportModalOpen(false);
  }, []);

  const openVideoInfoModal = useCallback(() => {
    setVideoInfoModalOpen(true);
  }, []);

  const closeVideoInfoModal = useCallback(() => {
    setVideoInfoModalOpen(false);
  }, []);

  return {
    // Export modal state
    exportModalOpen,
    openExportModal,
    closeExportModal,

    // Video info modal state
    videoInfoModalOpen,
    openVideoInfoModal,
    closeVideoInfoModal,
  };
}

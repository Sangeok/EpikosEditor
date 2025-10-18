"use client";

import { Download, Info, Save } from "lucide-react";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import { useState } from "react";
import { ProjectPersistenceService } from "@/shared/lib/projectPersistence";
import { useEditorModals } from "../../model/hooks/useEditorModals";

interface HeaderRightButtonsProps {
  showVideoInfo: boolean;
  onExportClick: () => void;
  isExporting: boolean;
  openVideoInfoModal: () => void;
}

export function HeaderRightButtons({
  showVideoInfo,
  onExportClick,
  isExporting,
  openVideoInfoModal,
}: HeaderRightButtonsProps) {
  const modals = useEditorModals();

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleQuickSave = async () => {
    setIsSaving(true);
    try {
      await ProjectPersistenceService.saveCurrentProject();
      // TODO: add toast notification here
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showVideoInfo && (
        <Button variant="dark" onClick={openVideoInfoModal}>
          <div className="flex items-center gap-2">
            <Info size={16} />
            Info
          </div>
        </Button>
      )}

      <Button variant="dark" onClick={handleQuickSave} disabled={isSaving}>
        <div className="flex items-center gap-2">
          <Save size={16} />
          Save
        </div>
      </Button>

      <Button variant="dark" onClick={onExportClick} disabled={isExporting}>
        <div className="flex items-center gap-2">
          <Download size={16} />
          {isExporting ? "Exporting..." : "Export"}
        </div>
      </Button>
    </div>
  );
}

import Button from "@/shared/ui/atoms/Button/ui/Button";
import { MousePointer2, Plus } from "lucide-react";

interface NotSelectModeButtonsProps {
  setShowSelectMode: (show: boolean) => void;
  setShowProjectManager: (show: boolean) => void;
}

export default function NotSelectModeButtons({
  setShowSelectMode,
  setShowProjectManager,
}: NotSelectModeButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => setShowSelectMode(true)}
        variant="light"
        className="flex items-center gap-2"
      >
        <MousePointer2 size={16} /> Select
      </Button>
      <Button
        onClick={() => setShowProjectManager(true)}
        variant="light"
        className="flex items-center gap-2"
      >
        <Plus size={16} /> New Project
      </Button>
    </div>
  );
}

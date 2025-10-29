import Button from "@/shared/ui/atoms/Button/ui/Button";
import { ExportStatus } from "../../model/type";

interface ActionButtonsProps {
  status: ExportStatus;
  downloadUrl: string | null;
  onClose: () => void;
  onCancel: () => void;
}

export default function ActionButtons({ status, downloadUrl, onClose, onCancel }: ActionButtonsProps) {
  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  };

  if (status === "completed") {
    return (
      <div className="flex w-full justify-between">
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownload} disabled={!downloadUrl}>
          Download
        </Button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex w-full justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  if (status === "exporting") {
    return (
      <div className="flex justify-between w-full">
        <Button onClick={onClose}>Continue in background</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    );
  }

  return null;
}

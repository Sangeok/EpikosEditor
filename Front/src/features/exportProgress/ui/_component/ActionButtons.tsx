import Button from "@/shared/ui/atoms/Button/ui/Button";
import { MESSAGES } from "../../constants";
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
        <Button onClick={onClose}>{MESSAGES.BUTTON_CLOSE}</Button>
        <Button onClick={handleDownload} disabled={!downloadUrl}>
          {MESSAGES.BUTTON_DOWNLOAD}
        </Button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex w-full justify-end">
        <Button onClick={onClose}>{MESSAGES.BUTTON_CLOSE}</Button>
      </div>
    );
  }

  if (status === "exporting") {
    return (
      <div className="flex justify-between w-full">
        <Button onClick={onClose}>{MESSAGES.BUTTON_BACKGROUND}</Button>
        <Button onClick={onCancel}>{MESSAGES.BUTTON_CANCEL}</Button>
      </div>
    );
  }

  return null;
}

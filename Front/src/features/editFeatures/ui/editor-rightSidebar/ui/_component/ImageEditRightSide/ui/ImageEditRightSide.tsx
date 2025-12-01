import { useMediaStore } from "@/entities/media/useMediaStore";
import { MediaElement } from "@/entities/media/types";
import { ImageEffectMenuItems } from "../constants";
import { useImageEffects } from "../model/hooks/useImageEffects";
import EffectDropdown from "./_component/EffectDropdown/ui/EffectDropdown";

interface ImageEditRightSideProps {
  selectedTrackId: string | null;
}

export default function ImageEditRightSide({ selectedTrackId }: ImageEditRightSideProps) {
  const imageElement = useMediaStore((state) =>
    state.media.mediaElement.find((element) => element.id === selectedTrackId)
  ) as MediaElement;

  const {
    handleInEffectChange,
    handleOutEffectChange,
    handleFadeDurationChange,
    handleZoomEffectChange,
    handleZoomDurationChange,
  } = useImageEffects();

  if (!imageElement || imageElement.type !== "image") {
    return <div>No image selected</div>;
  }

  // Zoom 효과 이름 결정 (방향에 따라)
  const zoomEffectName =
    imageElement.zoomDirection === "Zoom In"
      ? "Zoom In"
      : imageElement.zoomDirection === "Zoom Out"
      ? "Zoom Out"
      : "None";

  return (
    <div className="p-4 w-full space-y-4">
      <h3 className="text-lg font-semibold text-white">Image Effects</h3>
      <EffectDropdown
        label="In"
        isActive={imageElement.fadeIn || false}
        effectName="Fade In"
        duration={imageElement.fadeInDuration}
        dropdownItems={ImageEffectMenuItems.ImageIn}
        onEffectChange={handleInEffectChange}
        onDurationChange={(value) => handleFadeDurationChange(value, "fadeInDuration")}
      />
      <EffectDropdown
        label="Out"
        isActive={imageElement.fadeOut || false}
        effectName="Fade Out"
        duration={imageElement.fadeOutDuration}
        dropdownItems={ImageEffectMenuItems.ImageOut}
        onEffectChange={handleOutEffectChange}
        onDurationChange={(value) => handleFadeDurationChange(value, "fadeOutDuration")}
      />

      {/* Zoom Effect Section */}
      <EffectDropdown
        label="Zoom"
        isActive={imageElement.zoom || false}
        effectName={zoomEffectName}
        duration={imageElement.zoomDuration}
        dropdownItems={ImageEffectMenuItems.Zoom}
        onEffectChange={handleZoomEffectChange}
        onDurationChange={handleZoomDurationChange}
      />
    </div>
  );
}

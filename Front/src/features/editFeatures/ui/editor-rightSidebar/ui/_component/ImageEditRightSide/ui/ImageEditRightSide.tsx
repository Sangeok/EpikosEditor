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

  const { handleInEffectChange, handleOutEffectChange, handleFadeDurationChange } = useImageEffects();

  if (!imageElement || imageElement.type !== "image") {
    return <div>No image selected</div>;
  }

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
    </div>
  );
}

"use client";

import { TextElement } from "@/entities/media/types";
import { SequenceItem } from "./_component/SequenceItem/ui/SequenceItem";
import { useMediaStore } from "@/entities/media/useMediaStore";
import HorizonSmartGuide from "./_component/HorizonSmartGuide/ui";
import { useSmartGuideStore } from "../../../../model/hooks/useSmartGuideStore";
import VerticalSmartGuide from "./_component/VerticalSmartGuide/ui";
import BaseSmartGuide from "./_component/BaseSmartGuide/ui";

export default function Composition() {
  const media = useMediaStore((state) => state.media);
  const fps = media.fps;

  const isDraggingText = useSmartGuideStore((state) => state.isDraggingText);
  const showVerticalSmartGuide = useSmartGuideStore((state) => state.showVerticalSmartGuide);
  const showHorizonSmartGuide = useSmartGuideStore((state) => state.showHorizonSmartGuide);
  const showBaseSmartGuide = isDraggingText && !showVerticalSmartGuide && !showHorizonSmartGuide;

  console.log("media.mediaElement!!!!", media.mediaElement);

  return (
    <div id="composition-container" className="relative w-full h-full">
      {media.textElement.map((textElement) => {
        if (!textElement) return null;
        const trackItem = { ...textElement } as TextElement;
        return SequenceItem["text"](trackItem, { fps });
      })}
      {media.mediaElement.map((mediaElement) => {
        if (!mediaElement) return null;
        return SequenceItem[mediaElement.type](mediaElement, { fps });
      })}
      {media.audioElement.map((audioElement) => {
        if (!audioElement) return null;
        return SequenceItem["audio"](audioElement, { fps });
      })}
      {showBaseSmartGuide && <BaseSmartGuide />}
      {showHorizonSmartGuide && <HorizonSmartGuide />}
      {showVerticalSmartGuide && <VerticalSmartGuide />}
    </div>
  );
}

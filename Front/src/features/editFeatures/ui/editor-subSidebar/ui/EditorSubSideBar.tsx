"use client";

import useSideButtonStore from "@/features/editFeatures/model/store/useSideButtonStore";
import TextEditSubSide from "./_component/TextEditSubSide/ui/TextEditSubSide";
import VideoEditSubSide from "./_component/VideoEditSubSide/ui/index";
import MusicEditSubSide from "./_component/MusicEditSubSide/ui/MusicEditSubSide";
import ImageEditSubSide from "./_component/ImageEditSubSide/ui/index";
import CaptionEditSubSide from "./_component/CaptionEditSubSide/ui/CaptionEditSubSide";

export default function EditorSubSideBar() {
  const activeSideButton = useSideButtonStore((state) => state.activeSideButton);

  const renderSubSideBar = () => {
    switch (activeSideButton) {
      case "Text":
        return <TextEditSubSide />;
      case "Video":
        return <VideoEditSubSide />;
      case "Captions":
        return <CaptionEditSubSide />;
      case "Image":
        return <ImageEditSubSide />;
      case "Music":
        return <MusicEditSubSide />;
      default:
        return null;
    }
  };

  return (
    <aside className="w-80 h-full bg-black border-r border-white/20 overflow-y-auto">
      <div className="flex flex-col h-full w-full items-center p-4">{renderSubSideBar()}</div>
    </aside>
  );
}

"use client";

import TextEditRightSide from "./_component/TextEditRightSide/ui/TextEditRightSide";
import VideoEditRightSide from "./_component/VideoEditRightSide";
import ImageEditRightSide from "./_component/ImageEditRightSide/ui/ImageEditRightSide";
import { useSelectedTrackStore } from "../../../model/store/useSelectedTrackStore";
import AudioEditRightSide from "./_component/AudioEditRightSide";

export default function EditorRightSidebar() {
  const selectedTrack = useSelectedTrackStore((state) => state.selectedTrack);
  const selectedTrackId = useSelectedTrackStore((state) => state.selectedTrackId);

  const renderSubSideBar = () => {
    switch (selectedTrack) {
      case "Text":
        return <TextEditRightSide selectedTrackId={selectedTrackId} />;
      case "Video":
        return <VideoEditRightSide />;
      case "Audio":
        return <AudioEditRightSide selectedTrackId={selectedTrackId} />;
      case "Image":
        return <ImageEditRightSide selectedTrackId={selectedTrackId} />;
      default:
        return null;
    }
  };
  return (
    <aside className="w-50 h-full bg-black border-l border-white/20 overflow-y-auto">
      <div className="flex flex-col h-full items-center p-2">{renderSubSideBar()}</div>
    </aside>
  );
}

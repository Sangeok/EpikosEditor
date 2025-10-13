import Timeline from "@/features/editFeatures/ui/editor-footer/ui/TImeline/Timeline";
import TimelineToolBar from "@/features/editFeatures/ui/editor-footer/ui/TimelineToolBar/TimelineToolBar";
import TrackPannel from "@/features/editFeatures/ui/editor-footer/ui/TrackPannel/TrackPannel";

export default function EditorFooter() {
  return (
    <footer className="bg-black border-t border-white/20 h-full flex flex-col">
      <TimelineToolBar />
      <div className="flex flex-1 min-h-0">
        <TrackPannel />
        <Timeline />
      </div>
    </footer>
  );
}

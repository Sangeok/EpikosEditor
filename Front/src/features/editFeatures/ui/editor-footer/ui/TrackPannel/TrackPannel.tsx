import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import { Music, Type, Video } from "lucide-react";

const TrackPannelItems = [
  {
    icon: <Type size={15} />,
    label: "Text",
  },
  {
    icon: <Video size={15} />,
    label: "Video",
  },
  {
    icon: <Music size={15} />,
    label: "Music",
  },
] as const;

export default function TrackPannel() {
  return (
    <div className="w-12 border-r border-white/20 bg-black">
      {/* Div with same height as TimelineRuler */}
      <div className="h-8" />
      <div className="flex-1">
        <div className="flex flex-col h-full">
          {TrackPannelItems.map((item, index) => (
            <div key={item.label + index} className="flex-1">
              <IconButton className="h-12 pt-3 pl-3">{item.icon}</IconButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

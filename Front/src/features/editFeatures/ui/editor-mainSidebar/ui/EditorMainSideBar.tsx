"use client";

import { Captions, Image as ImageIcon, Music, Type, Video } from "lucide-react";
import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import Tooltip from "@/shared/ui/atoms/Tooltip/ui/Tooltip";
import useSideButtonStore, {
  ActiveSideButtonType,
} from "@/features/editFeatures/model/store/useSideButtonStore";

const SideBarItems = [
  {
    icon: <Type size={15} />,
    label: "Text",
  },
  {
    icon: <Video size={15} />,
    label: "Video",
  },
  {
    icon: <Captions size={15} />,
    label: "Captions",
  },
  {
    icon: <ImageIcon size={15} />,
    label: "Image",
  },
  {
    icon: <Music size={15} />,
    label: "Music",
  },
] as const;

export default function EditorSideBar() {
  const setActiveSideButton = useSideButtonStore(
    (state) => state.setActiveSideButton
  );

  return (
    <aside className="w-12 h-full bg-black border-r border-white/20 overflow-y-auto">
      <div className="p-4">
        <div className="flex flex-col h-full w-full items-center justify-center gap-8">
          {SideBarItems.map((item) => (
            <Tooltip
              key={item.label}
              content={item.label}
              position="right"
              size="sm"
              theme="dark"
            >
              <IconButton
                onClick={() => {
                  // TODO: 개선 필요
                  setActiveSideButton(item.label as ActiveSideButtonType);
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </div>
      </div>
    </aside>
  );
}

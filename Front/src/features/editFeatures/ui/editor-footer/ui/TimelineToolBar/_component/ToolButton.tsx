"use client";

import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import { Copy, Music, Plus, Split, Trash, Type, Video } from "lucide-react";
import { useSelectedTrackStore } from "@/features/editFeatures/model/store/useSelectedTrackStore";
import useTimelineStore from "@/features/editFeatures/model/store/useTimelineStore";
import { useMediaStore } from "@/entities/media/useMediaStore";
import Dropdown from "@/shared/ui/atoms/Dropdown/ui/Dropdown";
import { useState } from "react";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export default function ToolButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const addTextLane = useTrackLaneStore((s) => s.addTextLane);
  const addMediaLane = useTrackLaneStore((s) => s.addMediaLane);
  const addAudioLane = useTrackLaneStore((s) => s.addAudioLane);
  const setActiveLane = useTrackLaneStore((s) => s.setActiveLane);

  const selectedTrack = useSelectedTrackStore((s) => s.selectedTrack);
  const selectedTrackId: string | null = useSelectedTrackStore((s) => s.selectedTrackId);
  const setSelectedTrackAndId = useSelectedTrackStore((s) => s.setSelectedTrackAndId);
  const currentTime = useTimelineStore((s) => s.currentTime);

  const {
    splitTextElement,
    splitMediaElement,
    splitAudioElement,
    deleteTextElement,
    deleteMediaElement,
    deleteAudioElement,
    cloneTextElement,
    cloneMediaElement,
    cloneAudioElement,
  } = useMediaStore();

  const handleSplit = () => {
    if (!selectedTrackId || !selectedTrack) {
      alert("Please select an element to split in timeline");
      return;
    }

    switch (selectedTrack) {
      case "Text":
        splitTextElement(selectedTrackId, currentTime);
        break;
      case "Video":
      case "Image":
        splitMediaElement(selectedTrackId, currentTime);
        break;
      case "Audio":
        splitAudioElement(selectedTrackId, currentTime);
        break;
      default:
        break;
    }
  };

  const handleDelete = () => {
    if (!selectedTrackId || !selectedTrack || selectedTrackId === null) {
      alert("Please select an element to delete in timeline");
    }

    switch (selectedTrack) {
      case "Text":
        deleteTextElement(selectedTrackId as string);
        break;
      case "Video":
        deleteMediaElement(selectedTrackId as string);
        break;
      case "Audio":
        deleteAudioElement(selectedTrackId as string);
        break;
    }
  };

  const handleClone = () => {
    if (!selectedTrackId || !selectedTrack) {
      alert("Please select an element to clone in timeline");
      return;
    }

    let newId: string | null = null;
    switch (selectedTrack) {
      case "Text":
        newId = cloneTextElement(selectedTrackId);
        break;
      case "Video":
      case "Image":
        newId = cloneMediaElement(selectedTrackId);
        break;
      case "Audio":
        newId = cloneAudioElement(selectedTrackId);
        break;
      default:
        break;
    }

    if (newId) {
      setSelectedTrackAndId(selectedTrack, newId);
    }
  };

  const FooterItems = [
    {
      label: "Delete",
      icon: <Trash size={15} />,
      onClick: () => {
        handleDelete();
      },
      isActive: false,
      isDropdown: false,
    },
    {
      label: "Split",
      icon: <Split size={15} />,
      onClick: () => {
        handleSplit();
      },
      isActive: false,
      isDropdown: false,
    },
    {
      label: "Clone",
      icon: <Copy size={15} />,
      onClick: () => {
        handleClone();
      },
      isActive: false,
      isDropdown: false,
    },
    {
      label: "Add",
      icon: <Plus size={15} />,
      onClick: () => {
        setIsDropdownOpen(!isDropdownOpen);
      },
      isActive: false,
      isDropdown: true,
      dropdownItems: [
        { label: "Add Text Track", icon: <Type size={15} /> },
        { label: "Add Media Track", icon: <Video size={15} /> },
        { label: "Add Audio Track", icon: <Music size={15} /> },
      ],
    },
  ] as const;

  return (
    <div className="flex items-center gap-2">
      {FooterItems.map((item) => (
        <IconButton key={item.label} onClick={item.onClick} isActive={item.isActive}>
          <div className="flex items-center gap-2">
            {item.icon}
            <span className="text-xs text-gray-400 pt-1">{item.label}</span>
            {item.isDropdown && (
              <Dropdown
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                dropdownItems={item.dropdownItems || []}
                handleSelectEvent={(label) => {
                  if (label === "Add Text Track") {
                    const id = addTextLane();
                    setActiveLane("Text", id);
                  } else if (label === "Add Media Track") {
                    const id = addMediaLane();
                    setActiveLane("Media", id);
                  } else if (label === "Add Audio Track") {
                    const id = addAudioLane();
                    setActiveLane("Audio", id);
                  }
                }}
              />
            )}
          </div>
        </IconButton>
      ))}
    </div>
  );
}

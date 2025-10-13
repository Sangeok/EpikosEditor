import { useMediaStore } from "@/entities/media/useMediaStore";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import TextArea from "@/shared/ui/atoms/TextArea/ui/TextArea";
import { useState } from "react";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";
import LaneSelector from "../../SelectTextTrack";

export default function TextEditSubSide() {
  const [text, setText] = useState<string>("");
  const { addTextElement } = useMediaStore();

  const textLanes = useTrackLaneStore((s) => s.textLanes);
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);

  const setActiveLane = useTrackLaneStore((s) => s.setActiveLane);
  const addTextLane = useTrackLaneStore((s) => s.addTextLane);

  const handleAddText = () => {
    const laneId = activeLaneByType.Text ?? textLanes[0] ?? "Text-0";
    const newText = {
      id: crypto.randomUUID(),
      type: "text",
      startTime: 0,
      endTime: 5,
      duration: 5,
      laneId,

      text: text || "No Text",
      positionX: 425,
      positionY: 500,
      fontSize: 120,
      textColor: "#ffffff",
      backgroundColor: "bg-transparent",
      font: "Arial",
      width: 300,
      height: 300,
      animation: "none",
    };
    addTextElement(newText);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h1>Text</h1>
      {/* Lane selector */}
      <LaneSelector
        title="Text"
        addLane={addTextLane}
        activeLaneByType={activeLaneByType}
        setActiveLane={setActiveLane}
        lanes={textLanes}
      />
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={handleAddText}>Add Text</Button>
    </div>
  );
}

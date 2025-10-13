import { LaneKind } from "@/features/editFeatures/model/store/useTrackLaneStore";

interface LaneSelectorProps {
  title: LaneKind;
  activeLaneByType: { [key in LaneKind]: string };
  addLane: () => string;
  setActiveLane: (kind: LaneKind, laneId: string) => void;
  lanes: string[];
}

export default function LaneSelector({ title, addLane, activeLaneByType, setActiveLane, lanes }: LaneSelectorProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <label className="text-xs text-gray-400">{title} Track:</label>
      <select
        className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white"
        value={activeLaneByType[title]}
        onChange={(e) => setActiveLane(title, e.target.value)}
      >
        {lanes.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      <button
        className="px-2 py-1 text-xs border border-zinc-700 rounded text-white hover:bg-zinc-800"
        onClick={() => {
          const id = addLane();
          setActiveLane(title as LaneKind, id);
        }}
      >
        + New Lane
      </button>
    </div>
  );
}

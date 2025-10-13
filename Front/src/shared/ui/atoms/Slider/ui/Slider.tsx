import { ZoomIn, ZoomOut } from "lucide-react";
import IconButton from "../../Button/ui/IconButton";

export default function Slider() {
  return (
    <div className="relative flex-1 mx-4 flex items-center gap-2">
      <IconButton>
        <ZoomOut size={15} />
      </IconButton>
      <input
        type="range"
        min="0"
        max="100"
        className="slider w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none"
        style={{ width: "100px" }}
      />
      <IconButton>
        <ZoomIn size={15} />
      </IconButton>
    </div>
  );
}

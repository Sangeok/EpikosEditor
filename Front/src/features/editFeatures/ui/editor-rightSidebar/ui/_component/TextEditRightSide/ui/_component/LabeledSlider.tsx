import Slider from "@/shared/ui/atoms/Slider/ui/Slider";

type LabeledSliderProps = {
  label: string;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

export default function LabeledSlider({
  label,
  displayValue,
  min,
  max,
  step,
  value,
  onChange,
  className,
}: LabeledSliderProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/80">{label}</span>
        <span className="text-sm tabular-nums text-white/80">{displayValue}</span>
      </div>
      <Slider min={min} max={max} step={step} value={value} onChange={onChange} />
    </div>
  );
}

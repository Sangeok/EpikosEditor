type SliderProps = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

export default function Slider({ min, max, step = 1, value, onChange, className = "" }: SliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={
        `w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer
         [&::-webkit-slider-thumb]:appearance-none 
         [&::-webkit-slider-thumb]:w-3 
         [&::-webkit-slider-thumb]:h-3 
         [&::-webkit-slider-thumb]:rounded-full 
         [&::-webkit-slider-thumb]:bg-white 
         [&::-webkit-slider-thumb]:cursor-pointer
         [&::-moz-range-thumb]:w-3 
         [&::-moz-range-thumb]:h-3 
         [&::-moz-range-thumb]:rounded-full 
         [&::-moz-range-thumb]:bg-white 
         [&::-moz-range-thumb]:cursor-pointer
         [&::-moz-range-thumb]:border-none ` + className
      }
    />
  );
}

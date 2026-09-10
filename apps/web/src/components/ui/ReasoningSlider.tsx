"use client";

interface ReasoningSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  valueLabel: string;
  formatValue?: (value: number) => string;
  accent?: "accent" | "amber";
  ariaLabel?: string;
}

export default function ReasoningSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  valueLabel,
  formatValue = (v) => String(v),
  accent = "accent",
  ariaLabel,
}: ReasoningSliderProps) {
  const accentClass = accent === "amber" ? "accent-amber" : "accent-accent";

  return (
    <div>
      <label className="block text-sm text-text-secondary mb-2">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className={`w-full h-1.5 bg-elevated rounded-full appearance-none cursor-pointer ${accentClass}`}
        aria-label={ariaLabel || label}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-text-muted">{formatValue(min)}</span>
        <span
          className={`text-xs font-mono font-bold ${
            accent === "amber" ? "text-amber" : "text-accent"
          }`}
        >
          {valueLabel}
        </span>
        <span className="text-xs text-text-muted">{formatValue(max)}</span>
      </div>
    </div>
  );
}
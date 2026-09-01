import Icon from "./Icon";
import { formatTargetValue } from "../lib/formatTargetValue";
import type { QuantifiedUnit } from "../data/HabitsContext";
import { useWellbeing } from "../data/WellbeingContext";

type CheckInSliderProps = {
  value: number;
  target: number;
  unit: QuantifiedUnit;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

export default function CheckInSlider({ value, target, unit, min, max, step, onChange }: CheckInSliderProps) {
  const { unitSystem } = useWellbeing();
  const percent = Math.min(100, Math.round((value / max) * 100));
  const metTarget = value >= target;

  const adjust = (delta: number) => {
    onChange(Math.min(max, Math.max(min, value + delta)));
  };

  return (
    <div className="flex flex-col gap-md items-center w-full">
      <div className="flex items-center gap-md w-full">
        <button
          type="button"
          onClick={() => adjust(-step)}
          className="flex items-center justify-center size-10 rounded-md border border-border text-text-secondary hover:bg-surface-alt cursor-pointer shrink-0"
          aria-label="Decrease"
        >
          <Icon name="remove" style={{ fontSize: 18 }} />
        </button>
        <div className="flex flex-col items-center flex-1">
          <p className={`font-bold text-3xl ${metTarget ? "text-success-text" : "text-text-primary"}`}>
            {formatTargetValue(value, unit, unitSystem)}
          </p>
          <p className="text-xs text-text-secondary">of {formatTargetValue(target, unit, unitSystem)} target</p>
        </div>
        <button
          type="button"
          onClick={() => adjust(step)}
          className="flex items-center justify-center size-10 rounded-md border border-border text-text-secondary hover:bg-surface-alt cursor-pointer shrink-0"
          aria-label="Increase"
        >
          <Icon name="add" style={{ fontSize: 18 }} />
        </button>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-accent)] cursor-pointer"
        style={{ accentColor: "var(--color-accent)" }}
        aria-label="Log value"
      />

      <div className="flex items-center justify-between w-full text-xs text-text-secondary">
        <span>{formatTargetValue(min, unit, unitSystem)}</span>
        <span>{percent}%</span>
        <span>{formatTargetValue(max, unit, unitSystem)}</span>
      </div>
    </div>
  );
}

import { useState } from "react";
import Icon from "./Icon";
import Toggle from "./Toggle";
import type { QuantifiedUnit } from "../data/HabitsContext";
import { formatTargetValue } from "../lib/formatTargetValue";
import { useWellbeing } from "../data/WellbeingContext";

export type TargetCardState = "suggested" | "edited";

type TargetCardProps = {
  icon: string;
  label: string;
  value: number;
  unit: QuantifiedUnit;
  reason: string;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onChangeValue: (value: number) => void;
  step: number;
  min: number;
  max: number;
};

export default function TargetCard({
  icon,
  label,
  value,
  unit,
  reason,
  enabled,
  onToggleEnabled,
  onChangeValue,
  step,
  min,
  max,
}: TargetCardProps) {
  const [state, setState] = useState<TargetCardState>("suggested");
  const { unitSystem } = useWellbeing();

  const adjust = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChangeValue(next);
    setState("edited");
  };

  return (
    <div
      className={`flex flex-col gap-md p-lg rounded-lg border w-full transition-colors ${
        enabled ? "bg-surface border-border" : "bg-surface-alt border-border opacity-70"
      }`}
    >
      <div className="flex items-center gap-md w-full">
        <div className="bg-accent-subtle rounded-md size-11 flex items-center justify-center shrink-0">
          <Icon name={icon} className="text-accent" style={{ fontSize: 22 }} />
        </div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <p className="font-semibold text-md text-text-primary">{label}</p>
          <p className="text-xs text-text-secondary">
            {state === "edited" ? "Edited by you" : "Suggested for you"}
          </p>
        </div>
        <Toggle checked={enabled} onChange={onToggleEnabled} aria-label={`Add ${label} as habit`} />
      </div>

      <div className="flex items-center gap-md w-full">
        <button
          type="button"
          onClick={() => adjust(-step)}
          disabled={!enabled}
          className="flex items-center justify-center size-8 rounded-sm border border-border text-text-secondary hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          aria-label={`Decrease ${label} target`}
        >
          <Icon name="remove" style={{ fontSize: 16 }} />
        </button>
        <p className="flex-1 text-center font-bold text-xl text-text-primary">
          {formatTargetValue(value, unit, unitSystem)}
        </p>
        <button
          type="button"
          onClick={() => adjust(step)}
          disabled={!enabled}
          className="flex items-center justify-center size-8 rounded-sm border border-border text-text-secondary hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          aria-label={`Increase ${label} target`}
        >
          <Icon name="add" style={{ fontSize: 16 }} />
        </button>
      </div>

      <p className="text-xs text-text-secondary">{reason}</p>
    </div>
  );
}

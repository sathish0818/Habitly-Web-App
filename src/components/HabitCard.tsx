import Checkbox from "./Checkbox";
import StreakBadge from "./StreakBadge";
import CardMenu from "./CardMenu";
import ProgressRing from "./ProgressRing";
import Icon from "./Icon";
import { formatTargetValue } from "../lib/formatTargetValue";
import type { QuantifiedUnit, StreakState } from "../data/HabitsContext";
import { useWellbeing } from "../data/WellbeingContext";

type HabitCardProps = {
  name: string;
  icon: string;
  streak: number;
  streakState?: StreakState;
  checked: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  quantified?: { targetValue: number; unit: QuantifiedUnit; loggedToday: number };
  onLog?: () => void;
};

export default function HabitCard({
  name,
  icon,
  streak,
  streakState,
  checked,
  onToggle,
  onEdit,
  onDelete,
  quantified,
  onLog,
}: HabitCardProps) {
  const { unitSystem } = useWellbeing();
  return (
    <div
      className={`flex items-center gap-md p-md rounded-lg w-full transition-colors ${
        checked ? "bg-success" : "bg-surface border border-border hover:border-accent"
      }`}
    >
      <div className="bg-surface border border-border rounded-md size-12 flex items-center justify-center shrink-0">
        <Icon name={icon} className="text-text-secondary" style={{ fontSize: 20 }} />
      </div>
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <p
          className={`text-md font-semibold truncate w-full ${
            checked ? "text-text-secondary line-through" : "text-text-primary"
          }`}
        >
          {name}
        </p>
        {quantified ? (
          <p className="text-xs font-medium text-text-secondary">
            {formatTargetValue(quantified.loggedToday, quantified.unit, unitSystem)} / {formatTargetValue(quantified.targetValue, quantified.unit, unitSystem)}
          </p>
        ) : (
          <StreakBadge days={streak} state={streakState} className="self-start" />
        )}
      </div>
      <CardMenu onEdit={onEdit} onDelete={onDelete} />
      {quantified ? (
        <button
          type="button"
          onClick={onLog}
          aria-label={`Log ${name}`}
          className="relative flex items-center justify-center cursor-pointer shrink-0"
        >
          <ProgressRing progress={quantified.targetValue > 0 ? quantified.loggedToday / quantified.targetValue : 0} />
          {checked && (
            <Icon name="check" className="absolute text-success-text" style={{ fontSize: 18 }} />
          )}
        </button>
      ) : (
        <Checkbox checked={checked} onChange={onToggle} aria-label={`Mark ${name} as done`} />
      )}
    </div>
  );
}

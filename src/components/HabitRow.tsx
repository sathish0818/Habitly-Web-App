import Checkbox from "./Checkbox";
import StreakBadge from "./StreakBadge";
import CardMenu from "./CardMenu";
import ProgressRing from "./ProgressRing";
import Icon from "./Icon";
import { formatTargetValue } from "../lib/formatTargetValue";
import type { QuantifiedUnit } from "../data/HabitsContext";

type HabitRowProps = {
  name: string;
  icon: string;
  streak: number;
  checked: boolean;
  isLast: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  quantified?: { targetValue: number; unit: QuantifiedUnit; loggedToday: number };
  onLog?: () => void;
};

export default function HabitRow({
  name,
  icon,
  streak,
  checked,
  isLast,
  onToggle,
  onEdit,
  onDelete,
  quantified,
  onLog,
}: HabitRowProps) {
  return (
    <div
      className={`flex items-center gap-md py-md w-full ${!isLast ? "border-b border-border" : ""}`}
    >
      <div className="bg-surface-alt rounded-md size-10 flex items-center justify-center shrink-0">
        <Icon name={icon} className="text-text-secondary" style={{ fontSize: 18 }} />
      </div>
      <p
        className={`flex-1 min-w-0 text-sm font-semibold truncate ${
          checked ? "text-text-secondary line-through" : "text-text-primary"
        }`}
      >
        {name}
      </p>
      {quantified ? (
        <p className="text-xs font-medium text-text-secondary shrink-0">
          {formatTargetValue(quantified.loggedToday, quantified.unit)} / {formatTargetValue(quantified.targetValue, quantified.unit)}
        </p>
      ) : (
        <StreakBadge days={streak} />
      )}
      <CardMenu onEdit={onEdit} onDelete={onDelete} />
      {quantified ? (
        <button type="button" onClick={onLog} aria-label={`Log ${name}`} className="relative flex items-center justify-center cursor-pointer shrink-0">
          <ProgressRing progress={quantified.targetValue > 0 ? quantified.loggedToday / quantified.targetValue : 0} size={28} strokeWidth={3} />
        </button>
      ) : (
        <Checkbox checked={checked} onChange={onToggle} aria-label={`Mark ${name} as done`} />
      )}
    </div>
  );
}

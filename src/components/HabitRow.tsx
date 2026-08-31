import Checkbox from "./Checkbox";
import StreakBadge from "./StreakBadge";
import CardMenu from "./CardMenu";
import Icon from "./Icon";

type HabitRowProps = {
  name: string;
  icon: string;
  streak: number;
  checked: boolean;
  isLast: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
      <StreakBadge days={streak} />
      <CardMenu onEdit={onEdit} onDelete={onDelete} />
      <Checkbox checked={checked} onChange={onToggle} aria-label={`Mark ${name} as done`} />
    </div>
  );
}

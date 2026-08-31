import Checkbox from "./Checkbox";
import StreakBadge from "./StreakBadge";
import CardMenu from "./CardMenu";
import Icon from "./Icon";

type HabitCardProps = {
  name: string;
  icon: string;
  streak: number;
  checked: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function HabitCard({ name, icon, streak, checked, onToggle, onEdit, onDelete }: HabitCardProps) {
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
        <StreakBadge days={streak} />
      </div>
      <CardMenu onEdit={onEdit} onDelete={onDelete} />
      <Checkbox checked={checked} onChange={onToggle} aria-label={`Mark ${name} as done`} />
    </div>
  );
}

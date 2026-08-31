import Icon from "./Icon";

type StreakBadgeProps = {
  days: number;
  className?: string;
};

function levelFor(days: number): "low" | "medium" | "high" {
  if (days >= 30) return "high";
  if (days >= 7) return "medium";
  return "low";
}

const LEVEL_CLASSES: Record<ReturnType<typeof levelFor>, string> = {
  low: "bg-surface-alt text-text-secondary",
  medium: "bg-accent-subtle text-accent",
  high: "bg-accent text-accent-on",
};

export default function StreakBadge({ days, className = "" }: StreakBadgeProps) {
  const level = levelFor(days);
  return (
    <div className={`flex items-center gap-xs px-sm py-xs rounded-lg shrink-0 ${LEVEL_CLASSES[level]} ${className}`}>
      <Icon name="local_fire_department" style={{ fontSize: 14 }} />
      <span className="text-xs font-bold">{days}</span>
    </div>
  );
}

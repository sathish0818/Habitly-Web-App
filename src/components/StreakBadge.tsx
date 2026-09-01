import Icon from "./Icon";
import type { StreakState } from "../data/HabitsContext";

type StreakBadgeProps = {
  days: number;
  state?: StreakState;
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

export default function StreakBadge({ days, state = "active", className = "" }: StreakBadgeProps) {
  const level = levelFor(days);
  const isGrace = state === "grace";
  const isBroken = state === "broken";

  return (
    <div
      className={`flex items-center gap-xs px-sm py-xs rounded-lg shrink-0 transition-opacity ${
        isBroken ? "bg-surface-alt text-text-secondary opacity-60" : LEVEL_CLASSES[level]
      } ${isGrace ? "opacity-60" : ""} ${className}`}
      title={isGrace ? "Momentum dipped — check in today to keep it going" : undefined}
    >
      <Icon name="local_fire_department" style={{ fontSize: 14 }} />
      <span className="text-xs font-bold">{days}</span>
    </div>
  );
}

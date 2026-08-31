import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits, type Frequency } from "../data/HabitsContext";
import { useToast } from "../data/ToastContext";
import HabitCard from "../components/HabitCard";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../components/Button";
import Icon from "../components/Icon";

type FilterOption = "all" | Frequency;

const FILTERS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

export default function HabitList() {
  const { habits, toggleHabit, deleteHabit, stats } = useHabits();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");

  const doneToday = habits.filter((h) => h.completedToday).length;
  const percentDone = habits.length > 0 ? Math.round((doneToday / habits.length) * 100) : 0;

  const filteredHabits = useMemo(
    () => (filter === "all" ? habits : habits.filter((h) => h.frequency === filter)),
    [habits, filter]
  );

  const pendingHabit = habits.find((h) => h.id === pendingDeleteId);

  const confirmDelete = () => {
    if (!pendingHabit) return;
    deleteHabit(pendingHabit.id);
    showToast(`"${pendingHabit.name}" deleted`, "success");
    setPendingDeleteId(null);
  };

  return (
    <div className="flex flex-col gap-lg items-start pt-2xl px-2xl w-full">
      <div className="flex items-center w-full h-[52px]">
        <p className="flex-1 font-bold text-2xl text-text-primary">My Habits</p>
        <Button size="sm" onClick={() => navigate("/add")}>
          + Add habit
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-lg flex gap-xl items-center p-lg w-full">
        <div className="flex gap-md items-center">
          <div className="bg-accent-subtle border-4 border-accent rounded-full size-14 flex items-center justify-center shrink-0">
            <p className="font-bold text-sm text-accent">{percentDone}%</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-semibold text-md text-text-primary">
              {doneToday} of {habits.length} habits done today
            </p>
            <p className="text-sm text-text-secondary">
              {percentDone >= 100
                ? "All done — great work today."
                : percentDone >= 50
                  ? "Keep going, you're halfway there."
                  : "Let's get a few done today."}
            </p>
          </div>
        </div>
        <div className="flex gap-md items-center">
          <Icon name="local_fire_department" className="text-accent" style={{ fontSize: 22 }} />
          <div className="flex flex-col gap-0.5">
            <p className="font-bold text-md text-text-primary">{stats.currentStreak}</p>
            <p className="text-xs text-text-secondary">day streak</p>
          </div>
        </div>
        <div className="flex gap-md items-center">
          <Icon name="calendar_month" className="text-accent" style={{ fontSize: 22 }} />
          <div className="flex flex-col gap-0.5">
            <p className="font-bold text-md text-text-primary">{habits.length}</p>
            <p className="text-xs text-text-secondary">active habits</p>
          </div>
        </div>
        <div className="flex-1" />
      </div>

      <div className="bg-surface-alt flex items-start p-xs rounded-md">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`flex items-center justify-center px-md py-sm rounded-sm text-sm font-semibold cursor-pointer transition-colors ${
              filter === f.value
                ? "bg-surface text-accent shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredHabits.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg flex flex-col items-center justify-center gap-sm p-2xl w-full">
          <p className="text-sm text-text-secondary">No {filter === "all" ? "" : filter} habits yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-lg w-full">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              icon={habit.icon}
              streak={habit.streak}
              checked={habit.completedToday}
              onToggle={() => toggleHabit(habit.id)}
              onEdit={() => navigate(`/edit/${habit.id}`)}
              onDelete={() => setPendingDeleteId(habit.id)}
            />
          ))}
        </div>
      )}

      {pendingHabit && (
        <ConfirmDialog
          title="Delete habit?"
          message={`"${pendingHabit.name}" and its streak history will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}

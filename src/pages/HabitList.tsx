import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits, type Frequency } from "../data/HabitsContext";
import { useToast } from "../data/ToastContext";
import { useWellbeing } from "../data/WellbeingContext";
import HabitCard from "../components/HabitCard";
import HabitRow from "../components/HabitRow";
import ConfirmDialog from "../components/ConfirmDialog";
import CheckInModal from "../components/CheckInModal";
import Button from "../components/Button";
import Icon from "../components/Icon";

type FilterOption = "all" | Frequency;
type ViewMode = "card" | "list";

const FILTERS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

export default function HabitList() {
  const { habits, toggleHabit, deleteHabit, stats } = useHabits();
  const { profile: wellbeingProfile, loading: wellbeingLoading } = useWellbeing();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [checkInHabitId, setCheckInHabitId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [view, setView] = useState<ViewMode>("card");

  const doneToday = habits.filter((h) => h.completedToday).length;
  const percentDone = habits.length > 0 ? Math.round((doneToday / habits.length) * 100) : 0;

  const filteredHabits = useMemo(
    () => (filter === "all" ? habits : habits.filter((h) => h.frequency === filter)),
    [habits, filter]
  );

  const pendingHabit = habits.find((h) => h.id === pendingDeleteId);

  const confirmDelete = async () => {
    if (!pendingHabit) return;
    const name = pendingHabit.name;
    setPendingDeleteId(null);
    const ok = await deleteHabit(pendingHabit.id);
    if (ok) showToast(`"${name}" deleted`, "success");
  };

  return (
    <div className="flex flex-col gap-lg items-start pt-lg md:pt-2xl px-md md:px-2xl w-full">
      <div className="flex items-center w-full">
        <p className="flex-1 font-bold text-xl md:text-2xl text-text-primary">My Habits</p>
        <Button size="sm" onClick={() => navigate("/add")}>
          + Add habit
        </Button>
      </div>

      {!wellbeingLoading && !wellbeingProfile && (
        <button
          type="button"
          onClick={() => navigate("/onboarding")}
          className="flex items-center gap-md p-lg rounded-lg border border-accent bg-accent-subtle w-full text-left cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Icon name="auto_awesome" className="text-accent shrink-0" style={{ fontSize: 22 }} />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="font-semibold text-sm text-text-primary">Get personalized water, sleep, and step targets</p>
            <p className="text-xs text-text-secondary">Based on your body, not guesswork — takes under a minute.</p>
          </div>
          <Icon name="arrow_forward" className="text-accent shrink-0" style={{ fontSize: 18 }} />
        </button>
      )}

      <div className="bg-surface border border-border rounded-lg flex flex-wrap gap-lg md:gap-xl items-center p-lg w-full">
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
        <div className="flex-1 hidden md:block" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm w-full">
        <div className="bg-surface-alt flex items-start p-xs rounded-md overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`flex items-center justify-center px-md py-sm rounded-sm text-sm font-semibold cursor-pointer transition-colors shrink-0 whitespace-nowrap ${
                filter === f.value
                  ? "bg-surface text-accent shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-surface-alt flex items-start p-xs rounded-md shrink-0 self-start sm:self-auto">
          {(
            [
              { value: "card", icon: "grid_view", label: "Card view" },
              { value: "list", icon: "view_list", label: "List view" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setView(opt.value)}
              aria-label={opt.label}
              aria-pressed={view === opt.value}
              className={`flex items-center justify-center size-8 rounded-sm cursor-pointer transition-colors ${
                view === opt.value
                  ? "bg-surface text-accent shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon name={opt.icon} style={{ fontSize: 18 }} />
            </button>
          ))}
        </div>
      </div>

      {filteredHabits.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg flex flex-col items-center justify-center gap-sm p-2xl w-full">
          <p className="text-sm text-text-secondary">No {filter === "all" ? "" : filter} habits yet.</p>
        </div>
      ) : view === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg w-full">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              icon={habit.icon}
              streak={habit.streak}
              streakState={habit.streakState}
              checked={habit.completedToday}
              onToggle={() => toggleHabit(habit.id)}
              onEdit={() => navigate(`/edit/${habit.id}`)}
              onDelete={() => setPendingDeleteId(habit.id)}
              quantified={habit.quantified ? { ...habit.quantified, loggedToday: habit.loggedToday } : undefined}
              onLog={() => setCheckInHabitId(habit.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg flex flex-col items-start px-lg w-full">
          {filteredHabits.map((habit, i) => (
            <HabitRow
              key={habit.id}
              name={habit.name}
              icon={habit.icon}
              streak={habit.streak}
              streakState={habit.streakState}
              checked={habit.completedToday}
              isLast={i === filteredHabits.length - 1}
              onToggle={() => toggleHabit(habit.id)}
              onEdit={() => navigate(`/edit/${habit.id}`)}
              onDelete={() => setPendingDeleteId(habit.id)}
              quantified={habit.quantified ? { ...habit.quantified, loggedToday: habit.loggedToday } : undefined}
              onLog={() => setCheckInHabitId(habit.id)}
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

      {checkInHabitId && (
        <CheckInModal habitId={checkInHabitId} onClose={() => setCheckInHabitId(null)} />
      )}
    </div>
  );
}

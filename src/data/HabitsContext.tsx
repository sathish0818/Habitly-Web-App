import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { supabase } from "../lib/supabaseClient";

export type Frequency = "daily" | "weekly" | "custom";

export type QuantifiedUnit = "ml" | "hrs" | "steps";

export type QuantifiedInfo = {
  targetValue: number;
  unit: QuantifiedUnit;
};

type StoredHabit = {
  id: string;
  name: string;
  icon: string;
  frequency: Frequency;
  reminder: string | null;
  createdAt: string;
  completedDates: string[];
  quantified?: QuantifiedInfo;
  loggedByDate?: Record<string, number>;
};

export type Habit = StoredHabit & {
  streak: number;
  streakState: StreakState;
  completedToday: boolean;
  totalCheckIns: number;
  completionRate: number;
  loggedToday: number;
  milestones: number[];
};

export const MILESTONE_DAYS = [7, 30, 100];

function todayStr(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr: string, delta: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + delta);
  return todayStr(d);
}

function daysBetween(fromStr: string, toStr: string): number {
  const from = new Date(fromStr + "T00:00:00Z").getTime();
  const to = new Date(toStr + "T00:00:00Z").getTime();
  return Math.round((to - from) / 86_400_000);
}

export type StreakState = "active" | "grace" | "broken";

export type StreakInfo = {
  streak: number;
  state: StreakState;
};

// Streaks get one free "recovery day" per 7 real completed days -- a single
// missed day dips the streak's momentum instead of zeroing it. Walking
// backward from today, a missed day is covered by a grace charge if one is
// available; the streak count itself only increases on real completions.
function computeStreakInfo(completedDates: string[]): StreakInfo {
  if (completedDates.length === 0) return { streak: 0, state: "broken" };
  const set = new Set(completedDates);
  const today = todayStr();
  const completedToday = set.has(today);

  // today doesn't count as a miss while it's still in progress -- the walk
  // starts at today only once it's actually completed, otherwise yesterday.
  let cursor = completedToday ? today : addDays(today, -1);
  let streak = 0;
  let grace = 1;
  let sinceGraceRegen = 0;
  let usedGraceBeforeFirstRealDay = false;
  let sawRealDay = false;
  let iterations = 0;

  while (iterations < 1000) {
    iterations += 1;
    if (set.has(cursor)) {
      streak += 1;
      sawRealDay = true;
      sinceGraceRegen += 1;
      if (sinceGraceRegen >= 7 && grace < 1) {
        grace = 1;
        sinceGraceRegen = 0;
      }
      cursor = addDays(cursor, -1);
    } else if (grace > 0) {
      grace -= 1;
      if (!sawRealDay) usedGraceBeforeFirstRealDay = true;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }

  if (streak === 0) return { streak: 0, state: "broken" };
  const state: StreakState = !completedToday && usedGraceBeforeFirstRealDay ? "grace" : "active";
  return { streak, state };
}

function computeCompletionRate(completedDates: string[], createdAt: string): number {
  const totalDays = Math.max(1, daysBetween(createdAt, todayStr()) + 1);
  return Math.round((completedDates.length / totalDays) * 100);
}

function deriveHabit(h: StoredHabit): Habit {
  const today = todayStr();
  const { streak, state } = computeStreakInfo(h.completedDates);
  return {
    ...h,
    completedToday: h.completedDates.includes(today),
    streak,
    streakState: state,
    totalCheckIns: h.completedDates.length,
    completionRate: computeCompletionRate(h.completedDates, h.createdAt),
    loggedToday: h.loggedByDate?.[today] ?? 0,
    milestones: MILESTONE_DAYS.filter((m) => streak >= m),
  };
}

type HabitRow = {
  id: string;
  name: string;
  icon: string;
  frequency: Frequency;
  reminder: string | null;
  created_at: string;
  quantified_target: number | null;
  quantified_unit: QuantifiedUnit | null;
};

type CompletionRow = {
  habit_id: string;
  date: string;
  logged_value: number | null;
  completed: boolean;
};

function toStoredHabits(habitRows: HabitRow[], completionRows: CompletionRow[]): StoredHabit[] {
  const completedByHabit = new Map<string, string[]>();
  const loggedByHabit = new Map<string, Record<string, number>>();
  for (const row of completionRows) {
    if (row.completed) {
      const list = completedByHabit.get(row.habit_id) ?? [];
      list.push(row.date);
      completedByHabit.set(row.habit_id, list);
    }
    if (row.logged_value !== null) {
      const map = loggedByHabit.get(row.habit_id) ?? {};
      map[row.date] = row.logged_value;
      loggedByHabit.set(row.habit_id, map);
    }
  }

  return habitRows.map((row) => ({
    id: row.id,
    name: row.name,
    icon: row.icon,
    frequency: row.frequency,
    reminder: row.reminder,
    createdAt: row.created_at,
    completedDates: (completedByHabit.get(row.id) ?? []).sort(),
    quantified:
      row.quantified_target !== null && row.quantified_unit !== null
        ? { targetValue: row.quantified_target, unit: row.quantified_unit }
        : undefined,
    loggedByDate: loggedByHabit.get(row.id),
  }));
}

type NewHabitInput = {
  name: string;
  icon: string;
  frequency: Frequency;
  reminder: string | null;
};

type NewQuantifiedHabitInput = {
  name: string;
  icon: string;
  targetValue: number;
  unit: QuantifiedUnit;
};

type HabitsContextValue = {
  habits: Habit[];
  loading: boolean;
  addHabit: (input: NewHabitInput) => void;
  addQuantifiedHabit: (input: NewQuantifiedHabitInput) => void;
  logQuantifiedValue: (id: string, value: number) => void;
  updateHabit: (id: string, input: NewHabitInput) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string) => void;
  getHabit: (id: string) => Habit | undefined;
  clearAllHabits: () => void;
  stats: {
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    totalCheckIns: number;
    weeklyTrend: number[];
  };
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

const TREND_WEEKS = 10;

function computeWeeklyTrend(habits: Habit[]): number[] {
  const today = todayStr();
  const trend: number[] = [];
  for (let w = TREND_WEEKS - 1; w >= 0; w--) {
    const weekEnd = addDays(today, -7 * w);
    let possible = 0;
    let done = 0;
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekEnd, -i);
      if (day > today) continue;
      habits.forEach((h) => {
        if (day >= h.createdAt) {
          possible += 1;
          if (h.completedDates.includes(day)) done += 1;
        }
      });
    }
    trend.push(possible > 0 ? Math.round((done / possible) * 100) : 0);
  }
  return trend;
}

export function HabitsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?.id ?? null;

  const [storedHabits, setStoredHabits] = useState<StoredHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!userId) {
      setStoredHabits([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [{ data: habitRows, error: habitsError }, { data: completionRows, error: completionsError }] =
        await Promise.all([
          supabase.from("habits").select("*").eq("user_id", userId).order("inserted_at"),
          supabase.from("habit_completions").select("habit_id, date, logged_value, completed").eq("user_id", userId),
        ]);
      if (cancelled) return;
      if (habitsError || completionsError) {
        showToast("Couldn't load your habits — check your connection and reload.", "error");
        setLoading(false);
        return;
      }
      setStoredHabits(toStoredHabits(habitRows ?? [], completionRows ?? []));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, showToast]);

  // re-derive today's completion / streaks when the tab regains focus, so an
  // app left open across midnight picks up the new day without a reload
  useEffect(() => {
    const onFocus = () => setTick((t) => t + 1);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  const habits = useMemo(() => {
    void tick;
    return storedHabits.map(deriveHabit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedHabits, tick]);

  const reportError = (message: string) => showToast(message, "error");

  const addHabit = (input: NewHabitInput) => {
    if (!userId) return;
    const id = crypto.randomUUID();
    const createdAt = todayStr();
    setStoredHabits((prev) => [
      ...prev,
      { id, name: input.name, icon: input.icon, frequency: input.frequency, reminder: input.reminder, createdAt, completedDates: [] },
    ]);
    supabase
      .from("habits")
      .insert({
        id,
        user_id: userId,
        name: input.name,
        icon: input.icon,
        frequency: input.frequency,
        reminder: input.reminder,
        created_at: createdAt,
      })
      .then(({ error }) => {
        if (error) reportError(`Couldn't save "${input.name}" — try again.`);
      });
  };

  // idempotent by (name, unit): revisiting the targets screen updates the
  // existing target instead of creating a duplicate habit each time.
  const addQuantifiedHabit = (input: NewQuantifiedHabitInput) => {
    if (!userId) return;
    const existing = storedHabits.find(
      (h) => h.quantified && h.name === input.name && h.quantified.unit === input.unit
    );

    if (existing) {
      setStoredHabits((prev) =>
        prev.map((h) =>
          h.id === existing.id
            ? { ...h, icon: input.icon, quantified: { targetValue: input.targetValue, unit: input.unit } }
            : h
        )
      );
      supabase
        .from("habits")
        .update({ icon: input.icon, quantified_target: input.targetValue, quantified_unit: input.unit })
        .eq("id", existing.id)
        .then(({ error }) => {
          if (error) reportError(`Couldn't update "${input.name}" — try again.`);
        });
      return;
    }

    const id = crypto.randomUUID();
    const createdAt = todayStr();
    setStoredHabits((prev) => [
      ...prev,
      {
        id,
        name: input.name,
        icon: input.icon,
        frequency: "daily",
        reminder: null,
        createdAt,
        completedDates: [],
        quantified: { targetValue: input.targetValue, unit: input.unit },
        loggedByDate: {},
      },
    ]);
    supabase
      .from("habits")
      .insert({
        id,
        user_id: userId,
        name: input.name,
        icon: input.icon,
        frequency: "daily",
        reminder: null,
        created_at: createdAt,
        quantified_target: input.targetValue,
        quantified_unit: input.unit,
      })
      .then(({ error }) => {
        if (error) reportError(`Couldn't save "${input.name}" — try again.`);
      });
  };

  const logQuantifiedValue = (id: string, value: number) => {
    if (!userId) return;
    const today = todayStr();
    const habit = storedHabits.find((h) => h.id === id);
    if (!habit?.quantified) return;
    const metTarget = value >= habit.quantified.targetValue;

    setStoredHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id || !h.quantified) return h;
        const loggedByDate = { ...h.loggedByDate, [today]: value };
        const hasToday = h.completedDates.includes(today);
        const completedDates = metTarget
          ? hasToday
            ? h.completedDates
            : [...h.completedDates, today].sort()
          : h.completedDates.filter((d) => d !== today);
        return { ...h, completedDates, loggedByDate };
      })
    );

    supabase
      .from("habit_completions")
      .upsert(
        { habit_id: id, user_id: userId, date: today, logged_value: value, completed: metTarget },
        { onConflict: "habit_id,date" }
      )
      .then(({ error }) => {
        if (error) reportError("Couldn't save your check-in — try again.");
      });
  };

  const updateHabit = (id: string, input: NewHabitInput) => {
    setStoredHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, name: input.name, icon: input.icon, frequency: input.frequency, reminder: input.reminder }
          : h
      )
    );
    supabase
      .from("habits")
      .update({ name: input.name, icon: input.icon, frequency: input.frequency, reminder: input.reminder })
      .eq("id", id)
      .then(({ error }) => {
        if (error) reportError(`Couldn't update "${input.name}" — try again.`);
      });
  };

  const deleteHabit = (id: string) => {
    setStoredHabits((prev) => prev.filter((h) => h.id !== id));
    supabase
      .from("habits")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) reportError("Couldn't delete that habit — try again.");
      });
  };

  const getHabit = (id: string) => habits.find((h) => h.id === id);

  const toggleHabit = (id: string) => {
    if (!userId) return;
    const today = todayStr();
    const habit = storedHabits.find((h) => h.id === id);
    if (!habit) return;
    const isDoneToday = habit.completedDates.includes(today);

    setStoredHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const completedDates = isDoneToday
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today].sort();
        return { ...h, completedDates };
      })
    );

    const write = isDoneToday
      ? supabase.from("habit_completions").delete().eq("habit_id", id).eq("date", today)
      : supabase
          .from("habit_completions")
          .upsert({ habit_id: id, user_id: userId, date: today, completed: true }, { onConflict: "habit_id,date" });

    write.then(({ error }: { error: { message: string } | null }) => {
      if (error) reportError("Couldn't save your check-in — try again.");
    });
  };

  const clearAllHabits = () => {
    if (!userId) return;
    setStoredHabits([]);
    supabase
      .from("habits")
      .delete()
      .eq("user_id", userId)
      .then(({ error }) => {
        if (error) reportError("Couldn't clear your habits — try again.");
      });
  };

  const stats = useMemo(() => {
    if (habits.length === 0) {
      return { currentStreak: 0, longestStreak: 0, completionRate: 0, totalCheckIns: 0, weeklyTrend: new Array(TREND_WEEKS).fill(0) };
    }
    const currentStreak = Math.max(...habits.map((h) => h.streak));
    const longestStreak = currentStreak;
    const completionRate = Math.round(
      habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length
    );
    const totalCheckIns = habits.reduce((sum, h) => sum + h.totalCheckIns, 0);
    const weeklyTrend = computeWeeklyTrend(habits);
    return { currentStreak, longestStreak, completionRate, totalCheckIns, weeklyTrend };
  }, [habits]);

  return (
    <HabitsContext.Provider
      value={{
        habits,
        loading,
        addHabit,
        addQuantifiedHabit,
        logQuantifiedValue,
        updateHabit,
        deleteHabit,
        toggleHabit,
        getHabit,
        clearAllHabits,
        stats,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within a HabitsProvider");
  return ctx;
}

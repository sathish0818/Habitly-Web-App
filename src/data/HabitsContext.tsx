import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

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
  completedToday: boolean;
  totalCheckIns: number;
  completionRate: number;
  loggedToday: number;
};

const STORAGE_PREFIX = "habitly.habits.";
const DEMO_EMAIL = "alex@habitly.app";

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

function computeStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  const set = new Set(completedDates);
  const today = todayStr();
  let cursor = set.has(today) ? today : addDays(today, -1);
  if (!set.has(cursor)) return 0;
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function computeCompletionRate(completedDates: string[], createdAt: string): number {
  const totalDays = Math.max(1, daysBetween(createdAt, todayStr()) + 1);
  return Math.round((completedDates.length / totalDays) * 100);
}

function deriveHabit(h: StoredHabit): Habit {
  const today = todayStr();
  return {
    ...h,
    completedToday: h.completedDates.includes(today),
    streak: computeStreak(h.completedDates),
    totalCheckIns: h.completedDates.length,
    completionRate: computeCompletionRate(h.completedDates, h.createdAt),
    loggedToday: h.loggedByDate?.[today] ?? 0,
  };
}

// Seed history for the demo account: a long-running run of check-ins with
// occasional gaps, so streaks/completion rates come from real dates rather
// than made-up numbers.
function seedCompletedDates(daysBack: number, gapEvery: number, endedYesterday: boolean): string[] {
  const dates: string[] = [];
  const start = endedYesterday ? 1 : 0;
  for (let i = daysBack; i >= start; i--) {
    if (i % gapEvery === 0 && i > 13) continue; // keep the most recent stretch gap-free for a clean streak
    dates.push(addDays(todayStr(), -i));
  }
  return dates;
}

function seedHabits(): StoredHabit[] {
  const createdAt = addDays(todayStr(), -150);
  return [
    {
      id: "1",
      name: "Drink water",
      icon: "water_drop",
      frequency: "daily",
      reminder: "8:00 AM",
      createdAt,
      completedDates: seedCompletedDates(150, 10, false),
    },
    {
      id: "2",
      name: "Morning run",
      icon: "directions_run",
      frequency: "daily",
      reminder: "7:00 AM",
      createdAt,
      completedDates: seedCompletedDates(150, 4, true),
    },
    {
      id: "3",
      name: "Read 10 pages",
      icon: "menu_book",
      frequency: "daily",
      reminder: null,
      createdAt,
      completedDates: seedCompletedDates(150, 3, true),
    },
    {
      id: "4",
      name: "Meditate",
      icon: "self_improvement",
      frequency: "daily",
      reminder: "9:00 PM",
      createdAt,
      completedDates: seedCompletedDates(150, 7, false),
    },
  ];
}

// Migrates a habit persisted before completedDates existed (it had
// completedToday/streak/totalCheckIns fields instead) into the current
// shape, so old localStorage data doesn't crash the app on load.
function normalizeHabit(raw: unknown): StoredHabit | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (Array.isArray(r.completedDates) && typeof r.createdAt === "string") {
    return r as unknown as StoredHabit;
  }
  if (typeof r.id !== "string" || typeof r.name !== "string") return null;

  const today = todayStr();
  const legacyStreak = typeof r.streak === "number" ? r.streak : 0;
  const wasCompletedToday = Boolean(r.completedToday);
  const completedDates: string[] = [];
  for (let i = 0; i < legacyStreak; i++) {
    completedDates.push(addDays(today, wasCompletedToday ? -i : -(i + 1)));
  }
  const legacyTotal = typeof r.totalCheckIns === "number" ? r.totalCheckIns : legacyStreak;

  return {
    id: r.id,
    name: r.name,
    icon: typeof r.icon === "string" ? r.icon : "star",
    frequency: r.frequency === "weekly" || r.frequency === "custom" ? r.frequency : "daily",
    reminder: typeof r.reminder === "string" ? r.reminder : null,
    createdAt: addDays(today, -Math.max(legacyStreak, legacyTotal, 1)),
    completedDates,
  };
}

function loadHabitsFor(email: string | null): StoredHabit[] {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + email);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized = parsed.map(normalizeHabit).filter((h): h is StoredHabit => h !== null);
        return normalized;
      }
    }
  } catch {
    // fall through to default
  }
  return email === DEMO_EMAIL ? seedHabits() : [];
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
  const email = user?.email ?? null;

  const [storedHabits, setStoredHabits] = useState<StoredHabit[]>(() => loadHabitsFor(email));
  const [tick, setTick] = useState(0);

  // always current by the time effects run this render, so the persistence
  // effect below never writes a just-loaded account's habits under a stale key
  const emailRef = useRef(email);
  emailRef.current = email;

  const prevEmailRef = useRef<string | null>(null);

  // reload whenever the signed-in account changes (sign in/out, switch account).
  // if the email changed while staying signed in (editing it in Settings,
  // rather than a sign-out/sign-in), that's a rename — carry the habit data
  // to the new key instead of orphaning it under the old one.
  useEffect(() => {
    const prevEmail = prevEmailRef.current;
    if (prevEmail && email && prevEmail !== email) {
      const oldKey = STORAGE_PREFIX + prevEmail;
      const newKey = STORAGE_PREFIX + email;
      const oldRaw = localStorage.getItem(oldKey);
      if (oldRaw && !localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, oldRaw);
      }
      localStorage.removeItem(oldKey);
    }
    prevEmailRef.current = email;
    setStoredHabits(loadHabitsFor(email));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (emailRef.current) {
      localStorage.setItem(STORAGE_PREFIX + emailRef.current, JSON.stringify(storedHabits));
    }
  }, [storedHabits]);

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

  const addHabit = (input: NewHabitInput) => {
    setStoredHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: input.name,
        icon: input.icon,
        frequency: input.frequency,
        reminder: input.reminder,
        createdAt: todayStr(),
        completedDates: [],
      },
    ]);
  };

  const addQuantifiedHabit = (input: NewQuantifiedHabitInput) => {
    setStoredHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: input.name,
        icon: input.icon,
        frequency: "daily",
        reminder: null,
        createdAt: todayStr(),
        completedDates: [],
        quantified: { targetValue: input.targetValue, unit: input.unit },
        loggedByDate: {},
      },
    ]);
  };

  const logQuantifiedValue = (id: string, value: number) => {
    const today = todayStr();
    setStoredHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id || !h.quantified) return h;
        const loggedByDate = { ...h.loggedByDate, [today]: value };
        const metTarget = value >= h.quantified.targetValue;
        const hasToday = h.completedDates.includes(today);
        const completedDates = metTarget
          ? hasToday
            ? h.completedDates
            : [...h.completedDates, today].sort()
          : h.completedDates.filter((d) => d !== today);
        return { ...h, completedDates, loggedByDate };
      })
    );
  };

  const updateHabit = (id: string, input: NewHabitInput) => {
    setStoredHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, name: input.name, icon: input.icon, frequency: input.frequency, reminder: input.reminder }
          : h
      )
    );
  };

  const deleteHabit = (id: string) => {
    setStoredHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const getHabit = (id: string) => habits.find((h) => h.id === id);

  const toggleHabit = (id: string) => {
    const today = todayStr();
    setStoredHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const isDoneToday = h.completedDates.includes(today);
        const completedDates = isDoneToday
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today].sort();
        return { ...h, completedDates };
      })
    );
  };

  const clearAllHabits = () => {
    if (email) localStorage.removeItem(STORAGE_PREFIX + email);
    setStoredHabits([]);
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

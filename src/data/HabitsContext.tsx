import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type Frequency = "daily" | "weekly" | "custom";

export type Habit = {
  id: string;
  name: string;
  icon: string;
  frequency: Frequency;
  reminder: string | null;
  streak: number;
  completedToday: boolean;
  totalCheckIns: number;
  completionRate: number;
};

const STORAGE_PREFIX = "habitly.habits.";
const DEMO_EMAIL = "alex@habitly.app";

const SEED_HABITS: Habit[] = [
  { id: "1", name: "Drink water", icon: "water_drop", frequency: "daily", reminder: "8:00 AM", streak: 12, completedToday: true, totalCheckIns: 132, completionRate: 90 },
  { id: "2", name: "Morning run", icon: "directions_run", frequency: "daily", reminder: "7:00 AM", streak: 12, completedToday: false, totalCheckIns: 98, completionRate: 75 },
  { id: "3", name: "Read 10 pages", icon: "menu_book", frequency: "daily", reminder: null, streak: 12, completedToday: false, totalCheckIns: 80, completionRate: 60 },
  { id: "4", name: "Meditate", icon: "self_improvement", frequency: "daily", reminder: "9:00 PM", streak: 12, completedToday: true, totalCheckIns: 112, completionRate: 85 },
];

function loadHabitsFor(email: string | null): Habit[] {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + email);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fall through to default
  }
  return email === DEMO_EMAIL ? SEED_HABITS : [];
}

type NewHabitInput = {
  name: string;
  icon: string;
  frequency: Frequency;
  reminder: string | null;
};

type HabitsContextValue = {
  habits: Habit[];
  addHabit: (input: NewHabitInput) => void;
  updateHabit: (id: string, input: NewHabitInput) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string) => void;
  getHabit: (id: string) => Habit | undefined;
  stats: {
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    totalCheckIns: number;
  };
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const email = user?.email ?? null;

  const [habits, setHabits] = useState<Habit[]>(() => loadHabitsFor(email));

  // reload whenever the signed-in account changes (sign in/out, switch account)
  useEffect(() => {
    setHabits(loadHabitsFor(email));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (email) {
      localStorage.setItem(STORAGE_PREFIX + email, JSON.stringify(habits));
    }
  }, [habits, email]);

  const addHabit = (input: NewHabitInput) => {
    setHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: input.name,
        icon: input.icon,
        frequency: input.frequency,
        reminder: input.reminder,
        streak: 0,
        completedToday: false,
        totalCheckIns: 0,
        completionRate: 0,
      },
    ]);
  };

  const updateHabit = (id: string, input: NewHabitInput) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, name: input.name, icon: input.icon, frequency: input.frequency, reminder: input.reminder }
          : h
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const getHabit = (id: string) => habits.find((h) => h.id === id);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completedToday: !h.completedToday,
              streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1),
              totalCheckIns: !h.completedToday ? h.totalCheckIns + 1 : Math.max(0, h.totalCheckIns - 1),
            }
          : h
      )
    );
  };

  const stats = useMemo(() => {
    if (habits.length === 0) {
      return { currentStreak: 0, longestStreak: 0, completionRate: 0, totalCheckIns: 0 };
    }
    const currentStreak = Math.max(...habits.map((h) => h.streak));
    const longestStreak = Math.max(currentStreak, ...habits.map((h) => h.streak));
    const completionRate = Math.round(
      habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length
    );
    const totalCheckIns = habits.reduce((sum, h) => sum + h.totalCheckIns, 0);
    return { currentStreak, longestStreak, completionRate, totalCheckIns };
  }, [habits]);

  return (
    <HabitsContext.Provider value={{ habits, addHabit, updateHabit, deleteHabit, toggleHabit, getHabit, stats }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within a HabitsProvider");
  return ctx;
}

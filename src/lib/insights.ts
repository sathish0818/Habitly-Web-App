import type { Habit } from "../data/HabitsContext";
import type { Mood } from "../data/MoodContext";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, delta: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

export function dailyCompletionRate(habits: Habit[], date: string): number {
  const due = habits.filter((h) => date >= h.createdAt);
  if (due.length === 0) return 0;
  const done = due.filter((h) => h.completedDates.includes(date)).length;
  return done / due.length;
}

export type MoodCorrelation = {
  greatAvg: number;
  otherAvg: number;
  multiplier: number;
  sampleSize: number;
};

const MIN_MOOD_SAMPLES = 3;

export function computeMoodCorrelation(
  habits: Habit[],
  moodByDate: Record<string, Mood>
): MoodCorrelation | null {
  const entries = Object.entries(moodByDate);
  if (entries.length < MIN_MOOD_SAMPLES) return null;

  const great: number[] = [];
  const other: number[] = [];
  entries.forEach(([date, mood]) => {
    const rate = dailyCompletionRate(habits, date);
    (mood === "great" ? great : other).push(rate);
  });

  if (great.length === 0 || other.length === 0) return null;

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const greatAvg = avg(great);
  const otherAvg = avg(other);
  if (otherAvg === 0) return null;

  return { greatAvg, otherAvg, multiplier: greatAvg / otherAvg, sampleSize: entries.length };
}

export type HeatmapDay = {
  date: string;
  rate: number; // 0-1
};

export function computeHeatmap(habits: Habit[], weeks: number): HeatmapDay[] {
  const today = todayStr();
  const days: HeatmapDay[] = [];
  const totalDays = weeks * 7;
  for (let i = totalDays - 1; i >= 0; i--) {
    const date = addDays(today, -i);
    days.push({ date, rate: dailyCompletionRate(habits, date) });
  }
  return days;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { supabase } from "../lib/supabaseClient";

export type Mood = "great" | "okay" | "rough";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

type MoodContextValue = {
  moodByDate: Record<string, Mood>;
  setMoodForToday: (mood: Mood) => void;
};

const MoodContext = createContext<MoodContextValue | null>(null);

export function MoodProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?.id ?? null;
  const [moodByDate, setMoodByDate] = useState<Record<string, Mood>>({});

  useEffect(() => {
    if (!userId) {
      setMoodByDate({});
      return;
    }
    let cancelled = false;
    supabase
      .from("moods")
      .select("date, mood")
      .eq("user_id", userId)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const map: Record<string, Mood> = {};
        for (const row of data) map[row.date] = row.mood as Mood;
        setMoodByDate(map);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const setMoodForToday = (mood: Mood) => {
    if (!userId) return;
    const date = todayStr();
    setMoodByDate((prev) => ({ ...prev, [date]: mood }));
    supabase
      .from("moods")
      .upsert({ user_id: userId, date, mood }, { onConflict: "user_id,date" })
      .then(({ error }) => {
        if (error) showToast("Couldn't save your mood — try again.", "error");
      });
  };

  return (
    <MoodContext.Provider value={{ moodByDate, setMoodForToday }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error("useMood must be used within a MoodProvider");
  return ctx;
}

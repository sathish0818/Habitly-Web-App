import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type Mood = "great" | "okay" | "rough";

const STORAGE_PREFIX = "habitly.mood.";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadMoodFor(email: string | null): Record<string, Mood> {
  if (!email) return {};
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + email);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through
  }
  return {};
}

type MoodContextValue = {
  moodByDate: Record<string, Mood>;
  setMoodForToday: (mood: Mood) => void;
};

const MoodContext = createContext<MoodContextValue | null>(null);

export function MoodProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const email = user?.email ?? null;
  const [moodByDate, setMoodByDate] = useState<Record<string, Mood>>(() => loadMoodFor(email));
  const emailRef = useRef(email);
  emailRef.current = email;

  useEffect(() => {
    setMoodByDate(loadMoodFor(email));
  }, [email]);

  useEffect(() => {
    if (emailRef.current) {
      localStorage.setItem(STORAGE_PREFIX + emailRef.current, JSON.stringify(moodByDate));
    }
  }, [moodByDate]);

  const setMoodForToday = (mood: Mood) => {
    setMoodByDate((prev) => ({ ...prev, [todayStr()]: mood }));
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

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { WellbeingProfile } from "../lib/wellbeingTargets";

const STORAGE_PREFIX = "habitly.wellbeing.";

function loadProfileFor(email: string | null): WellbeingProfile | null {
  if (!email) return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + email);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through
  }
  return null;
}

type WellbeingContextValue = {
  profile: WellbeingProfile | null;
  saveProfile: (profile: WellbeingProfile) => void;
};

const WellbeingContext = createContext<WellbeingContextValue | null>(null);

export function WellbeingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const email = user?.email ?? null;

  const [profile, setProfile] = useState<WellbeingProfile | null>(() => loadProfileFor(email));

  useEffect(() => {
    setProfile(loadProfileFor(email));
  }, [email]);

  const saveProfile = (next: WellbeingProfile) => {
    setProfile(next);
    if (email) {
      localStorage.setItem(STORAGE_PREFIX + email, JSON.stringify(next));
    }
  };

  return (
    <WellbeingContext.Provider value={{ profile, saveProfile }}>
      {children}
    </WellbeingContext.Provider>
  );
}

export function useWellbeing() {
  const ctx = useContext(WellbeingContext);
  if (!ctx) throw new Error("useWellbeing must be used within a WellbeingProvider");
  return ctx;
}

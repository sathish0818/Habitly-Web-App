import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { WellbeingProfile } from "../lib/wellbeingTargets";

export type UnitSystem = "metric" | "imperial";

const PROFILE_PREFIX = "habitly.wellbeing.";
const UNITS_PREFIX = "habitly.units.";

function loadProfileFor(email: string | null): WellbeingProfile | null {
  if (!email) return null;
  try {
    const raw = localStorage.getItem(PROFILE_PREFIX + email);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through
  }
  return null;
}

function loadUnitSystemFor(email: string | null): UnitSystem {
  if (!email) return "metric";
  const raw = localStorage.getItem(UNITS_PREFIX + email);
  return raw === "imperial" ? "imperial" : "metric";
}

type WellbeingContextValue = {
  profile: WellbeingProfile | null;
  saveProfile: (profile: WellbeingProfile) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
};

const WellbeingContext = createContext<WellbeingContextValue | null>(null);

export function WellbeingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const email = user?.email ?? null;

  const [profile, setProfile] = useState<WellbeingProfile | null>(() => loadProfileFor(email));
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => loadUnitSystemFor(email));

  useEffect(() => {
    setProfile(loadProfileFor(email));
    setUnitSystemState(loadUnitSystemFor(email));
  }, [email]);

  const saveProfile = (next: WellbeingProfile) => {
    setProfile(next);
    if (email) {
      localStorage.setItem(PROFILE_PREFIX + email, JSON.stringify(next));
    }
  };

  const setUnitSystem = (system: UnitSystem) => {
    setUnitSystemState(system);
    if (email) {
      localStorage.setItem(UNITS_PREFIX + email, system);
    }
  };

  return (
    <WellbeingContext.Provider value={{ profile, saveProfile, unitSystem, setUnitSystem }}>
      {children}
    </WellbeingContext.Provider>
  );
}

export function useWellbeing() {
  const ctx = useContext(WellbeingContext);
  if (!ctx) throw new Error("useWellbeing must be used within a WellbeingProvider");
  return ctx;
}

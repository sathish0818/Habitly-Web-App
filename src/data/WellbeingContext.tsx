import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { supabase } from "../lib/supabaseClient";
import type { WellbeingProfile } from "../lib/wellbeingTargets";

export type UnitSystem = "metric" | "imperial";

const UNITS_PREFIX = "habitly.units.";

function loadUnitSystemFor(userId: string | null): UnitSystem {
  if (!userId) return "metric";
  const raw = localStorage.getItem(UNITS_PREFIX + userId);
  return raw === "imperial" ? "imperial" : "metric";
}

type WellbeingRow = {
  height_cm: number;
  weight_kg: number;
  age: number;
  sex: WellbeingProfile["sex"];
  activity_level: WellbeingProfile["activityLevel"];
};

function fromRow(row: WellbeingRow): WellbeingProfile {
  return {
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    age: row.age,
    sex: row.sex,
    activityLevel: row.activity_level,
  };
}

type WellbeingContextValue = {
  profile: WellbeingProfile | null;
  saveProfile: (profile: WellbeingProfile) => Promise<boolean>;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
};

const WellbeingContext = createContext<WellbeingContextValue | null>(null);

export function WellbeingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?.id ?? null;

  const [profile, setProfile] = useState<WellbeingProfile | null>(null);
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => loadUnitSystemFor(userId));

  useEffect(() => {
    setUnitSystemState(loadUnitSystemFor(userId));
    if (!userId) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    supabase
      .from("wellbeing_profiles")
      .select("height_cm, weight_kg, age, sex, activity_level")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled || error) return;
        setProfile(data ? fromRow(data) : null);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const saveProfile = async (next: WellbeingProfile) => {
    if (!userId) return false;
    setProfile(next);
    const { error } = await supabase.from("wellbeing_profiles").upsert(
      {
        user_id: userId,
        height_cm: next.heightCm,
        weight_kg: next.weightKg,
        age: next.age,
        sex: next.sex,
        activity_level: next.activityLevel,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) {
      showToast("Couldn't save your profile — try again.", "error");
      return false;
    }
    return true;
  };

  const setUnitSystem = (system: UnitSystem) => {
    setUnitSystemState(system);
    if (userId) localStorage.setItem(UNITS_PREFIX + userId, system);
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

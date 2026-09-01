export type Sex = "female" | "male" | "unspecified";
export type ActivityLevel = "sedentary" | "moderate" | "active";

export type WellbeingProfile = {
  heightCm: number;
  weightKg: number;
  age: number;
  sex: Sex;
  activityLevel: ActivityLevel;
};

export type SuggestedTarget = {
  value: number;
  unit: string;
  reason: string;
};

const WATER_ML_PER_KG: Record<ActivityLevel, number> = {
  sedentary: 35,
  moderate: 40,
  active: 45,
};

const ACTIVITY_LABEL: Record<ActivityLevel, string> = {
  sedentary: "sedentary",
  moderate: "moderately active",
  active: "highly active",
};

export function suggestWaterTargetMl(profile: Pick<WellbeingProfile, "weightKg" | "activityLevel">): SuggestedTarget {
  const perKg = WATER_ML_PER_KG[profile.activityLevel];
  const value = Math.round((profile.weightKg * perKg) / 50) * 50; // round to nearest 50ml
  return {
    value,
    unit: "ml",
    reason: `${profile.weightKg}kg × ${perKg}ml, the amount recommended for a ${ACTIVITY_LABEL[profile.activityLevel]} activity level.`,
  };
}

export function suggestSleepTargetHours(profile: Pick<WellbeingProfile, "age">): SuggestedTarget {
  if (profile.age >= 65) {
    return {
      value: 7.5,
      unit: "hrs",
      reason: "Adults 65 and over are generally recommended 7–8 hours of sleep a night.",
    };
  }
  if (profile.age >= 18) {
    return {
      value: 8,
      unit: "hrs",
      reason: "Adults 18–64 are generally recommended 7–9 hours of sleep a night.",
    };
  }
  return {
    value: 9,
    unit: "hrs",
    reason: "Younger adults are generally recommended 8–10 hours of sleep a night.",
  };
}

export function suggestStepsTarget(profile: Pick<WellbeingProfile, "activityLevel">): SuggestedTarget {
  if (profile.activityLevel === "active") {
    return {
      value: 10000,
      unit: "steps",
      reason: "You told us you're highly active, so we've set a higher target — 7,000/day already captures most of the health benefit.",
    };
  }
  return {
    value: 7000,
    unit: "steps",
    reason: "7,000 steps/day is the evidence-backed minimum that captures most of the benefit walking provides — you can always raise it later.",
  };
}

export function suggestAllTargets(profile: WellbeingProfile) {
  return {
    water: suggestWaterTargetMl(profile),
    sleep: suggestSleepTargetHours(profile),
    steps: suggestStepsTarget(profile),
  };
}

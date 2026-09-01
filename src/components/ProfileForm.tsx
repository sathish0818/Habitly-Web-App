import { useState } from "react";
import Input from "./Input";
import Select from "./Select";
import type { ActivityLevel, Sex, WellbeingProfile } from "../lib/wellbeingTargets";

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; hint: string }[] = [
  { value: "sedentary", label: "Sedentary", hint: "Mostly sitting, little exercise" },
  { value: "moderate", label: "Moderate", hint: "Light exercise a few days a week" },
  { value: "active", label: "Active", hint: "Regular workouts or a physical job" },
];

export type ProfileFormValues = WellbeingProfile;

type ProfileFormProps = {
  initialValues?: Partial<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => void;
};

export default function ProfileForm({ initialValues, onSubmit }: ProfileFormProps) {
  const [heightCm, setHeightCm] = useState(initialValues?.heightCm?.toString() ?? "");
  const [weightKg, setWeightKg] = useState(initialValues?.weightKg?.toString() ?? "");
  const [age, setAge] = useState(initialValues?.age?.toString() ?? "");
  const [sex, setSex] = useState<Sex>(initialValues?.sex ?? "unspecified");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(initialValues?.activityLevel ?? "moderate");

  const heightNum = Number(heightCm);
  const weightNum = Number(weightKg);
  const ageNum = Number(age);
  const isValid =
    heightCm.trim() !== "" && heightNum > 0 &&
    weightKg.trim() !== "" && weightNum > 0 &&
    age.trim() !== "" && ageNum > 0 && ageNum < 120;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ heightCm: heightNum, weightKg: weightNum, age: ageNum, sex, activityLevel });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-lg items-start w-full">
      <div className="flex flex-col sm:flex-row gap-lg items-start w-full">
        <div className="flex flex-col gap-sm items-start flex-1 w-full">
          <p className="font-semibold text-sm text-text-primary">Height (cm)</p>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="170"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-sm items-start flex-1 w-full">
          <p className="font-semibold text-sm text-text-primary">Weight (kg)</p>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="65"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-lg items-start w-full">
        <div className="flex flex-col gap-sm items-start flex-1 w-full">
          <p className="font-semibold text-sm text-text-primary">Age</p>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="28"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-sm items-start flex-1 w-full">
          <p className="font-semibold text-sm text-text-primary">Sex <span className="font-normal text-text-secondary">(optional)</span></p>
          <Select value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
            <option value="unspecified">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-sm items-start w-full">
        <p className="font-semibold text-sm text-text-primary">Activity level</p>
        <div className="flex flex-col sm:flex-row gap-sm items-stretch sm:items-start w-full">
          {ACTIVITY_LEVELS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setActivityLevel(opt.value)}
              className={`flex flex-col gap-0.5 items-start text-left flex-1 px-md py-sm rounded-md border transition-colors cursor-pointer ${
                activityLevel === opt.value
                  ? "border-accent bg-accent-subtle"
                  : "border-border bg-surface hover:border-accent"
              }`}
            >
              <span className={`text-sm font-semibold ${activityLevel === opt.value ? "text-accent" : "text-text-primary"}`}>
                {opt.label}
              </span>
              <span className="text-xs text-text-secondary">{opt.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="flex items-center justify-center gap-sm rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-lg py-md text-md bg-accent hover:bg-accent-hover text-accent-on w-full"
      >
        Continue
      </button>
    </form>
  );
}

import { useMemo, useState } from "react";
import { useWellbeing } from "../data/WellbeingContext";
import { useHabits } from "../data/HabitsContext";
import { useToast } from "../data/ToastContext";
import { suggestAllTargets } from "../lib/wellbeingTargets";
import TargetCard from "./TargetCard";
import Icon from "./Icon";

type TargetsStepProps = {
  onDone: () => void;
  onEditProfile?: () => void;
  compact?: boolean;
};

export default function TargetsStep({ onDone, onEditProfile, compact = false }: TargetsStepProps) {
  const { profile } = useWellbeing();
  const { addQuantifiedHabit } = useHabits();
  const { showToast } = useToast();

  const suggested = useMemo(() => (profile ? suggestAllTargets(profile) : null), [profile]);

  const [waterEnabled, setWaterEnabled] = useState(true);
  const [sleepEnabled, setSleepEnabled] = useState(true);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [waterValue, setWaterValue] = useState(suggested?.water.value ?? 2400);
  const [sleepValue, setSleepValue] = useState(suggested?.sleep.value ?? 8);
  const [stepsValue, setStepsValue] = useState(suggested?.steps.value ?? 7000);

  if (!profile || !suggested) return null;

  const handleContinue = () => {
    if (waterEnabled) {
      addQuantifiedHabit({ name: "Drink water", icon: "water_drop", targetValue: waterValue, unit: "ml" });
    }
    if (sleepEnabled) {
      addQuantifiedHabit({ name: "Sleep", icon: "bedtime", targetValue: sleepValue, unit: "hrs" });
    }
    if (stepsEnabled) {
      addQuantifiedHabit({ name: "Walk", icon: "directions_walk", targetValue: stepsValue, unit: "steps" });
    }
    const count = [waterEnabled, sleepEnabled, stepsEnabled].filter(Boolean).length;
    showToast(count > 0 ? `${count} habit${count === 1 ? "" : "s"} added` : "No habits added", "success");
    onDone();
  };

  const noneEnabled = !waterEnabled && !sleepEnabled && !stepsEnabled;

  return (
    <div className="flex flex-col gap-lg items-start w-full">
      <div className="flex items-center w-full">
        <div className="flex-1 flex flex-col gap-1 items-start">
          <p className={`font-bold text-xl text-text-primary ${compact ? "" : "md:text-2xl"}`}>Your targets</p>
          <p className="text-sm text-text-secondary">
            Based on your profile — editable, not locked. Turn off anything you don't want tracked.
          </p>
        </div>
        {onEditProfile && (
          <button
            type="button"
            onClick={onEditProfile}
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-accent hover:underline cursor-pointer shrink-0"
          >
            <Icon name="edit" style={{ fontSize: 16 }} />
            Edit profile
          </button>
        )}
      </div>

      <div className={`grid grid-cols-1 gap-lg w-full ${compact ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        <TargetCard
          icon="water_drop"
          label="Water"
          value={waterValue}
          unit="ml"
          reason={suggested.water.reason}
          enabled={waterEnabled}
          onToggleEnabled={setWaterEnabled}
          onChangeValue={setWaterValue}
          step={100}
          min={500}
          max={6000}
        />
        <TargetCard
          icon="bedtime"
          label="Sleep"
          value={sleepValue}
          unit="hrs"
          reason={suggested.sleep.reason}
          enabled={sleepEnabled}
          onToggleEnabled={setSleepEnabled}
          onChangeValue={setSleepValue}
          step={0.5}
          min={4}
          max={12}
        />
        <TargetCard
          icon="directions_walk"
          label="Steps"
          value={stepsValue}
          unit="steps"
          reason={suggested.steps.reason}
          enabled={stepsEnabled}
          onToggleEnabled={setStepsEnabled}
          onChangeValue={setStepsValue}
          step={500}
          min={1000}
          max={20000}
        />
      </div>

      <div className="bg-surface border border-border rounded-lg flex flex-col sm:flex-row gap-md sm:items-center justify-between p-lg w-full">
        <p className="text-xs text-text-secondary max-w-[480px]">
          These are general wellness suggestions, not medical advice — adjust them to fit you.
        </p>
        <button
          type="button"
          onClick={handleContinue}
          className="flex items-center justify-center gap-sm rounded-md font-semibold px-lg py-md text-md bg-accent hover:bg-accent-hover text-accent-on cursor-pointer shrink-0"
        >
          {noneEnabled ? "Skip for now" : "Save to my habits"}
        </button>
      </div>
    </div>
  );
}

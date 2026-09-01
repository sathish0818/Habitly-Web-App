import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWellbeing } from "../data/WellbeingContext";
import { useHabits } from "../data/HabitsContext";
import { useToast } from "../data/ToastContext";
import { suggestAllTargets } from "../lib/wellbeingTargets";
import TargetCard from "../components/TargetCard";

export default function YourTargets() {
  const { profile } = useWellbeing();
  const { addQuantifiedHabit } = useHabits();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const suggested = useMemo(() => {
    if (!profile) return null;
    return suggestAllTargets(profile);
  }, [profile]);

  const [waterEnabled, setWaterEnabled] = useState(true);
  const [sleepEnabled, setSleepEnabled] = useState(true);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [waterValue, setWaterValue] = useState(suggested?.water.value ?? 2400);
  const [sleepValue, setSleepValue] = useState(suggested?.sleep.value ?? 8);
  const [stepsValue, setStepsValue] = useState(suggested?.steps.value ?? 7000);

  if (!profile || !suggested) {
    return (
      <div className="bg-surface-alt flex items-center justify-center min-h-screen w-full px-md">
        <div className="bg-surface border border-border rounded-lg flex flex-col gap-md items-center px-xl py-2xl w-full max-w-[480px] text-center">
          <p className="font-bold text-xl text-text-primary">Let's set up your profile first</p>
          <p className="text-sm text-text-secondary">
            We need a few details about you before we can suggest personalized targets.
          </p>
          <button
            type="button"
            onClick={() => navigate("/onboarding")}
            className="flex items-center justify-center gap-sm rounded-md font-semibold px-lg py-md text-md bg-accent hover:bg-accent-hover text-accent-on cursor-pointer"
          >
            Set up profile
          </button>
        </div>
      </div>
    );
  }

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
    navigate("/habits");
  };

  const noneEnabled = !waterEnabled && !sleepEnabled && !stepsEnabled;

  return (
    <div className="bg-surface-alt flex items-center justify-center min-h-screen w-full px-md py-2xl">
      <div className="bg-surface border border-border rounded-lg shadow-lg flex flex-col gap-lg items-start px-xl py-2xl w-full max-w-[480px]">
        <div className="flex flex-col gap-sm items-start w-full">
          <div className="flex gap-xs items-center w-full">
            <div className="h-1 flex-1 rounded-sm bg-accent" />
            <div className="h-1 flex-1 rounded-sm bg-accent" />
          </div>
          <p className="text-xs font-semibold text-text-secondary">STEP 2 OF 2</p>
        </div>

        <div className="flex flex-col gap-1 items-start">
          <p className="font-bold text-xl text-text-primary">Based on your profile, here's what we recommend</p>
          <p className="text-sm text-text-secondary">
            Editable, not locked — adjust anything, or turn off what you don't want tracked.
          </p>
        </div>

        <div className="flex flex-col gap-md items-start w-full">
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

        <p className="text-xs text-text-secondary">
          These are general wellness suggestions, not medical advice — adjust them to fit you.
        </p>

        <button
          type="button"
          onClick={handleContinue}
          className="flex items-center justify-center gap-sm rounded-md font-semibold px-lg py-md text-md bg-accent hover:bg-accent-hover text-accent-on cursor-pointer w-full"
        >
          {noneEnabled ? "Skip for now" : "Add to my habits"}
        </button>
      </div>
    </div>
  );
}

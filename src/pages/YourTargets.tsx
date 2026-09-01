import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWellbeing } from "../data/WellbeingContext";
import { useHabits } from "../data/HabitsContext";
import { useToast } from "../data/ToastContext";
import { suggestAllTargets } from "../lib/wellbeingTargets";
import TargetCard from "../components/TargetCard";
import Icon from "../components/Icon";

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
      <div className="flex flex-col gap-lg items-start pt-lg md:pt-2xl px-md md:px-2xl pb-2xl w-full">
        <div className="flex flex-col gap-1 items-start">
          <p className="font-bold text-xl md:text-2xl text-text-primary">Targets</p>
          <p className="text-sm text-text-secondary">
            Personalized water, sleep, and step targets based on your body.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg flex flex-col gap-md items-start p-2xl w-full">
          <div className="bg-accent-subtle rounded-md size-11 flex items-center justify-center">
            <Icon name="track_changes" className="text-accent" style={{ fontSize: 22 }} />
          </div>
          <p className="font-semibold text-md text-text-primary">Let's set up your profile first</p>
          <p className="text-sm text-text-secondary">
            We need a few details about you — height, weight, age, and activity level — before we can suggest personalized targets.
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
    <div className="flex flex-col gap-lg items-start pt-lg md:pt-2xl px-md md:px-2xl pb-2xl w-full">
      <div className="flex items-center w-full">
        <div className="flex-1 flex flex-col gap-1 items-start">
          <p className="font-bold text-xl md:text-2xl text-text-primary">Targets</p>
          <p className="text-sm text-text-secondary">
            Based on your profile — editable, not locked. Turn off anything you don't want tracked.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/onboarding")}
          className="hidden sm:flex items-center gap-1 text-sm font-semibold text-accent hover:underline cursor-pointer shrink-0"
        >
          <Icon name="edit" style={{ fontSize: 16 }} />
          Edit profile
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg w-full">
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

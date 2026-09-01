import { useState } from "react";
import { useHabits, type QuantifiedUnit } from "../data/HabitsContext";
import { useMood, type Mood } from "../data/MoodContext";
import { useToast } from "../data/ToastContext";
import CheckInSlider from "./CheckInSlider";
import MoodTag from "./MoodTag";
import Icon from "./Icon";

const SLIDER_CONFIG: Record<QuantifiedUnit, { min: number; max: number; step: number }> = {
  ml: { min: 0, max: 5000, step: 100 },
  hrs: { min: 0, max: 12, step: 0.5 },
  steps: { min: 0, max: 20000, step: 250 },
};

const MOODS: Mood[] = ["great", "okay", "rough"];

type CheckInFormProps = {
  habitId: string;
  onDone: () => void;
};

export default function CheckInForm({ habitId, onDone }: CheckInFormProps) {
  const { getHabit, logQuantifiedValue } = useHabits();
  const { moodByDate, setMoodForToday } = useMood();
  const { showToast } = useToast();

  const habit = getHabit(habitId);
  const today = new Date().toISOString().slice(0, 10);

  const [value, setValue] = useState(habit?.loggedToday ?? 0);
  const [mood, setMood] = useState<Mood | null>(moodByDate[today] ?? null);

  if (!habit || !habit.quantified) {
    return (
      <div className="flex flex-col gap-md items-start">
        <p className="font-bold text-xl text-text-primary">Habit not found</p>
        <p className="text-sm text-text-secondary">It may have already been deleted.</p>
      </div>
    );
  }

  const config = SLIDER_CONFIG[habit.quantified.unit];

  const handleSave = () => {
    logQuantifiedValue(habit.id, value);
    if (mood) setMoodForToday(mood);
    showToast(value >= habit.quantified!.targetValue ? "Target hit — nice work" : "Logged", "success");
    onDone();
  };

  return (
    <div className="flex flex-col gap-lg items-start w-full">
      <div className="flex items-center gap-md w-full">
        <div className="bg-accent-subtle rounded-md size-12 flex items-center justify-center shrink-0">
          <Icon name={habit.icon} className="text-accent" style={{ fontSize: 22 }} />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-bold text-xl text-text-primary">{habit.name}</p>
          <p className="text-sm text-text-secondary">How much today?</p>
        </div>
      </div>

      <CheckInSlider
        value={value}
        target={habit.quantified.targetValue}
        unit={habit.quantified.unit}
        min={config.min}
        max={config.max}
        step={config.step}
        onChange={setValue}
      />

      <div className="flex flex-col gap-sm items-start w-full">
        <p className="font-semibold text-sm text-text-primary">How's it going today?</p>
        <div className="flex gap-sm items-stretch w-full">
          {MOODS.map((m) => (
            <MoodTag key={m} mood={m} selected={mood === m} onClick={() => setMood(m)} />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="flex items-center justify-center gap-sm rounded-md font-semibold px-lg py-md text-md bg-accent hover:bg-accent-hover text-accent-on cursor-pointer w-full"
      >
        Save check-in
      </button>
    </div>
  );
}

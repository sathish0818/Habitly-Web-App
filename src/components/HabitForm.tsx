import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Frequency } from "../data/HabitsContext";
import Input from "./Input";
import Select from "./Select";
import IconSwatch from "./IconSwatch";
import Button from "./Button";
import Icon from "./Icon";

const ICON_OPTIONS = ["water_drop", "directions_run", "menu_book", "self_improvement", "local_cafe"];
const FREQUENCIES: Frequency[] = ["daily", "weekly", "custom"];
const REMINDER_OPTIONS = ["No reminder", "7:00 AM", "8:00 AM", "12:00 PM", "6:00 PM", "9:00 PM"];

export type HabitFormValues = {
  name: string;
  icon: string;
  frequency: Frequency;
  reminder: string | null;
};

type HabitFormProps = {
  mode: "add" | "edit";
  initialValues?: HabitFormValues;
  onSubmit: (values: HabitFormValues) => void;
};

export default function HabitForm({ mode, initialValues, onSubmit }: HabitFormProps) {
  const navigate = useNavigate();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [frequency, setFrequency] = useState<Frequency>(initialValues?.frequency ?? "daily");
  const [icon, setIcon] = useState(initialValues?.icon ?? ICON_OPTIONS[0]);
  const [reminder, setReminder] = useState(initialValues?.reminder ?? REMINDER_OPTIONS[0]);

  const isEdit = mode === "edit";

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      icon,
      frequency,
      reminder: reminder === "No reminder" ? null : reminder,
    });
  };

  return (
    <div className="flex gap-2xl p-2xl items-start w-full">
      <div className="flex flex-col gap-xl items-start flex-1 min-w-0">
        <div className="flex gap-sm items-start text-sm">
          <Link to="/habits" className="text-text-secondary hover:text-text-primary">Habits</Link>
          <span className="text-text-secondary">/</span>
          <span className="font-semibold text-text-primary">{isEdit ? "Edit habit" : "Add new"}</span>
        </div>

        <p className="font-bold text-2xl text-text-primary">{isEdit ? "Edit habit" : "Add a new habit"}</p>

        <div className="flex flex-col gap-sm items-start w-full">
          <p className="font-semibold text-sm text-text-primary">Name</p>
          <Input
            placeholder="Habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-sm items-start">
          <p className="font-semibold text-sm text-text-primary">Frequency</p>
          <div className="bg-surface-alt flex items-start p-xs rounded-md">
            {FREQUENCIES.map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setFrequency(freq)}
                className={`flex items-center justify-center px-md py-sm rounded-sm text-sm font-semibold capitalize cursor-pointer transition-colors ${
                  frequency === freq
                    ? "bg-surface text-accent shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-sm items-start">
          <p className="font-semibold text-sm text-text-primary">Icon</p>
          <div className="flex gap-sm items-start">
            {ICON_OPTIONS.map((opt) => (
              <IconSwatch key={opt} icon={opt} selected={icon === opt} onClick={() => setIcon(opt)} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-sm items-start w-full">
          <p className="font-semibold text-sm text-text-primary">Reminder (optional)</p>
          <Select value={reminder ?? "No reminder"} onChange={(e) => setReminder(e.target.value)}>
            {REMINDER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </div>

        <div className="flex gap-3 items-start">
          <Button size="md" variant="secondary" onClick={() => navigate("/habits")}>
            Cancel
          </Button>
          <Button size="md" variant="primary" onClick={handleSubmit} disabled={!name.trim()}>
            {isEdit ? "Save changes" : "Add habit"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-md items-center flex-1 min-w-0">
        <p className="font-semibold text-xs text-text-secondary">LIVE PREVIEW</p>
        <div className="bg-surface border border-border rounded-lg flex gap-md items-center p-md w-[360px]">
          <div className="bg-accent-subtle rounded-md size-12 flex items-center justify-center shrink-0">
            <Icon name={icon} className="text-accent" style={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <p className="font-semibold text-md text-text-primary truncate">{name || "New habit"}</p>
            <p className="text-xs text-text-secondary truncate">
              <span className="capitalize">{frequency}</span> ·{" "}
              {reminder === "No reminder" || !reminder ? "No reminder set" : `Reminder at ${reminder}`}
            </p>
          </div>
          <div className="bg-surface border-[1.5px] border-border rounded-sm size-6 shrink-0" />
        </div>
        <p className="text-sm text-text-secondary text-center w-[320px]">
          This is how your habit will appear in the list. Fill in the form to see it update.
        </p>
        <div className="bg-accent-subtle rounded-lg flex flex-col gap-3 items-start p-lg w-[360px]">
          <div className="flex gap-sm items-center text-accent">
            <Icon name="lightbulb" style={{ fontSize: 18 }} />
            <p className="font-semibold text-sm">Tip</p>
          </div>
          <p className="text-sm text-text-primary">
            Habits with a daily frequency and a reminder are 2x more likely to become a streak.
          </p>
        </div>
      </div>
    </div>
  );
}

import type { Mood } from "../data/MoodContext";

const MOOD_META: Record<Mood, { emoji: string; label: string }> = {
  great: { emoji: "🙂", label: "Great" },
  okay: { emoji: "😐", label: "Okay" },
  rough: { emoji: "😩", label: "Rough" },
};

type MoodTagProps = {
  mood: Mood;
  selected: boolean;
  onClick: () => void;
};

export default function MoodTag({ mood, selected, onClick }: MoodTagProps) {
  const meta = MOOD_META[mood];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-1.5 py-md rounded-md border flex-1 cursor-pointer transition-colors ${
        selected ? "border-accent bg-accent-subtle" : "border-border bg-surface hover:border-accent"
      }`}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{meta.emoji}</span>
      <span className={`text-xs font-semibold ${selected ? "text-accent" : "text-text-secondary"}`}>
        {meta.label}
      </span>
    </button>
  );
}

import { useState } from "react";
import { useHabits, MILESTONE_DAYS } from "../data/HabitsContext";
import { useToast } from "../data/ToastContext";
import ShareCard from "../components/ShareCard";
import Icon from "../components/Icon";

const MILESTONE_LABELS: Record<number, string> = {
  7: "1 week",
  30: "1 month",
  100: "Centurion",
};

export default function StreakShare() {
  const { habits, stats } = useHabits();
  const { showToast } = useToast();
  const [sharing, setSharing] = useState(false);

  const habitIcons = habits.map((h) => h.icon);
  const shareText = `🔥 ${stats.currentStreak}-day streak · ${stats.completionRate}% consistency on Habitly!`;

  const handleShare = async () => {
    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText, title: "My Habitly streak" });
      } else {
        await navigator.clipboard.writeText(shareText);
        showToast("Copied to clipboard", "success");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        showToast("Couldn't share — try again", "error");
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="flex flex-col gap-lg items-center pt-lg md:pt-2xl px-md md:px-2xl pb-2xl w-full">
      <div className="flex flex-col gap-1 items-center text-center w-full max-w-[420px]">
        <p className="font-bold text-xl md:text-2xl text-text-primary">Your streak, ready to share</p>
        <p className="text-sm text-text-secondary">A brandable snapshot of your momentum — not a screenshot.</p>
      </div>

      <ShareCard streak={stats.currentStreak} consistency={stats.completionRate} habitIcons={habitIcons} />

      <button
        type="button"
        onClick={handleShare}
        disabled={sharing}
        className="flex items-center justify-center gap-sm rounded-md font-semibold px-lg py-md text-md bg-accent hover:bg-accent-hover text-accent-on cursor-pointer disabled:opacity-60 w-full max-w-[360px]"
      >
        <Icon name="ios_share" style={{ fontSize: 18 }} />
        Share my streak
      </button>

      <div className="flex flex-col gap-md items-start w-full max-w-[420px]">
        <p className="font-semibold text-sm text-text-primary">Milestone badges</p>
        <div className="flex gap-md items-start w-full">
          {MILESTONE_DAYS.map((days) => {
            const earned = stats.currentStreak >= days;
            return (
              <div
                key={days}
                className={`flex flex-col items-center gap-1 p-md rounded-lg border flex-1 ${
                  earned ? "bg-accent-subtle border-accent" : "bg-surface-alt border-border opacity-60"
                }`}
              >
                <Icon
                  name="military_tech"
                  className={earned ? "text-accent" : "text-text-secondary"}
                  style={{ fontSize: 28 }}
                />
                <p className={`text-xs font-bold ${earned ? "text-accent" : "text-text-secondary"}`}>
                  {days} days
                </p>
                <p className="text-xs text-text-secondary">{MILESTONE_LABELS[days]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

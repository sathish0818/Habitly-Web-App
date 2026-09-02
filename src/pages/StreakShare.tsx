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

type StatTileProps = {
  icon: string;
  label: string;
  value: number;
  suffix?: string;
};

function StatTile({ icon, label, value, suffix }: StatTileProps) {
  return (
    <div className="bg-surface border border-border rounded-lg flex flex-col gap-md p-lg w-full">
      <div className="bg-accent-subtle rounded-md size-10 flex items-center justify-center">
        <Icon name={icon} className="text-accent" style={{ fontSize: 20 }} />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex gap-1 items-baseline">
          <p className="font-bold text-2xl text-text-primary">{value}</p>
          {suffix && <p className="text-sm text-text-secondary">{suffix}</p>}
        </div>
        <p className="text-xs text-text-secondary">{label}</p>
      </div>
    </div>
  );
}

export default function StreakShare() {
  const { habits, stats } = useHabits();
  const { showToast } = useToast();
  const [sharing, setSharing] = useState(false);

  const habitIcons = habits.map((h) => h.icon);
  const shareText = `🔥 ${stats.currentStreak}-day streak · ${stats.completionRate}% consistency on Habitly!`;

  const nextMilestone = MILESTONE_DAYS.find((d) => d > stats.currentStreak);
  const milestoneProgress = nextMilestone ? Math.min(100, Math.round((stats.currentStreak / nextMilestone) * 100)) : 100;

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
    <div className="pt-lg md:pt-2xl px-md md:px-2xl pb-2xl w-full">
      <div className="flex flex-col gap-1 items-start mb-lg">
        <p className="font-bold text-xl md:text-2xl text-text-primary">Your Streak</p>
        <p className="text-sm text-text-secondary">Track your momentum, and share it when you're proud of it.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-2xl items-center lg:items-start w-full">
        <div className="flex flex-col gap-lg items-center w-full lg:w-auto lg:shrink-0">
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
        </div>

        <div className="flex flex-col gap-lg items-start flex-1 min-w-0 w-full md:max-w-[820px]">
          <div className="flex flex-col gap-md items-start w-full">
            <p className="font-semibold text-sm text-text-primary">Your journey</p>
            <div className="grid grid-cols-2 gap-md w-full">
              <StatTile icon="local_fire_department" label="Current streak" value={stats.currentStreak} suffix="days" />
              <StatTile icon="emoji_events" label="Longest streak" value={stats.longestStreak} suffix="days" />
              <StatTile icon="trending_up" label="Completion rate" value={stats.completionRate} suffix="%" />
              <StatTile icon="check_circle" label="Total check-ins" value={stats.totalCheckIns} />
            </div>
          </div>

          <div className="bg-accent-subtle rounded-lg flex flex-col gap-md p-lg w-full">
            {nextMilestone ? (
              <>
                <div className="flex items-center justify-between w-full">
                  <p className="font-semibold text-sm text-text-primary">Next milestone</p>
                  <p className="text-sm font-bold text-accent">
                    {nextMilestone - stats.currentStreak} day{nextMilestone - stats.currentStreak === 1 ? "" : "s"} to go
                  </p>
                </div>
                <div className="bg-surface rounded-sm h-2 w-full overflow-hidden">
                  <div
                    className="bg-accent rounded-sm h-2 transition-all"
                    style={{ width: `${milestoneProgress}%` }}
                  />
                </div>
                <p className="text-xs text-text-secondary">
                  {milestoneProgress}% of the way to your {MILESTONE_LABELS[nextMilestone]} badge ({nextMilestone} days)
                </p>
              </>
            ) : (
              <div className="flex items-center gap-md">
                <Icon name="workspace_premium" className="text-accent" style={{ fontSize: 28 }} />
                <p className="text-sm font-semibold text-text-primary">
                  You've unlocked every milestone — legendary consistency.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-md items-start w-full">
            <p className="font-semibold text-sm text-text-primary">Milestone badges</p>
            <div className="flex gap-md items-start w-full">
              {MILESTONE_DAYS.map((days) => {
                const earned = stats.currentStreak >= days;
                return (
                  <div
                    key={days}
                    className={`flex flex-col items-center gap-1 p-md rounded-lg border flex-1 transition-shadow ${
                      earned ? "bg-accent-subtle border-accent shadow-sm" : "bg-surface-alt border-border opacity-60"
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
      </div>
    </div>
  );
}

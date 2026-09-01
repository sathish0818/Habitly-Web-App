import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "../data/HabitsContext";
import { useMood } from "../data/MoodContext";
import { computeHeatmap, computeMoodCorrelation } from "../lib/insights";
import TrendChart from "../components/TrendChart";
import CalendarHeatmap from "../components/CalendarHeatmap";
import Button from "../components/Button";
import Icon from "../components/Icon";

const HEATMAP_WEEKS = 16;

export default function StreakStats() {
  const { habits, stats } = useHabits();
  const { moodByDate } = useMood();
  const navigate = useNavigate();
  const ranked = [...habits].sort((a, b) => b.completionRate - a.completionRate);

  const heatmapDays = useMemo(() => computeHeatmap(habits, HEATMAP_WEEKS), [habits]);
  const correlation = useMemo(() => computeMoodCorrelation(habits, moodByDate), [habits, moodByDate]);

  const trend = stats.weeklyTrend;
  const lastWeek = trend[trend.length - 1] ?? 0;
  const prevWeek = trend[trend.length - 2] ?? 0;
  const firstWeek = trend[0] ?? 0;
  const vsLastWeek = lastWeek - prevWeek;
  const sinceWeekOne = lastWeek - firstWeek;
  const vsLastWeekLabel =
    vsLastWeek === 0 ? "Flat vs last week" : `${vsLastWeek > 0 ? "+" : ""}${vsLastWeek}% vs last week`;
  const sinceWeekOneLabel =
    sinceWeekOne === 0
      ? "Steady since week 1"
      : `${sinceWeekOne > 0 ? "Up" : "Down"} ${Math.abs(sinceWeekOne)} points since week 1${
          sinceWeekOne > 0 ? " — your most consistent stretch yet" : ""
        }`;
  const quarterLabel = `${sinceWeekOne >= 0 ? "+" : ""}${sinceWeekOne}% this quarter`;

  return (
    <div className="flex flex-col gap-lg items-start pt-lg md:pt-2xl px-md md:px-2xl w-full">
      <div className="flex items-center w-full">
        <p className="flex-1 font-bold text-xl md:text-2xl text-text-primary">Streak &amp; Stats</p>
        <Button size="sm" onClick={() => navigate("/add")}>
          + Add habit
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-lg flex flex-col sm:flex-row gap-lg sm:gap-xl sm:items-center p-lg w-full">
        <div className="flex flex-col gap-xs items-start shrink-0">
          <p className="text-sm text-text-secondary">Current streak</p>
          <div className="flex gap-sm items-center">
            <Icon name="local_fire_department" className="text-accent" style={{ fontSize: 40 }} />
            <div className="flex gap-1.5 items-baseline">
              <p className="font-bold text-3xl text-text-primary">{stats.currentStreak}</p>
              <p className="text-md text-text-secondary">days</p>
            </div>
          </div>
          <div
            className={`flex gap-xs items-center ${
              vsLastWeek >= 0 ? "text-success-text" : "text-error"
            }`}
          >
            <Icon name={vsLastWeek >= 0 ? "trending_up" : "trending_down"} style={{ fontSize: 14 }} />
            <span className="text-xs font-medium">{vsLastWeekLabel}</span>
          </div>
        </div>

        <div className="bg-border h-px w-full sm:h-14 sm:w-px shrink-0" />

        <div className="flex flex-1 flex-wrap items-center justify-between gap-lg sm:gap-2xl sm:pl-xl min-w-0">
          <div className="flex flex-col gap-xs items-start w-[45%] sm:w-[150px]">
            <p className="text-sm text-text-secondary">Longest streak</p>
            <div className="flex gap-0.5 items-baseline">
              <p className="font-semibold text-xl text-text-primary">{stats.longestStreak}</p>
              <p className="text-sm text-text-secondary">days</p>
            </div>
          </div>
          <div className="flex flex-col gap-xs items-start w-[45%] sm:w-[150px]">
            <p className="text-sm text-text-secondary">Completion rate</p>
            <div className="flex gap-0.5 items-baseline">
              <p className="font-semibold text-xl text-text-primary">{stats.completionRate}</p>
              <p className="text-sm text-text-secondary">%</p>
            </div>
          </div>
          <div className="flex flex-col gap-xs items-start w-[45%] sm:w-[150px]">
            <p className="text-sm text-text-secondary">Total check-ins</p>
            <p className="font-semibold text-xl text-text-primary">{stats.totalCheckIns}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg flex flex-col gap-5 items-start p-lg w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm w-full">
          <div className="flex flex-col gap-0.5 items-start">
            <p className="font-semibold text-md text-text-primary">Completion rate — last 10 weeks</p>
            <p className="text-xs text-text-secondary">{sinceWeekOneLabel}</p>
          </div>
          <div
            className={`flex gap-xs items-center px-sm py-xs rounded-sm shrink-0 self-start ${
              sinceWeekOne >= 0 ? "bg-success-text/10" : "bg-error/10"
            }`}
          >
            <Icon
              name={sinceWeekOne >= 0 ? "trending_up" : "trending_down"}
              className={sinceWeekOne >= 0 ? "text-success-text" : "text-error"}
              style={{ fontSize: 14 }}
            />
            <span className={`text-xs font-medium ${sinceWeekOne >= 0 ? "text-success-text" : "text-error"}`}>
              {quarterLabel}
            </span>
          </div>
        </div>
        <TrendChart data={trend} startLabel="10 wks ago" endLabel="This week" />
      </div>

      <div className="bg-surface border border-border rounded-lg flex flex-col gap-md items-start p-lg w-full">
        <div className="flex items-center justify-between w-full">
          <p className="font-semibold text-md text-text-primary">Consistency — last {HEATMAP_WEEKS} weeks</p>
          <div className="flex items-center gap-xs text-xs text-text-secondary">
            <span>Less</span>
            <span className="size-3 rounded-xs bg-surface-alt" />
            <span className="size-3 rounded-xs bg-accent-subtle" />
            <span className="size-3 rounded-xs bg-accent/60" />
            <span className="size-3 rounded-xs bg-accent" />
            <span>More</span>
          </div>
        </div>
        <CalendarHeatmap days={heatmapDays} />
      </div>

      <div className="bg-accent-subtle rounded-lg flex gap-md items-center p-lg w-full">
        <Icon name="insights" className="text-accent shrink-0" style={{ fontSize: 28 }} />
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-sm text-text-primary">Insight</p>
          {correlation ? (
            <p className="text-sm text-text-primary">
              You complete habits <span className="font-bold">{correlation.multiplier.toFixed(1)}x</span> more often on{" "}
              <span aria-hidden>🙂</span> days than on 😐/😩 days.
            </p>
          ) : (
            <p className="text-sm text-text-primary">
              Log your mood a few more times during check-ins to unlock this insight.
            </p>
          )}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg flex flex-col gap-md items-start p-lg w-full">
        <p className="font-semibold text-md text-text-primary">Habit breakdown</p>
        <div className="flex flex-col items-start w-full">
          {ranked.map((habit, i) => (
            <div
              key={habit.id}
              className={`flex gap-md items-center py-sm w-full ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <p className="text-sm font-medium text-text-secondary w-4 shrink-0">{i + 1}</p>
              <Icon name={habit.icon} className="text-accent shrink-0" style={{ fontSize: 20 }} />
              <p className="flex-1 min-w-0 text-sm font-medium text-text-primary truncate">{habit.name}</p>
              <div className="hidden sm:block bg-surface-alt rounded-sm h-1 w-[120px] shrink-0">
                <div
                  className="bg-accent rounded-sm h-1"
                  style={{ width: `${habit.completionRate}%` }}
                />
              </div>
              <p className="font-semibold text-md text-text-primary w-11 text-right shrink-0">{habit.completionRate}%</p>
              <p className="hidden sm:block text-xs text-text-secondary w-[90px] text-right shrink-0">{habit.streak} day streak</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

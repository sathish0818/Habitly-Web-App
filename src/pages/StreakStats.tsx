import { useNavigate } from "react-router-dom";
import { useHabits } from "../data/HabitsContext";
import TrendChart from "../components/TrendChart";
import Button from "../components/Button";
import Icon from "../components/Icon";

export default function StreakStats() {
  const { habits, stats } = useHabits();
  const navigate = useNavigate();
  const ranked = [...habits].sort((a, b) => b.completionRate - a.completionRate);

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
    <div className="flex flex-col gap-lg items-start pt-2xl px-2xl w-full">
      <div className="flex items-center w-full">
        <p className="flex-1 font-bold text-2xl text-text-primary">Streak &amp; Stats</p>
        <Button size="sm" onClick={() => navigate("/add")}>
          + Add habit
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-lg flex gap-xl items-center p-lg w-full">
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

        <div className="bg-border h-14 w-px shrink-0" />

        <div className="flex flex-1 items-center justify-between gap-2xl pl-xl min-w-0">
          <div className="flex flex-col gap-xs items-start w-[150px]">
            <p className="text-sm text-text-secondary">Longest streak</p>
            <div className="flex gap-0.5 items-baseline">
              <p className="font-semibold text-xl text-text-primary">{stats.longestStreak}</p>
              <p className="text-sm text-text-secondary">days</p>
            </div>
          </div>
          <div className="flex flex-col gap-xs items-start w-[150px]">
            <p className="text-sm text-text-secondary">Completion rate</p>
            <div className="flex gap-0.5 items-baseline">
              <p className="font-semibold text-xl text-text-primary">{stats.completionRate}</p>
              <p className="text-sm text-text-secondary">%</p>
            </div>
          </div>
          <div className="flex flex-col gap-xs items-start w-[150px]">
            <p className="text-sm text-text-secondary">Total check-ins</p>
            <p className="font-semibold text-xl text-text-primary">{stats.totalCheckIns}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg flex flex-col gap-5 items-start p-lg w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-0.5 items-start">
            <p className="font-semibold text-md text-text-primary">Completion rate — last 10 weeks</p>
            <p className="text-xs text-text-secondary">{sinceWeekOneLabel}</p>
          </div>
          <div
            className={`flex gap-xs items-center px-sm py-xs rounded-sm shrink-0 ${
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
        <p className="font-semibold text-md text-text-primary">Habit breakdown</p>
        <div className="flex flex-col items-start w-full">
          {ranked.map((habit, i) => (
            <div
              key={habit.id}
              className={`flex gap-md items-center py-sm w-full ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <p className="text-sm font-medium text-text-secondary w-4">{i + 1}</p>
              <Icon name={habit.icon} className="text-accent" style={{ fontSize: 20 }} />
              <p className="flex-1 min-w-0 text-sm font-medium text-text-primary truncate">{habit.name}</p>
              <div className="bg-surface-alt rounded-sm h-1 w-[120px] shrink-0">
                <div
                  className="bg-accent rounded-sm h-1"
                  style={{ width: `${habit.completionRate}%` }}
                />
              </div>
              <p className="font-semibold text-md text-text-primary w-11 text-right">{habit.completionRate}%</p>
              <p className="text-xs text-text-secondary w-[90px] text-right">{habit.streak} day streak</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

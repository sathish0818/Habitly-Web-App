import type { HeatmapDay } from "../lib/insights";

type CalendarHeatmapProps = {
  days: HeatmapDay[];
};

function colorClassFor(rate: number): string {
  if (rate <= 0) return "bg-surface-alt";
  if (rate < 0.34) return "bg-accent-subtle";
  if (rate < 0.67) return "bg-accent/60";
  return "bg-accent";
}

export default function CalendarHeatmap({ days }: CalendarHeatmapProps) {
  // pad the front so the grid starts on a Sunday column
  const firstDow = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const padded: (HeatmapDay | null)[] = [...Array(firstDow).fill(null), ...days];
  const weeks: (HeatmapDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  return (
    <div className="flex gap-1 items-start w-full overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1 shrink-0">
          {week.map((day, di) =>
            day ? (
              <div
                key={di}
                className={`size-3 rounded-xs ${colorClassFor(day.rate)}`}
                title={`${day.date} — ${Math.round(day.rate * 100)}% complete`}
              />
            ) : (
              <div key={di} className="size-3" />
            )
          )}
        </div>
      ))}
    </div>
  );
}

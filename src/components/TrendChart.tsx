type TrendChartProps = {
  data: number[];
  startLabel: string;
  endLabel: string;
};

const W = 1000;
const H = 140;
const ORIGIN_X = 40;
const TOP_PAD = 16;
const BOTTOM_PAD = 24;

export default function TrendChart({ data, startLabel, endLabel }: TrendChartProps) {
  const plotW = W - ORIGIN_X;
  const usableW = plotW - 16;
  const xAt = (i: number) => ORIGIN_X + 8 + i * (usableW / (data.length - 1));
  const yAt = (v: number) => H - (v / 100) * H;

  const linePoints = data.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
  const areaPoints = `${xAt(0)},${H} ${linePoints} ${xAt(data.length - 1)},${H}`;
  const last = data[data.length - 1];

  return (
    <div className="w-full">
      <svg
        viewBox={`0 ${-TOP_PAD} ${W} ${H + BOTTOM_PAD + TOP_PAD}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        {[0, 50, 100].map((pct) => (
          <g key={pct}>
            <line
              x1={ORIGIN_X}
              x2={W}
              y1={yAt(pct)}
              y2={yAt(pct)}
              stroke="var(--color-border)"
              strokeWidth={1}
              opacity={0.7}
            />
            <text x={0} y={yAt(pct) + 4} fontSize={11} fill="var(--color-text-secondary)">
              {pct}%
            </text>
          </g>
        ))}

        <polygon points={areaPoints} fill="var(--color-accent)" opacity={0.12} />
        <polyline
          points={linePoints}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((v, i) => (
          <circle
            key={i}
            cx={xAt(i)}
            cy={yAt(v)}
            r={i === data.length - 1 ? 6 : 4}
            fill={i === data.length - 1 ? "var(--color-accent)" : "var(--color-surface)"}
            stroke="var(--color-accent)"
            strokeWidth={2}
          />
        ))}
        <text x={xAt(data.length - 1) - 12} y={yAt(last) + 5} fontSize={14} fontWeight={700} fill="var(--color-accent)" textAnchor="end">
          {last}%
        </text>
        <text x={xAt(0)} y={H + 18} fontSize={11} fill="var(--color-text-secondary)">
          {startLabel}
        </text>
        <text x={xAt(data.length - 1)} y={H + 18} fontSize={11} fill="var(--color-text-secondary)" textAnchor="end">
          {endLabel}
        </text>
      </svg>
    </div>
  );
}

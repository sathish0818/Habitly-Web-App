import Icon from "./Icon";

type ShareCardProps = {
  streak: number;
  consistency: number;
  habitIcons: string[];
};

export default function ShareCard({ streak, consistency, habitIcons }: ShareCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg w-full aspect-[4/5] max-w-[360px] flex flex-col items-center justify-between gap-lg p-xl bg-gradient-to-br from-accent to-accent-hover text-accent-on">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0, transparent 40%)" }} />
      <div className="flex items-center gap-2">
        <div className="bg-surface rounded-full size-8 flex items-center justify-center">
          <Icon name="eco" className="text-accent" style={{ fontSize: 18 }} />
        </div>
        <p className="font-bold text-lg">Habitly</p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Icon name="local_fire_department" style={{ fontSize: 56 }} />
        <p className="font-bold text-[56px] leading-none">{streak}</p>
        <p className="text-sm font-semibold opacity-90">day streak</p>
      </div>

      {habitIcons.length > 0 && (
        <div className="flex items-center gap-2">
          {habitIcons.slice(0, 6).map((icon, i) => (
            <div key={i} className="bg-surface/20 rounded-md size-9 flex items-center justify-center">
              <Icon name={icon} style={{ fontSize: 18 }} />
            </div>
          ))}
        </div>
      )}

      <p className="text-sm font-semibold opacity-95 text-center">
        {streak}-day streak · {consistency}% consistency
      </p>
    </div>
  );
}

import Icon from "./Icon";

type IconSwatchProps = {
  icon: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function IconSwatch({ icon, selected = false, onClick }: IconSwatchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-md size-12 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
        selected
          ? "bg-accent-subtle border-2 border-accent"
          : "bg-surface border border-border hover:border-accent"
      }`}
    >
      <Icon
        name={icon}
        className={selected ? "text-accent" : "text-text-secondary"}
        style={{ fontSize: 20 }}
      />
    </button>
  );
}

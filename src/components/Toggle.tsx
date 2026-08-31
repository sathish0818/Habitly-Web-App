type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  "aria-label"?: string;
};

export default function Toggle({ checked, onChange, ...rest }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors cursor-pointer ${
        checked ? "bg-accent" : "bg-border"
      }`}
      {...rest}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-surface shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

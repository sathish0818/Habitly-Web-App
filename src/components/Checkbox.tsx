import Icon from "./Icon";

type CheckboxProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function Checkbox({ checked, onChange, disabled = false, ...rest }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative rounded-sm size-6 flex items-center justify-center shrink-0 transition-colors ${
        disabled
          ? "bg-surface-alt border-[1.5px] border-border opacity-60 cursor-not-allowed"
          : checked
            ? "bg-accent cursor-pointer"
            : "bg-surface border-[1.5px] border-border cursor-pointer hover:border-accent"
      }`}
      {...rest}
    >
      {checked && <Icon name="check" className="text-base text-accent-on" style={{ fontSize: 16 }} />}
    </button>
  );
}

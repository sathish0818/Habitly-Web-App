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
      className={`relative rounded-sm size-6 flex items-center justify-center shrink-0 transition-[background-color,border-color,transform] duration-150 active:scale-90 ${
        disabled
          ? "bg-surface-alt border-[1.5px] border-border opacity-60 cursor-not-allowed active:scale-100"
          : checked
            ? "bg-accent cursor-pointer"
            : "bg-surface border-[1.5px] border-border cursor-pointer hover:border-accent"
      }`}
      {...rest}
    >
      {checked && (
        <Icon
          key="check-icon"
          name="check"
          className="text-base text-accent-on animate-check-pop"
          style={{ fontSize: 16 }}
        />
      )}
    </button>
  );
}

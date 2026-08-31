import type { SelectHTMLAttributes } from "react";
import Icon from "./Icon";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

export default function Select({ error = false, className = "", children, ...rest }: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        className={`appearance-none bg-surface w-full pl-md pr-10 py-sm rounded-md text-sm text-text-primary outline-none transition-colors ${
          error
            ? "border border-error"
            : "border border-border focus:border-2 focus:border-accent"
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      <Icon
        name="expand_more"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
        style={{ fontSize: 18 }}
      />
    </div>
  );
}

import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export default function Input({ error = false, className = "", ...rest }: InputProps) {
  return (
    <input
      className={`bg-surface w-full px-md py-sm rounded-md text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors ${
        error
          ? "border border-error"
          : "border border-border focus:border-2 focus:border-accent"
      } ${className}`}
      {...rest}
    />
  );
}

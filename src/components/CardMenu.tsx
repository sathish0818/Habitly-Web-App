import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type CardMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function CardMenu({ onEdit, onDelete }: CardMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Habit options"
        aria-haspopup="menu"
        aria-expanded={open}
        className="size-7 rounded-sm flex items-center justify-center text-text-secondary hover:bg-surface-alt cursor-pointer"
      >
        <Icon name="more_vert" style={{ fontSize: 18 }} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-md shadow-lg py-xs z-10"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-sm px-md py-sm text-sm text-text-primary hover:bg-surface-alt cursor-pointer text-left"
          >
            <Icon name="edit" className="text-text-secondary" style={{ fontSize: 18 }} />
            Edit habit
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); onDelete(); }}
            className="w-full flex items-center gap-sm px-md py-sm text-sm text-error hover:bg-error-subtle cursor-pointer text-left"
          >
            <Icon name="delete" className="text-error" style={{ fontSize: 18 }} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

import Button from "./Button";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-text-primary/40 flex items-center justify-center z-50 px-lg" onClick={onCancel}>
      <div
        className="bg-surface rounded-lg p-lg w-[360px] max-w-full flex flex-col gap-md items-start"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <p className="font-semibold text-lg text-text-primary">{title}</p>
        <p className="text-sm text-text-secondary">{message}</p>
        <div className="flex gap-3 items-center w-full justify-end pt-sm">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center justify-center gap-sm rounded-md font-semibold px-md py-sm text-sm bg-error text-accent-on hover:opacity-90 cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

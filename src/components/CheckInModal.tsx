import CheckInForm from "./CheckInForm";
import Icon from "./Icon";

type CheckInModalProps = {
  habitId: string;
  onClose: () => void;
};

export default function CheckInModal({ habitId, onClose }: CheckInModalProps) {
  return (
    <div
      className="fixed inset-0 bg-text-primary/40 flex items-center justify-center z-50 px-md"
      onClick={onClose}
    >
      <div
        className="relative bg-surface rounded-lg shadow-lg flex flex-col gap-lg items-start px-xl py-2xl w-full max-w-[480px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-lg right-lg flex items-center justify-center size-8 rounded-sm text-text-secondary hover:bg-surface-alt hover:text-text-primary cursor-pointer"
        >
          <Icon name="close" style={{ fontSize: 20 }} />
        </button>

        <CheckInForm habitId={habitId} onDone={onClose} />
      </div>
    </div>
  );
}

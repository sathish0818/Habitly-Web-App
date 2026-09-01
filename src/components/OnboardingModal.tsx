import { useNavigate } from "react-router-dom";
import ProfileForm, { type ProfileFormValues } from "./ProfileForm";
import { useWellbeing } from "../data/WellbeingContext";
import { useToast } from "../data/ToastContext";
import Icon from "./Icon";

type OnboardingModalProps = {
  onClose: () => void;
};

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const { profile, saveProfile } = useWellbeing();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (values: ProfileFormValues) => {
    saveProfile(values);
    showToast("Profile saved", "success");
    onClose();
    navigate("/targets");
  };

  return (
    <div className="fixed inset-0 bg-text-primary/40 flex items-center justify-center z-50 px-md py-2xl overflow-y-auto" onClick={onClose}>
      <div
        className="relative bg-surface rounded-lg shadow-lg flex flex-col gap-lg items-start px-xl py-2xl w-full max-w-[480px] my-auto"
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

        <div className="flex flex-col gap-1 items-start pr-2xl">
          <p className="font-bold text-xl text-text-primary">Let's personalize your targets</p>
          <p className="text-sm text-text-secondary">
            A few quick details so we can suggest daily water, sleep, and step goals that actually fit you — not generic numbers.
          </p>
        </div>

        <ProfileForm initialValues={profile ?? undefined} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

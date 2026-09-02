import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm, { type ProfileFormValues } from "./ProfileForm";
import TargetsStep from "./TargetsStep";
import { useWellbeing } from "../data/WellbeingContext";
import { useToast } from "../data/ToastContext";
import Icon from "./Icon";

type OnboardingModalProps = {
  onClose: () => void;
};

type Step = "profile" | "targets";

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const { profile, saveProfile } = useWellbeing();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("profile");

  const handleProfileSubmit = (values: ProfileFormValues) => {
    saveProfile(values);
    showToast("Profile saved", "success");
    setStep("targets");
  };

  const handleTargetsDone = () => {
    onClose();
    navigate("/habits");
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

        <div className="flex items-center gap-sm">
          <span className={`text-xs font-semibold px-sm py-1 rounded-full ${step === "profile" ? "bg-accent-subtle text-accent" : "bg-surface-alt text-text-secondary"}`}>
            1. Profile
          </span>
          <Icon name="chevron_right" className="text-text-secondary" style={{ fontSize: 16 }} />
          <span className={`text-xs font-semibold px-sm py-1 rounded-full ${step === "targets" ? "bg-accent-subtle text-accent" : "bg-surface-alt text-text-secondary"}`}>
            2. Targets
          </span>
        </div>

        {step === "profile" ? (
          <>
            <div className="flex flex-col gap-1 items-start pr-2xl">
              <p className="font-bold text-xl text-text-primary">Let's personalize your targets</p>
              <p className="text-sm text-text-secondary">
                A few quick details so we can suggest daily water, sleep, and step goals that actually fit you — not generic numbers.
              </p>
            </div>

            <ProfileForm initialValues={profile ?? undefined} onSubmit={handleProfileSubmit} />
          </>
        ) : (
          <TargetsStep onDone={handleTargetsDone} onEditProfile={() => setStep("profile")} compact />
        )}
      </div>
    </div>
  );
}

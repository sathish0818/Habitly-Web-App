import { useNavigate } from "react-router-dom";
import ProfileForm, { type ProfileFormValues } from "../components/ProfileForm";
import { useWellbeing } from "../data/WellbeingContext";
import { useToast } from "../data/ToastContext";

export default function OnboardingProfile() {
  const { profile, saveProfile } = useWellbeing();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (values: ProfileFormValues) => {
    saveProfile(values);
    showToast("Profile saved — your personalized targets are next", "success");
    navigate("/habits");
  };

  return (
    <div className="bg-surface-alt flex items-center justify-center min-h-screen w-full px-md">
      <div className="bg-surface border border-border rounded-lg shadow-lg flex flex-col gap-lg items-start px-xl py-2xl w-full max-w-[480px]">
        <div className="flex flex-col gap-sm items-start w-full">
          <div className="flex gap-xs items-center w-full">
            <div className="h-1 flex-1 rounded-sm bg-accent" />
            <div className="h-1 flex-1 rounded-sm bg-border" />
          </div>
          <p className="text-xs font-semibold text-text-secondary">STEP 1 OF 2</p>
        </div>

        <div className="flex flex-col gap-1 items-start">
          <p className="font-bold text-xl text-text-primary">Let's personalize your targets</p>
          <p className="text-sm text-text-secondary">
            A few quick details so we can suggest daily water, sleep, and step goals that actually fit you — not generic numbers.
          </p>
        </div>

        <ProfileForm
          initialValues={profile ?? undefined}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

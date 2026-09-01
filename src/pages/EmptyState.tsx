import { useState } from "react";
import Icon from "../components/Icon";
import Button from "../components/Button";
import OnboardingModal from "../components/OnboardingModal";

export default function EmptyState() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div className="bg-surface flex flex-col items-center justify-center h-screen w-full px-lg">
      <div className="flex flex-col gap-lg items-center">
        <div className="bg-accent-subtle rounded-full size-24 flex items-center justify-center">
          <Icon name="eco" className="text-accent" style={{ fontSize: 32 }} />
        </div>
        <p className="font-bold text-2xl text-text-primary text-center">Start your first habit</p>
        <div className="text-md text-text-secondary text-center w-full max-w-[420px]">
          <p>Small, daily check-ins build habits that stick.</p>
          <p>Tell us a bit about you and we'll set your first habits up for you.</p>
        </div>
        <Button size="md" onClick={() => setShowOnboarding(true)}>
          + Start onboarding
        </Button>
      </div>

      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}

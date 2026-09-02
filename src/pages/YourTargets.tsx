import { useNavigate } from "react-router-dom";
import { useWellbeing } from "../data/WellbeingContext";
import TargetsStep from "../components/TargetsStep";
import Icon from "../components/Icon";

export default function YourTargets() {
  const { profile, loading } = useWellbeing();
  const navigate = useNavigate();

  if (loading) return null;

  if (!profile) {
    return (
      <div className="flex flex-col gap-lg items-start pt-lg md:pt-2xl px-md md:px-2xl pb-2xl w-full">
        <div className="flex flex-col gap-1 items-start">
          <p className="font-bold text-xl md:text-2xl text-text-primary">Targets</p>
          <p className="text-sm text-text-secondary">
            Personalized water, sleep, and step targets based on your body.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg flex flex-col gap-md items-start p-2xl w-full">
          <div className="bg-accent-subtle rounded-md size-11 flex items-center justify-center">
            <Icon name="track_changes" className="text-accent" style={{ fontSize: 22 }} />
          </div>
          <p className="font-semibold text-md text-text-primary">Let's set up your profile first</p>
          <p className="text-sm text-text-secondary">
            We need a few details about you — height, weight, age, and activity level — before we can suggest personalized targets.
          </p>
          <button
            type="button"
            onClick={() => navigate("/onboarding")}
            className="flex items-center justify-center gap-sm rounded-md font-semibold px-lg py-md text-md bg-accent hover:bg-accent-hover text-accent-on cursor-pointer"
          >
            Set up profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg items-start pt-lg md:pt-2xl px-md md:px-2xl pb-2xl w-full">
      <TargetsStep onDone={() => navigate("/habits")} onEditProfile={() => navigate("/onboarding")} />
    </div>
  );
}

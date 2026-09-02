import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import Icon from "../components/Icon";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../data/ToastContext";
import { useAuth } from "../data/AuthContext";
import { useHabits } from "../data/HabitsContext";
import { useWellbeing } from "../data/WellbeingContext";
import { useMood } from "../data/MoodContext";

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const { habits, clearAllHabits } = useHabits();
  const { profile: wellbeingProfile, unitSystem, setUnitSystem } = useWellbeing();
  const { moodByDate } = useMood();
  const [name, setName] = useState(user?.name ?? "Alex Kim");
  const [email, setEmail] = useState(user?.email ?? "alex@habitly.app");
  const [darkMode, setDarkMode] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = () => {
    logout();
    navigate("/signin");
  };

  const handleDeleteAccount = () => {
    setConfirmingDelete(false);
    clearAllHabits();
    logout();
    showToast("Account deleted", "success");
    navigate("/signin");
  };

  const handleUpgradeClick = () => {
    showToast("Pro plan is coming soon", "success");
  };

  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: { name: user?.name, email: user?.email },
      wellbeingProfile,
      unitSystem,
      habits,
      moodByDate,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `habitly-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Data exported", "success");
  };

  const commitName = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== user?.name) updateProfile({ name: trimmed });
  };

  const commitEmail = () => {
    const trimmed = email.trim();
    if (trimmed && trimmed !== user?.email) updateProfile({ email: trimmed });
  };

  const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file", "error");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      showToast("Image must be under 5MB", "error");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatarUrl: reader.result as string });
      showToast("Profile picture updated", "success");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-lg items-start pt-lg px-md md:px-2xl pb-2xl w-full">
      <p className="font-bold text-2xl text-text-primary">Settings</p>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,960px)_360px] gap-xl items-stretch w-full">
        <div className="flex flex-col gap-md items-start w-full">
          <p className="font-semibold text-lg text-text-primary">Profile</p>
          <div className="bg-surface border border-border rounded-lg flex flex-col gap-lg items-start px-lg py-[18px] w-full">
            <div className="flex items-center gap-md">
              <div className="bg-accent-subtle rounded-full size-16 flex items-center justify-center shrink-0 overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={name} className="size-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold text-accent">{initialsFor(name)}</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 items-start">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change photo
                </Button>
                <p className="text-xs text-text-secondary">JPG or PNG, up to 5MB.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelected}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-lg items-start w-full">
              <div className="flex flex-col gap-sm items-start flex-1 w-full">
                <p className="font-semibold text-sm text-text-primary">Name</p>
                <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={commitName} />
              </div>
              <div className="flex flex-col gap-sm items-start flex-1 w-full">
                <p className="font-semibold text-sm text-text-primary">Email</p>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={commitEmail} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-md items-start w-full h-full">
          <p className="hidden md:block invisible font-semibold text-lg" aria-hidden="true">
            Profile
          </p>
          <div className="bg-surface border border-border rounded-lg flex flex-col gap-3 items-start p-lg w-full flex-1">
            <div className="flex gap-sm items-center text-accent">
              <Icon name="workspace_premium" style={{ fontSize: 20 }} />
              <p className="font-semibold text-md">Free plan</p>
            </div>
            <p className="text-sm text-text-primary w-full">
              Unlimited habits and daily reminders. Upgrade for calendar history and yearly insights.
            </p>
            <button
              type="button"
              onClick={handleUpgradeClick}
              className="flex gap-1 items-center text-accent cursor-pointer hover:underline"
            >
              <span className="font-semibold text-sm">Upgrade to Pro</span>
              <Icon name="arrow_forward" style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-xl items-start w-full">
      <div className="flex flex-col gap-lg items-start w-full md:flex-1 md:min-w-0 md:max-w-[960px]">
        <div className="flex flex-col gap-md items-start w-full">
          <p className="font-semibold text-lg text-text-primary">Wellbeing profile</p>
          <div className="bg-surface border border-border rounded-lg flex items-center gap-md p-lg w-full">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <p className="font-semibold text-sm text-text-primary">
                {wellbeingProfile ? "Update your personalized targets" : "Set up personalized targets"}
              </p>
              <p className="text-xs text-text-secondary">
                {wellbeingProfile
                  ? "Height, weight, age, and activity level power your water/sleep/step suggestions."
                  : "Answer a few questions to get water, sleep, and step targets based on your body, not guesswork."}
              </p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={() => navigate("/onboarding")}>
              {wellbeingProfile ? "Edit" : "Set up"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-md items-start w-full">
          <p className="font-semibold text-lg text-text-primary">Preferences</p>
          <div className="bg-surface border border-border rounded-lg flex flex-col gap-lg items-start px-lg py-[18px] w-full">
            <div className="flex items-center w-full">
              <div className="flex flex-col gap-0.5 items-start flex-1">
                <p className="font-semibold text-sm text-text-primary">Dark mode</p>
                <p className="text-xs text-text-secondary">Use a darker color theme</p>
              </div>
              <Toggle checked={darkMode} onChange={setDarkMode} aria-label="Dark mode" />
            </div>
            <div className="flex items-center w-full">
              <div className="flex flex-col gap-0.5 items-start flex-1">
                <p className="font-semibold text-sm text-text-primary">Reminders</p>
                <p className="text-xs text-text-secondary">Get notified about upcoming habits</p>
              </div>
              <Toggle checked={reminders} onChange={setReminders} aria-label="Reminders" />
            </div>
            <div className="flex items-center w-full">
              <div className="flex flex-col gap-0.5 items-start flex-1">
                <p className="font-semibold text-sm text-text-primary">Weekly summary</p>
                <p className="text-xs text-text-secondary">Email recap every Sunday</p>
              </div>
              <Toggle checked={weeklySummary} onChange={setWeeklySummary} aria-label="Weekly summary" />
            </div>
            <div className="flex items-center w-full">
              <div className="flex flex-col gap-0.5 items-start flex-1">
                <p className="font-semibold text-sm text-text-primary">Units</p>
                <p className="text-xs text-text-secondary">Water shown in liters or fluid ounces</p>
              </div>
              <div className="bg-surface-alt flex items-start p-xs rounded-md shrink-0">
                {(["metric", "imperial"] as const).map((system) => (
                  <button
                    key={system}
                    type="button"
                    onClick={() => setUnitSystem(system)}
                    className={`flex items-center justify-center px-md py-sm rounded-sm text-sm font-semibold capitalize cursor-pointer transition-colors ${
                      unitSystem === system
                        ? "bg-surface text-accent shadow-sm"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {system}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-md items-start w-full">
          <p className="font-semibold text-lg text-text-primary">Data</p>
          <div className="bg-surface border border-border rounded-lg flex items-center gap-md p-lg w-full">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <p className="font-semibold text-sm text-text-primary">Export your data</p>
              <p className="text-xs text-text-secondary">Download all habits, targets, and check-ins as a JSON file.</p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={handleExportData}>
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-lg items-start w-full md:w-[360px] md:shrink-0">
        <div className="flex flex-col gap-md items-start w-full">
          <p className="font-semibold text-lg text-text-primary">Account</p>
          <div className="bg-surface border border-border rounded-lg flex flex-col gap-sm items-start px-lg py-[18px] w-full">
            <Button variant="secondary" size="md" onClick={handleSignOut}>
              Sign out
            </Button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="px-md py-2.5 font-semibold text-sm text-error cursor-pointer hover:underline"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete account?"
          message="This permanently deletes your account, all habits, and streak history. This can't be undone."
          confirmLabel="Delete account"
          onConfirm={handleDeleteAccount}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}

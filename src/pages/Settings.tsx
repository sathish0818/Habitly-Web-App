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

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const { clearAllHabits } = useHabits();
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

  const handleNameChange = (value: string) => {
    setName(value);
    updateProfile({ name: value });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    updateProfile({ email: value });
  };

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file", "error");
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
    <div className="flex gap-xl items-start pt-lg px-2xl w-full">
      <div className="flex flex-col gap-lg items-start w-[680px] shrink-0">
        <p className="font-bold text-2xl text-text-primary">Settings</p>

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
            <div className="flex gap-lg items-start w-full">
              <div className="flex flex-col gap-sm items-start flex-1">
                <p className="font-semibold text-sm text-text-primary">Name</p>
                <Input value={name} onChange={(e) => handleNameChange(e.target.value)} />
              </div>
              <div className="flex flex-col gap-sm items-start flex-1">
                <p className="font-semibold text-sm text-text-primary">Email</p>
                <Input type="email" value={email} onChange={(e) => handleEmailChange(e.target.value)} />
              </div>
            </div>
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
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-lg items-start flex-1 min-w-0 pt-[43px]">
        <div className="bg-surface border border-border rounded-lg flex flex-col gap-3 items-start p-lg w-[360px]">
          <div className="flex gap-sm items-center text-accent">
            <Icon name="workspace_premium" style={{ fontSize: 20 }} />
            <p className="font-semibold text-md">Free plan</p>
          </div>
          <p className="text-sm text-text-primary w-[320px]">
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

        <div className="flex flex-col gap-md items-start w-[360px]">
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

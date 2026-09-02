import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import { useAuth } from "../data/AuthContext";
import { useToast } from "../data/ToastContext";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    if (password !== confirm) {
      showToast("Passwords don't match", "error");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      showToast("Password updated", "success");
      navigate("/");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't update password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      heading="Set a new password"
      subtext="Choose a new password for your account."
      submitLabel="Update password"
      submitDisabled={!password || !confirm || loading}
      onSubmit={handleSubmit}
      showGoogle={false}
      footerPrefix="Changed your mind?"
      footerLinkText="Sign in"
      footerLinkTo="/signin"
    >
      <div className="flex flex-col gap-sm items-start w-full">
        <p className="font-semibold text-sm text-text-primary">New password</p>
        <Input
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
      </div>
      <div className="flex flex-col gap-sm items-start w-full">
        <p className="font-semibold text-sm text-text-primary">Confirm password</p>
        <Input
          type="password"
          placeholder="Re-enter password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
    </AuthCard>
  );
}

import { useState } from "react";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import { useAuth } from "../data/AuthContext";
import { useToast } from "../data/ToastContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { requestPasswordReset } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
      showToast("Check your email for a reset link", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't send reset email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      heading="Reset your password"
      subtext={
        sent
          ? "Check your inbox for a link to set a new password."
          : "Enter your email and we'll send you a link to set a new password."
      }
      submitLabel={sent ? "Resend email" : "Send reset link"}
      submitDisabled={!email.trim() || loading}
      onSubmit={handleSubmit}
      showGoogle={false}
      footerPrefix="Remembered it?"
      footerLinkText="Sign in"
      footerLinkTo="/signin"
    >
      <div className="flex flex-col gap-sm items-start w-full">
        <p className="font-semibold text-sm text-text-primary">Email</p>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </div>
    </AuthCard>
  );
}

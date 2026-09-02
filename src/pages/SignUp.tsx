import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import { useAuth } from "../data/AuthContext";
import { useToast } from "../data/ToastContext";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, loginWithGoogleIdToken } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password) return;
    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    setLoading(true);
    try {
      const { needsEmailConfirmation } = await signup(name.trim(), email.trim(), password);
      if (needsEmailConfirmation) {
        showToast("Account created — check your email to confirm, then sign in.", "success");
        navigate("/signin");
      } else {
        navigate("/");
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Sign up failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (idToken: string) => {
    setGoogleLoading(true);
    try {
      await loginWithGoogleIdToken(idToken);
      navigate("/");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Google sign-in failed", "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthCard
      heading="Create your account"
      subtext="Start building better habits today."
      submitLabel="Create account"
      submitDisabled={!name.trim() || !email.trim() || !password || loading}
      onSubmit={handleSubmit}
      onGoogleCredential={handleGoogleCredential}
      googleLoading={googleLoading}
      footerPrefix="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/signin"
    >
      <div className="flex flex-col gap-sm items-start w-full">
        <p className="font-semibold text-sm text-text-primary">Name</p>
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="flex flex-col gap-sm items-start w-full">
        <p className="font-semibold text-sm text-text-primary">Email</p>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-sm items-start w-full">
        <p className="font-semibold text-sm text-text-primary">Password</p>
        <Input
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </AuthCard>
  );
}

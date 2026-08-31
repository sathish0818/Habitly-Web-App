import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import { useAuth } from "../data/AuthContext";
import { useToast } from "../data/ToastContext";
import { signInWithGoogle } from "../lib/google";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = () => {
    if (!email.trim() || !password) return;
    login(email.trim());
    navigate("/");
  };

  const handleGoogle = async () => {
    try {
      const profile = await signInWithGoogle();
      loginWithGoogle(profile);
      navigate("/");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Google sign-in failed", "error");
    }
  };

  return (
    <AuthCard
      heading="Welcome back"
      subtext="Sign in to keep your streak going."
      submitLabel="Sign in"
      submitDisabled={!email.trim() || !password}
      onSubmit={handleSubmit}
      onGoogle={handleGoogle}
      footerPrefix="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/signup"
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
      <div className="flex flex-col gap-sm items-start w-full">
        <p className="font-semibold text-sm text-text-primary">Password</p>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </AuthCard>
  );
}

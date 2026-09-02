import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import { useAuth } from "../data/AuthContext";
import { useToast } from "../data/ToastContext";
import { signInWithGoogle } from "../lib/google";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !password) return;
    signup(name.trim(), email.trim());
    navigate("/");
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const profile = await signInWithGoogle();
      loginWithGoogle(profile);
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
      submitDisabled={!name.trim() || !email.trim() || !password}
      onSubmit={handleSubmit}
      onGoogle={handleGoogle}
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
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </AuthCard>
  );
}

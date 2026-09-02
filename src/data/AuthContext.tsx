import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "./ToastContext";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

type Profile = { name: string; avatar_url: string | null };

function userFromSession(session: Session, profile: Profile | null): User {
  const email = session.user.email ?? "";
  const metadataName = (session.user.user_metadata?.name as string | undefined) ?? "";
  const metadataAvatar = session.user.user_metadata?.avatar_url as string | undefined;
  return {
    id: session.user.id,
    email,
    name: profile?.name || metadataName || email.split("@")[0] || "there",
    avatarUrl: profile?.avatar_url ?? metadataAvatar,
  };
}

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  loginWithGoogleIdToken: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, "name" | "avatarUrl">>) => Promise<boolean>;
  updateEmail: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrateFromSession = async (session: Session | null) => {
    if (!session) {
      setUser(null);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", session.user.id)
      .maybeSingle();
    setUser(userFromSession(session, profile));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      hydrateFromSession(session).finally(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrateFromSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw new Error(error.message);
    return { needsEmailConfirmation: !data.session };
  };

  const loginWithGoogleIdToken = async (idToken: string) => {
    const { error } = await supabase.auth.signInWithIdToken({ provider: "google", token: idToken });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Pick<User, "name" | "avatarUrl">>) => {
    if (!user) return false;
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    const patch: Record<string, unknown> = {};
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.avatarUrl !== undefined) patch.avatar_url = updates.avatarUrl;
    const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
    if (error) {
      showToast("Couldn't save your profile — try again.", "error");
      return false;
    }
    return true;
  };

  const updateEmail = async (email: string) => {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Check your inbox to confirm the new email address.", "success");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, loginWithGoogleIdToken, logout, updateProfile, updateEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
};

const STORAGE_KEY = "habitly.user";

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(" ");
}

type AuthContextValue = {
  user: User | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  loginWithGoogle: (profile: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, "name" | "email" | "avatarUrl">>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string) => {
    setUser({ name: nameFromEmail(email), email });
  };

  const signup = (name: string, email: string) => {
    setUser({ name, email });
  };

  const loginWithGoogle = (profile: User) => {
    setUser(profile);
  };

  const logout = () => setUser(null);

  const updateProfile = (updates: Partial<Pick<User, "name" | "email" | "avatarUrl">>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

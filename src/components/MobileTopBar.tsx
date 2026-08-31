import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../data/AuthContext";

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function MobileTopBar() {
  const { user } = useAuth();
  const displayName = user?.name ?? "Alex Kim";

  return (
    <header className="md:hidden flex items-center justify-between px-lg py-md bg-surface border-b border-border">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Habitly" className="h-8 w-7 max-w-none object-cover" />
        <p className="font-bold text-md text-text-primary">Habitly</p>
      </div>
      <Link
        to="/settings"
        className="bg-accent-subtle rounded-full size-8 flex items-center justify-center overflow-hidden shrink-0"
        aria-label="Settings"
      >
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={displayName} className="size-full object-cover" />
        ) : (
          <span className="text-xs font-semibold text-accent">{initialsFor(displayName)}</span>
        )}
      </Link>
    </header>
  );
}

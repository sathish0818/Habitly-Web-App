import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import logo from "../assets/logo.png";
import { useAuth } from "../data/AuthContext";

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

type NavItemDef = {
  to: string;
  icon: string;
  label: string;
};

const NAV_ITEMS: NavItemDef[] = [
  { to: "/stats", icon: "bar_chart", label: "Stats" },
  { to: "/habits", icon: "task_alt", label: "Habits" },
  { to: "/targets", icon: "track_changes", label: "Targets" },
  { to: "/streak", icon: "local_fire_department", label: "Streak" },
  { to: "/settings", icon: "settings", label: "Settings" },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const EASE = "transition-all duration-200 ease-in-out";

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const displayName = user?.name ?? "Alex Kim";
  const displayEmail = user?.email ?? "alex@habitly.app";

  return (
    <aside
      className={`hidden md:flex h-screen shrink-0 bg-surface border-r border-border flex-col gap-xs pt-xl pb-lg px-lg ${EASE} ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div className="flex items-center gap-2.5 w-full">
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 cursor-pointer"
        >
          <img src={logo} alt="Habitly" className="h-11 w-10 max-w-none object-cover" />
        </button>
        <p
          className={`font-bold text-lg text-text-primary truncate overflow-hidden whitespace-nowrap ${EASE} ${
            collapsed ? "max-w-0 opacity-0" : "flex-1 min-w-0 max-w-[160px] opacity-100"
          }`}
        >
          Habitly
        </p>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Collapse sidebar"
          aria-hidden={collapsed}
          tabIndex={collapsed ? -1 : 0}
          className={`bg-surface-alt rounded-sm flex items-center justify-center shrink-0 cursor-pointer hover:bg-border/40 overflow-hidden ${EASE} ${
            collapsed ? "size-0 opacity-0" : "size-6 opacity-100"
          }`}
        >
          <Icon name="chevron_left" className="text-sm text-text-secondary" />
        </button>
      </div>

      <div className="h-7 w-px shrink-0" />

      <nav className="flex flex-col gap-xs w-full">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 rounded-sm transition-colors ${
                isActive
                  ? "bg-accent-subtle text-accent"
                  : "text-text-secondary hover:bg-surface-alt"
              }`
            }
          >
            <span className="flex items-center justify-center h-11 w-10 shrink-0">
              <Icon name={item.icon} className="text-xl" />
            </span>
            <span
              className={`text-sm font-semibold truncate overflow-hidden whitespace-nowrap ${EASE} ${
                collapsed ? "max-w-0 opacity-0" : "flex-1 min-w-0 max-w-[160px] opacity-100"
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      <div className={`bg-border h-px ${EASE} ${collapsed ? "w-10" : "w-full"}`} />

      <div className="flex items-center gap-2.5 pt-3">
        <div className="bg-accent-subtle rounded-full size-9 flex items-center justify-center shrink-0 overflow-hidden">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={displayName} className="size-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-accent">{initialsFor(displayName)}</span>
          )}
        </div>
        <div
          className={`flex flex-col gap-0.5 overflow-hidden ${EASE} ${
            collapsed ? "max-w-0 opacity-0" : "min-w-0 max-w-[160px] opacity-100"
          }`}
        >
          <p className="text-sm font-semibold text-text-primary truncate whitespace-nowrap">{displayName}</p>
          <p className="text-xs text-text-secondary truncate whitespace-nowrap">{displayEmail}</p>
        </div>
      </div>
    </aside>
  );
}

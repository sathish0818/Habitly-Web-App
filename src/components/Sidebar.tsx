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
  { to: "/settings", icon: "settings", label: "Settings" },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const displayName = user?.name ?? "Alex Kim";
  const displayEmail = user?.email ?? "alex@habitly.app";

  return (
    <aside
      className={`hidden md:flex h-screen shrink-0 bg-surface border-r border-border flex-col gap-xs pt-xl pb-lg px-lg transition-[width] duration-150 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {collapsed ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Expand sidebar"
          className="shrink-0 cursor-pointer"
        >
          <img src={logo} alt="Habitly" className="h-11 w-10 max-w-none object-cover" />
        </button>
      ) : (
        <div className="flex items-center gap-2.5 w-full">
          <img src={logo} alt="Habitly" className="h-11 w-10 max-w-none object-cover shrink-0" />
          <p className="flex-1 min-w-0 font-bold text-lg text-text-primary truncate">Habitly</p>
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="bg-surface-alt rounded-sm size-6 flex items-center justify-center shrink-0 cursor-pointer hover:bg-border/40"
          >
            <Icon name="chevron_left" className="text-sm text-text-secondary" />
          </button>
        </div>
      )}

      <div className="h-7 w-px shrink-0" />

      <nav className="flex flex-col gap-xs w-full">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-sm transition-colors ${
                collapsed ? "justify-center h-11 w-10" : "h-11 w-full px-3 py-2.5"
              } ${
                isActive
                  ? "bg-accent-subtle text-accent"
                  : "text-text-secondary hover:bg-surface-alt"
              }`
            }
          >
            <Icon name={item.icon} className="text-xl" />
            {!collapsed && (
              <span className="flex-1 min-w-0 text-sm font-semibold truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      <div className={`bg-border ${collapsed ? "h-px w-10" : "h-px w-full"}`} />

      <div className={`flex items-center gap-2.5 pt-3 ${collapsed ? "justify-center" : ""}`}>
        <div className="bg-accent-subtle rounded-full size-9 flex items-center justify-center shrink-0 overflow-hidden">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={displayName} className="size-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-accent">{initialsFor(displayName)}</span>
          )}
        </div>
        {!collapsed && (
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{displayName}</p>
            <p className="text-xs text-text-secondary truncate">{displayEmail}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

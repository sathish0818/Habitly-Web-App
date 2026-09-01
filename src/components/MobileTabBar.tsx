import { NavLink } from "react-router-dom";
import Icon from "./Icon";

const NAV_ITEMS = [
  { to: "/stats", icon: "bar_chart", label: "Stats" },
  { to: "/habits", icon: "task_alt", label: "Habits" },
  { to: "/targets", icon: "track_changes", label: "Targets" },
  { to: "/share", icon: "ios_share", label: "Share" },
  { to: "/settings", icon: "settings", label: "Settings" },
];

export default function MobileTabBar() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-border flex items-stretch z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-sm ${
              isActive ? "text-accent" : "text-text-secondary"
            }`
          }
        >
          <Icon name={item.icon} style={{ fontSize: 22 }} />
          <span className="text-xs font-semibold">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

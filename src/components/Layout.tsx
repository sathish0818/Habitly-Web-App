import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSidebar } from "../data/SidebarContext";

export default function Layout({ children }: { children?: ReactNode }) {
  const { collapsed, toggle } = useSidebar();

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <main className="flex-1 min-w-0">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}

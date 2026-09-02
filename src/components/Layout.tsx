import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileTopBar from "./MobileTopBar";
import MobileTabBar from "./MobileTabBar";
import { useSidebar } from "../data/SidebarContext";

export default function Layout({ children }: { children?: ReactNode }) {
  const { collapsed, toggle } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-alt">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex-1 min-w-0 min-h-0 flex flex-col">
        <MobileTopBar />
        <main className="flex-1 min-w-0 min-h-0 w-full max-w-[1440px] 2xl:max-w-[1680px] mx-auto overflow-y-auto pb-20 md:pb-0">
          {children ?? <Outlet />}
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}

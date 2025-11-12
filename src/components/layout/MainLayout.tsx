// MainLayout.tsx
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { useSidebar } from "@/contexts/SidebarContext";

function Shell({ children, onLoginSuccess }: any) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* animate padding-left */}
      <div
        className={collapsed ? "lg:pl-16" : "lg:pl-64"}
        style={{ transition: "padding-left 250ms ease-in-out" }}
      >
        <Header onLoginSuccess={onLoginSuccess} />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

interface MainLayoutProps { children: ReactNode; onLoginSuccess?: (userData: any) => void; }

export function MainLayout({ children, onLoginSuccess }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <Shell onLoginSuccess={onLoginSuccess}>{children}</Shell>
    </SidebarProvider>
  );
}

// src/contexts/SidebarContext.tsx
import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";

type Ctx = { collapsed: boolean; toggle: () => void; set: (v: boolean) => void };
const SidebarCtx = createContext<Ctx | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const v = localStorage.getItem("sidebarCollapsed");
    return v === "1";
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const value = useMemo(
    () => ({ collapsed, toggle: () => setCollapsed(v => !v), set: setCollapsed }),
    [collapsed]
  );
  return <SidebarCtx.Provider value={value}>{children}</SidebarCtx.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarCtx);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

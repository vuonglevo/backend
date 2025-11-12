// src/components/layout/AdminLayout.tsx
import { ReactNode } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex">
      {/* Sidebar cố định */}
      <AdminSidebar />

      {/* Content chính */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header cố định */}
        <AdminHeader />

        {/* Main content */}
        <main className="p-6 pt-20 flex-1 animate-fade-in">{children}</main>
      </div>
    </div>
  );
};

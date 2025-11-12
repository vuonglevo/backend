import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Settings,
  BookOpen,
} from "lucide-react";

const navigation = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Học viên", href: "/adminStu", icon: GraduationCap },
  { name: "Giảng viên", href: "/adminFac", icon: Users },
  { name: "Thông báo cho học viên", href: "/adminNot", icon: BookOpen },
  { name: "Tài liệu", href: "/adminDoc", icon: FileText },
  { name: "Cài đặt", href: "/settings", icon: Settings },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border animate-slide-in">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <GraduationCap className="h-8 w-8 text-sidebar-primary" />
          <div className="ml-3">
            <h1 className="text-lg font-bold text-sidebar-foreground">
              Sau đại học
            </h1>
            <p className="text-xs text-sidebar-foreground/70">
              Hệ thống quản lý
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 px-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
              <span className="text-xs font-medium text-sidebar-primary">
                QT
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Quản trị viên
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                admin@university.edu.vn
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

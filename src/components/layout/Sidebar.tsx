// Sidebar.tsx
import { Home, User, FileText, Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { notificationAPI } from "@/api/Api";
import { useSidebar } from "@/contexts/SidebarContext";

const navigation = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Hồ sơ cá nhân", href: "/profile", icon: User },
  { name: "Tài liệu", href: "/documents", icon: FileText },
  { name: "Tài liệu giảng viên gửi", href: "/teacherdocument", icon: FileText },
  { name: "Thông báo", href: "/notifications", icon: Bell },
];

export function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const navigate = useNavigate();
  const { collapsed } = useSidebar();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await notificationAPI.getAll();
        const list = res?.data ?? [];
        if (mounted) setUnreadCount(list.filter((n: any) => n.unread).length);
      } catch {}
    };
    load();
    const t = setInterval(load, 30000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  const handleClick = (href: string) => {
    if (!user) return toast.error("❌ Vui lòng đăng nhập để truy cập tính năng này!");
    navigate(href);
  };

  const IconWithBadge = ({ Icon, showBadge }: { Icon: any; showBadge: boolean }) => (
    <span className="relative inline-flex items-center">
      <Icon className="h-5 w-5" />
      {showBadge && unreadCount > 0 && (
        <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1.5 rounded-full bg-red-600 text-white text-[10px] leading-[18px] text-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </span>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border
        ${collapsed ? "lg:w-16" : "lg:w-64"} transition-[width] duration-250 ease-in-out`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-sidebar-accent">
            <h1
              className={`text-xl font-bold text-sidebar-primary-foreground
              transition-opacity duration-200 ${collapsed ? "opacity-0" : "opacity-100"}`}
            >
              Quản lý Sau ĐH
            </h1>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isNotif = item.href === "/notifications";
              return (
                <button
                  key={item.name}
                  onClick={() => handleClick(item.href)}
                  className="group flex items-center w-full gap-3 px-3 py-3 text-sm font-medium rounded-lg
                             text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                             transition-colors"
                  title={collapsed ? item.name : undefined}
                >
                  <IconWithBadge Icon={item.icon} showBadge={isNotif} />
                  <span
                    className={`truncate transition-[opacity,margin] duration-200
                    ${collapsed ? "opacity-0 -ml-2 pointer-events-none" : "opacity-100 ml-0"}`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <div className="flex flex-col h-full">
            <div className="flex items-center h-16 px-6 bg-sidebar-accent">
              <h1 className="text-xl font-bold text-sidebar-primary-foreground">Quản lý Sau ĐH</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleClick(item.href)}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

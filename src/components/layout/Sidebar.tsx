import { Home, User, FileText, Bell, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // hoặc thư viện toast bạn đang dùng

const navigation = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Hồ sơ cá nhân", href: "/profile", icon: User },
  { name: "Tài liệu", href: "/documents", icon: FileText },
  { name: "Thông báo", href: "/notifications", icon: Bell },
];

export function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleClick = (href: string) => {
    if (!user) {
      toast.error("❌ Vui lòng đăng nhập để truy cập tính năng này!");
      return;
    }
    navigate(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-6 bg-sidebar-accent">
            <h1 className="text-xl font-bold text-sidebar-primary-foreground">
              Quản lý Sau ĐH
            </h1>
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
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <div className="flex flex-col h-full">
            <div className="flex items-center h-16 px-6 bg-sidebar-accent">
              <h1 className="text-xl font-bold text-sidebar-primary-foreground">
                Quản lý Sau ĐH
              </h1>
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

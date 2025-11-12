import { useState, useEffect } from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authAPI } from "@/api/Api";
import AuthDialog from "@/pages/user/AuthDialog";
interface HeaderProps {
  onLoginSuccess?: (user: { name: string; email: string; avatar?: string }) => void;
}
export function Header({ onLoginSuccess }: HeaderProps) {
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogout = async () => {
    await authAPI.logout();
    setUser(null);
    window.location.reload();
  };
  const handleLoginSuccess = (userData: { name: string; email: string; avatar?: string }) => {
    setUser(userData);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Placeholder hoặc logo bên trái */}
        <div className="flex items-center flex-1 gap-4">
          <span className="font-bold text-lg">MyApp</span>
        </div>

        {/* User + Notification lùi về bên phải */}
        <div className="flex items-center gap-4 ml-auto">
          {user && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
          )}

          {!user ? (
            <>
              <Button onClick={() => setShowAuthDialog(true)}>Đăng nhập</Button>
              <AuthDialog
                open={showAuthDialog}
                onClose={() => setShowAuthDialog(false)}
                onLoginSuccess={(userData) => {
                  setUser(userData);
                  onLoginSuccess?.(userData); // gọi callback Dashboard
                }}
              />
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Thông tin cá nhân
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

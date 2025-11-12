import { Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/api/Api";
import { useState } from "react";

export const AdminHeader = ({ onSearch }: { onSearch?: (q: string) => void }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [query, setQuery] = useState("");

  const handleLogout = async () => {
    await authAPI.logout();
    window.location.href = "/";
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value); // 🔥 gọi callback mỗi khi người dùng nhập
  };

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm học viên, giảng viên, tài liệu..."
            className="pl-10 bg-background"
            value={query}
            onChange={handleSearch}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
          </Button>

          <div className="flex items-center gap-2">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "Avatar"}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-white">
                {user.name?.[0] || "U"}
              </div>
            )}
            <span className="text-sm font-medium">{user.name || "User"}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// AdminFaculty.tsx
import { useQuery } from "@tanstack/react-query";
import { Paginated, Teacher, teacherAPI } from "@/api/Api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Plus } from "lucide-react";

const AdminFaculty = () => {
  const { data, isLoading, isError, error } = useQuery<Paginated<Teacher>>({
    queryKey: ["teachers"],
    queryFn: async () => (await teacherAPI.getAll({ page: 1, limit: 20 })).data,
    staleTime: 60_000,
  });

  const list = data?.items ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý giảng viên</h1>
          <p className="text-muted-foreground mt-1">
            Danh sách giảng viên hướng dẫn sau đại học
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm giảng viên
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Đang tải...</p>}
      {isError && (
        <p className="text-sm text-red-600">
          {(error as any)?.response?.data?.message || "Tải danh sách thất bại"}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {list.map((m) => (
          <Card key={m._id} className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {(m.name || "")
                      .split(" ")
                      .map((s) => s[0])
                      .join("")
                      .slice(-3)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{m.name}</CardTitle>
                  {m.title && (
                    <p className="text-sm text-muted-foreground mt-1">{m.title}</p>
                  )}
                  {m.department && (
                    <Badge variant="secondary" className="mt-2">
                      {m.department}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{m.email}</span>
              </div>
              {m.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{m.phone}</span>
                </div>
              )}
              <div className="pt-3 border-t"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminFaculty;

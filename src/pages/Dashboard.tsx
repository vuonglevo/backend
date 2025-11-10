import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Tài liệu đã nộp",
      value: "12",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Chờ duyệt",
      value: "3",
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Đã duyệt",
      value: "8",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Cần bổ sung",
      value: "1",
      icon: AlertCircle,
      color: "text-destructive",
    },
  ];

  const recentNotifications = [
    {
      id: 1,
      title: "Thông báo nộp hồ sơ học kỳ mới",
      time: "2 giờ trước",
      unread: true,
    },
    {
      id: 2,
      title: "Hồ sơ đăng ký học phần đã được duyệt",
      time: "1 ngày trước",
      unread: true,
    },
    {
      id: 3,
      title: "Cập nhật quy định mới về luận văn tốt nghiệp",
      time: "3 ngày trước",
      unread: false,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              NV
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Xin chào, Nguyễn Văn A
            </h1>
            <p className="text-muted-foreground">
              Chào mừng bạn quay trở lại hệ thống quản lý sau đại học
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Thông báo mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {notification.title}
                      </p>
                      {notification.unread && (
                        <Badge variant="default" className="h-5 px-2">
                          Mới
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin học vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã sinh viên:</span>
                <span className="font-medium">20241234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chuyên ngành:</span>
                <span className="font-medium">Công nghệ thông tin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Khóa:</span>
                <span className="font-medium">2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                <Badge variant="default" className="bg-success">
                  Đang học
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tiến độ học tập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tín chỉ đã hoàn thành:</span>
                <span className="font-medium">12/30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Điểm trung bình:</span>
                <span className="font-medium">3.45/4.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Học kỳ hiện tại:</span>
                <span className="font-medium">2/2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tiến độ:</span>
                <Badge variant="default" className="bg-info">
                  Đúng tiến độ
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

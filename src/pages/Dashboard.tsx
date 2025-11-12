"use client";
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, AlertCircle, Check } from "lucide-react";
import { dashboardAPI } from "@/api/Api";

export default function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [studyProgress, setStudyProgress] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.get();
      const data = res.data;
      if (!data) throw new Error("Không có dữ liệu");

      setUser(data.user || null);
      setStats([
        { title: "Tài liệu", value: data.stats?.totalDocs || 0, icon: FileText, color: "text-primary" },
        { title: "Chờ duyệt", value: data.stats?.pendingDocs || 0, icon: Clock, color: "text-warning" },
        { title: "Đã duyệt", value: data.stats?.approvedDocs || 0, icon: CheckCircle, color: "text-success" },
        { title: "Cần bổ sung", value: data.stats?.rejectedDocs || 0, icon: AlertCircle, color: "text-destructive" },
      ]);
      setStudyProgress(data.studyProgress || null);
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Lỗi lấy dashboard:", err);
      setUser(null);
      setStats([]);
      setStudyProgress(null);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);
  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    fetchDashboard(); // gọi fetch dashboard ngay sau login
  };
  if (loading) return <div>Đang tải...</div>;

  return (
    <MainLayout onLoginSuccess={handleLoginSuccess}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {user?.name ? user.name[0] : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Xin chào, {user?.name || "Người dùng"}
            </h1>
            <p className="text-muted-foreground">
              Chào mừng bạn quay trở lại hệ thống quản lý sau đại học
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(stat => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Thông báo mới</CardTitle>
            <button
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
              className="text-sm text-primary flex items-center gap-1"
            >
              <Check size={16} /> Đánh dấu tất cả
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification._id || notification.id}
                    className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{notification.title}</p>
                        {notification.unread && <Badge variant="default" className="h-5 px-2">Mới</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(notification.createdAt || Date.now()).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center">Không có thông báo</p>
              )}
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
                <span className="font-medium">{user?.studentId || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chuyên ngành:</span>
                <span className="font-medium">{user?.major || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Khóa:</span>
                <span className="font-medium">{user?.course || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                <Badge variant="default" className="bg-success">Đang học</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tiến độ học tập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {studyProgress ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tín chỉ đã hoàn thành:</span>
                    <span className="font-medium">{studyProgress.creditsCompleted}/{studyProgress.totalCredits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Điểm trung bình:</span>
                    <span className="font-medium">{studyProgress.gpa}/4.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Học kỳ hiện tại:</span>
                    <span className="font-medium">{studyProgress.currentSemester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tiến độ:</span>
                    <Badge variant="default" className="bg-info">{studyProgress.status}</Badge>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Không có dữ liệu tiến độ học tập</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

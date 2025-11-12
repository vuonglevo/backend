// src/pages/admin/AdminDashboard.tsx
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/Dashboard/StatCard";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { AdminLayout } from "./AdminLayout";
import { FileText, Users, BookOpen } from "lucide-react";
import { api } from "@/api/Api"; // instance axios đã setup token
import { AdminDashboardData } from "@/api/Api";

const fetchAdminDashboard = async (): Promise<AdminDashboardData> => {
  const res = await api.get<AdminDashboardData>("/admin/dashboard");
  if (!res.data) throw new Error("Chưa nhận được dữ liệu từ server");
  return res.data;
};

const AdminDashboard = () => {
  const { data, isLoading, isError, error } = useQuery<AdminDashboardData, Error>({
    queryKey: ["adminDashboard"],
    queryFn: fetchAdminDashboard,
    retry: 1, // retry 1 lần khi lỗi mạng
  });

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (isError) {
    console.error("Dashboard error:", error);
    return <div>Lỗi tải dữ liệu: {error?.message}</div>;
  }

  // fallback stats & notifications nếu chưa load xong hoặc data null
  const stats = data?.stats || {
    totalDocs: 0,
    pendingDocs: 0,
    approvedDocs: 0,
    rejectedDocs: 0,
    totalUsers: 0,
    activeUsers: 0,
  };
  const notifications = data?.notifications || [];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold">Tổng quan</h1>
        <p className="text-muted-foreground mt-1">
          Chào mừng đến với hệ thống quản lý Sau đại học
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <StatCard
          title="Tổng số tài liệu"
          value={stats.totalDocs.toString()}
          change={`Đang chờ duyệt: ${stats.pendingDocs}`}
          icon={FileText}
          trend="up"
        />
        <StatCard
          title="Tài liệu đã duyệt"
          value={stats.approvedDocs.toString()}
          change=""
          icon={BookOpen}
          trend="up"
        />
        <StatCard
          title="Tài liệu bị từ chối"
          value={stats.rejectedDocs.toString()}
          change=""
          icon={FileText}
          trend="down"
        />
        <StatCard
          title="Tổng số Học viên"
          value={`${stats.totalUsers} `}
          change=""
          icon={Users}
          trend="up"
        />
      </div>

      {/* Recent Notifications */}
      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <RecentActivity notifications={notifications} />

        <div className="space-y-6">
          <div className="rounded-lg gradient-primary p-6 text-white shadow-elegant">
            <h3 className="text-lg font-semibold mb-2">Thông báo quan trọng</h3>
            <p className="text-sm text-white/90">
              Hạn nộp luận văn học kỳ 2 năm học 2024-2025 là ngày 30/11/2024. Vui lòng hoàn
              thành và nộp đúng hạn.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

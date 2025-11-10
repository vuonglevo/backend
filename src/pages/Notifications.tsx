import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, AlertCircle, Info, Trash2 } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "info",
      title: "Thông báo nộp hồ sơ học kỳ mới",
      content:
        "Sinh viên vui lòng nộp hồ sơ đăng ký học phần học kỳ 2/2024 trước ngày 30/01/2024. Hồ sơ bao gồm: đơn đăng ký, giấy xác nhận nộp học phí.",
      time: "2 giờ trước",
      unread: true,
    },
    {
      id: 2,
      type: "success",
      title: "Hồ sơ đăng ký học phần đã được duyệt",
      content:
        "Hồ sơ đăng ký học phần học kỳ 1/2024 của bạn đã được phê duyệt. Vui lòng kiểm tra lịch học trên hệ thống.",
      time: "1 ngày trước",
      unread: true,
    },
    {
      id: 3,
      type: "warning",
      title: "Yêu cầu bổ sung tài liệu",
      content:
        "Giấy xác nhận nộp học phí của bạn cần được bổ sung thêm chữ ký và đóng dấu. Vui lòng nộp lại trước ngày 25/01/2024.",
      time: "2 ngày trước",
      unread: false,
    },
    {
      id: 4,
      type: "info",
      title: "Cập nhật quy định mới về luận văn tốt nghiệp",
      content:
        "Trường đã cập nhật quy định mới về quy trình bảo vệ luận văn tốt nghiệp. Vui lòng tham khảo tài liệu hướng dẫn chi tiết trên website.",
      time: "3 ngày trước",
      unread: false,
    },
    {
      id: 5,
      type: "info",
      title: "Thông báo lịch thi cuối kỳ",
      content:
        "Lịch thi cuối kỳ học kỳ 1/2024 đã được công bố. Sinh viên vui lòng kiểm tra và chuẩn bị tốt cho kỳ thi.",
      time: "5 ngày trước",
      unread: false,
    },
    {
      id: 6,
      type: "success",
      title: "Đã duyệt đề cương luận văn",
      content:
        "Đề cương luận văn của bạn đã được hội đồng phê duyệt. Bạn có thể bắt đầu thực hiện nghiên cứu theo kế hoạch đã đề ra.",
      time: "1 tuần trước",
      unread: false,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-success";
      case "warning":
        return "border-l-warning";
      default:
        return "border-l-info";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Thông báo</h1>
            <p className="text-muted-foreground mt-1">
              Bạn có {notifications.filter((n) => n.unread).length} thông báo chưa đọc
            </p>
          </div>
          <Button variant="outline">Đánh dấu tất cả đã đọc</Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-l-4 ${getTypeColor(notification.type)} ${
                notification.unread ? "bg-accent/50" : ""
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        {notification.title}
                        {notification.unread && (
                          <Badge variant="default" className="h-5 px-2">
                            Mới
                          </Badge>
                        )}
                      </h3>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {notification.content}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Chi tiết
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (hidden when there are notifications) */}
        {notifications.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Chưa có thông báo
              </h3>
              <p className="text-sm text-muted-foreground">
                Các thông báo mới sẽ xuất hiện tại đây
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

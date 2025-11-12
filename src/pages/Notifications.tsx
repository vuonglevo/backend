import { useEffect, useState } from "react";
import axios from "axios";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, AlertCircle, Info, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { notificationAPI, Notification } from "@/api/Api";



export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ------------------- Fetch notifications -------------------
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationAPI.getAll();
      setNotifications(res.data || []);
      } catch (err) {
      console.error(err);
      toast.error("Không thể tải thông báo");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ------------------- Mark all read -------------------
  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      toast.success("Đã đánh dấu tất cả đã đọc");
    } catch (err) {
      console.error(err);
      toast.error("Không thể đánh dấu tất cả đã đọc");
    }
  };

  // ------------------- Delete notification -------------------
  const handleDelete = async (id: string) => {
    try {
      await notificationAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Xóa thông báo thành công");
    } catch (err) {
      console.error(err);
      toast.error("Xóa thông báo thất bại");
    }
  };

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
              Bạn có {(notifications || []).filter((n) => n.unread).length} thông báo chưa đọc
            </p>
          </div>
          <Button variant="outline" onClick={handleMarkAllRead}>
            Đánh dấu tất cả đã đọc
          </Button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <p>Đang tải thông báo...</p>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification._id}
                className={`border-l-4 ${getTypeColor(notification.type)} ${notification.unread ? "bg-accent/50" : ""
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
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{notification.content}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(notification._id)}
                        >
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
        ) : (
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Clock } from "lucide-react";

interface NotificationItem {
    _id: string;
    title: string;
    content?: string;
    createdAt: string;
    userIds?: { _id: string; name?: string; email?: string }[]; // trùng với backend
}

interface RecentActivityProps {
    notifications: NotificationItem[];
}

export const RecentActivity = ({ notifications }: RecentActivityProps) => {

    const items = notifications || [];

    return (
        <Card className="shadow-card">
            <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
        <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có hoạt động nào</p>
          ) : (
            items.map((noti) => (
              <div
                key={noti._id}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                    {noti.userIds?.[0]?.name?.[0] || noti.title[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {noti.userIds?.length ? (
                      <span className="font-semibold">
                        {noti.userIds.map(u => u.name).join(", ")}
                      </span>
                    ) : null}{" "}
                    {noti.title}
                  </p>
                  {noti.content && (
                    <p className="text-xs text-muted-foreground">{noti.content}</p>
                  )}
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(noti.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
      `}</style>
        </Card>
    );
};

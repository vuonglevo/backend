// src/pages/TeacherDocuments.tsx
import { useEffect, useMemo, useState } from "react";
import { documentAPI } from "@/api/Api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Doc = {
  _id: string; name: string; type?: string; fileUrl: string;
  status: "pending" | "approved" | "rejected"; statusText?: string; content?: string;
  uploadedBy?: { _id: string; name?: string; email?: string; role?: string } | null;
};

export default function DocumentsTeacher() {
  const [loading, setLoading] = useState(true);
  const [teacherDocs, setTeacherDocs] = useState<Doc[]>([]);

  const fetchTeacherDocs = async () => {
    setLoading(true);
    try {
      const res = await documentAPI.getGrouped();
      setTeacherDocs(res.data?.fromTeachers || []);
    } catch {
      toast.error("Không thể tải tài liệu giảng viên");
      setTeacherDocs([]);
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchTeacherDocs(); }, []);

  const counts = useMemo(() => ({
    total: teacherDocs.length,
    approved: teacherDocs.filter(d => d.status === "approved").length,
    pending: teacherDocs.filter(d => d.status === "pending").length,
    rejected: teacherDocs.filter(d => d.status === "rejected").length,
  }), [teacherDocs]);

  const Stat = ({ title, value, icon: Icon }: { title: string; value: number; icon: any }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </CardContent>
    </Card>
  );

  const getStatusBadge = (s: string) =>
    s === "approved" ? <Badge className="bg-green-500 gap-1"><CheckCircle className="h-3 w-3" />Đã duyệt</Badge> :
    s === "pending"  ? <Badge className="bg-yellow-400 gap-1"><Clock className="h-3 w-3" />Chờ duyệt</Badge> :
                       <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Cần bổ sung</Badge>;

  const handleDownload = async (id: string, name: string) => {
    try {
      const res = await documentAPI.download(id);
      const blob = new Blob([res.data]); const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
    } catch { toast.error("Tải file thất bại"); }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tài liệu giảng viên đã gửi cho tôi</h1>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Stat title="Tổng" value={counts.total} icon={FileText} />
          <Stat title="Đã duyệt" value={counts.approved} icon={CheckCircle} />
          <Stat title="Chờ duyệt" value={counts.pending} icon={Clock} />
          <Stat title="Cần bổ sung" value={counts.rejected} icon={XCircle} />
        </div>

        <Card>
          <CardHeader><CardTitle>Danh sách</CardTitle></CardHeader>
          <CardContent>
            {loading ? <p>Đang tải dữ liệu...</p> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên tài liệu</TableHead>
                    <TableHead>Người gửi</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherDocs.map(doc => (
                    <TableRow key={doc._id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>
                        {doc.uploadedBy?.name || "Giảng viên"}
                        {doc.uploadedBy?.email ? ` (${doc.uploadedBy.email})` : ""}
                      </TableCell>
                      <TableCell>{doc.type }</TableCell>                      
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(doc._id, doc.name)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {teacherDocs.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">Chưa có tài liệu</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

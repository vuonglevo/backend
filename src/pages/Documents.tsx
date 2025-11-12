// src/pages/MyDocuments.tsx
import { useEffect, useMemo, useState } from "react";
import { documentAPI } from "@/api/Api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

type Doc = {
  _id: string; name: string; type?: string; fileUrl: string;
  status: "pending" | "approved" | "rejected"; statusText?: string;
};

export default function Documents() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [myDocs, setMyDocs] = useState<Doc[]>([]);

  const fetchMyDocs = async () => {
    setLoading(true);
    try {
      const res = await documentAPI.getGrouped();
      setMyDocs(res.data?.mine || []);
    } catch (e) {
      toast.error("Không thể tải danh sách tài liệu");
      setMyDocs([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchMyDocs(); }, []);

  const counts = useMemo(() => ({
    total: myDocs.length,
    approved: myDocs.filter(d => d.status === "approved").length,
    pending: myDocs.filter(d => d.status === "pending").length,
  }), [myDocs]);

  const getStatusBadge = (s: string) =>
    s === "approved" ? <Badge className="bg-green-500 gap-1"><CheckCircle className="h-3 w-3" />Đã duyệt</Badge> :
    s === "pending"  ? <Badge className="bg-yellow-400 gap-1"><Clock className="h-3 w-3" />Chờ duyệt</Badge> :
                       <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Cần bổ sung</Badge>;

  const handleUpload = async () => {
    if (!file) return toast.error("Vui lòng chọn file!");
    const fd = new FormData(); fd.append("file", file); fd.append("type", "Khác");
    try {
      await documentAPI.upload(fd);
      toast.success("Tải lên thành công");
      setOpen(false); setFile(null);
      fetchMyDocs();
    } catch (e) {
      toast.error("Tải lên thất bại");
    }
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      const res = await documentAPI.download(id);
      const blob = new Blob([res.data]); const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
    } catch { toast.error("Tải file thất bại"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc muốn xóa?")) return;
    try {
      await documentAPI.delete(id);
      setMyDocs(prev => prev.filter(d => d._id !== id));
      toast.success("Đã xóa");
    } catch { toast.error("Xóa thất bại"); }
  };

  const Stat = ({ title, value, icon: Icon }: any) => (
    <Card><CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div><p className="text-sm text-muted-foreground">{title}</p><p className="text-3xl font-bold mt-2">{value}</p></div>
        <Icon className="h-8 w-8 text-primary" />
      </div>
    </CardContent></Card>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Tài liệu của tôi</h1>
          <Button className="gap-2" onClick={() => setOpen(true)}><Upload className="h-4 w-4" />Nộp tài liệu mới</Button>
        </div>

        {open && (
          <div className="p-4 border rounded-md bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">Tải lên tài liệu</h2>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="mt-3 flex gap-2">
              <Button onClick={handleUpload}>Xác nhận</Button>
              <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Stat title="Tổng" value={counts.total} icon={FileText} />
          <Stat title="Đã duyệt" value={counts.approved} icon={CheckCircle} />
          <Stat title="Chờ duyệt" value={counts.pending} icon={Clock} />
        </div>

        <Card>
          <CardHeader><CardTitle>Danh sách tài liệu tôi đã nộp</CardTitle></CardHeader>
          <CardContent>
            {loading ? <p>Đang tải...</p> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên tài liệu</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myDocs.map(doc => (
                    <TableRow key={doc._id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.type || "Khác"}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleDownload(doc._id, doc.name)}><Download className="h-4 w-4" /></Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(doc._id)}><XCircle className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {myDocs.length === 0 && !loading && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Chưa có tài liệu</TableCell></TableRow>
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

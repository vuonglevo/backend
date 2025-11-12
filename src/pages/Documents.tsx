import { useEffect, useState } from "react";
import { documentAPI } from "@/api/Api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Download, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Documents() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("Khác");
  const [open, setOpen] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await documentAPI.getAll();
      setDocuments(Array.isArray(res.data) ? res.data : []); // ✅ luôn là []
    } catch (err) {
      toast.error("Không thể tải danh sách tài liệu");
      console.error(err);
      setDocuments([]); // ✅ fallback khi lỗi
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchDocuments();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 gap-1">
            <CheckCircle className="h-3 w-3" />
            Đã duyệt
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-400 gap-1">
            <Clock className="h-3 w-3" />
            Chờ duyệt
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Cần bổ sung
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Vui lòng chọn file!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      await documentAPI.upload(formData);
      toast.success("Tải lên thành công!");
      setOpen(false);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      toast.error("Tải lên thất bại!");
    }
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      const res = await documentAPI.download(id);
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Tải file thất bại");
      console.error(err);
    }
  };

  // ✅ Thêm hàm xóa tài liệu
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tài liệu này?")) return;

    try {
      await documentAPI.delete(id); // gọi API xóa
      toast.success("Xóa tài liệu thành công!");
      setDocuments((prev) => prev.filter((d) => d._id !== id)); // cập nhật table
    } catch (err) {
      toast.error("Xóa tài liệu thất bại!");
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">Quản lý tài liệu</h1>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Upload className="h-4 w-4" />
            Nộp tài liệu mới
          </Button>
        </div>

        {open && (
          <div className="p-4 border rounded-md bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">Tải lên tài liệu</h2>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            
            <div className="mt-3 flex gap-2">
              <Button onClick={handleUpload}>Xác nhận</Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng số tài liệu</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{documents.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Đã duyệt</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {documents.filter((d) => d.status === "approved").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {documents.filter((d) => d.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách tài liệu</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : (
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
                  {documents.map((doc) => (
                    <TableRow key={doc._id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(doc._id, doc.name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {/* Nút xóa */}
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(doc._id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

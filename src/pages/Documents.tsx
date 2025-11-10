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
import { Upload, Download, Eye, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

export default function Documents() {
  const documents = [
    {
      id: 1,
      name: "Đơn đăng ký học phần HK1/2024",
      type: "Đơn đăng ký",
      uploadDate: "15/01/2024",
      status: "approved",
      statusText: "Đã duyệt",
    },
    {
      id: 2,
      name: "Kế hoạch nghiên cứu luận văn",
      type: "Kế hoạch",
      uploadDate: "20/01/2024",
      status: "pending",
      statusText: "Chờ duyệt",
    },
    {
      id: 3,
      name: "Bản sao bằng đại học",
      type: "Chứng chỉ",
      uploadDate: "10/01/2024",
      status: "approved",
      statusText: "Đã duyệt",
    },
    {
      id: 4,
      name: "Giấy xác nhận nộp học phí",
      type: "Chứng từ",
      uploadDate: "25/01/2024",
      status: "rejected",
      statusText: "Cần bổ sung",
    },
    {
      id: 5,
      name: "Đề cương luận văn",
      type: "Đề cương",
      uploadDate: "28/01/2024",
      status: "pending",
      statusText: "Chờ duyệt",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success gap-1">
            <CheckCircle className="h-3 w-3" />
            Đã duyệt
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning gap-1">
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">Quản lý tài liệu</h1>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Nộp tài liệu mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tổng số tài liệu
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">12</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Đã duyệt
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">8</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Chờ duyệt
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">3</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tài liệu</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upload Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn nộp tài liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Định dạng file chấp nhận: PDF, DOC, DOCX (dung lượng tối đa 10MB)</p>
            <p>• Đặt tên file rõ ràng, bao gồm loại tài liệu và ngày tháng</p>
            <p>• Đảm bảo tài liệu được scan rõ ràng, không bị mờ hoặc thiếu trang</p>
            <p>• Thời gian xử lý: 3-5 ngày làm việc kể từ ngày nộp</p>
            <p>• Liên hệ phòng Đào tạo sau đại học nếu cần hỗ trợ: sdt@university.edu.vn</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

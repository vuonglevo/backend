import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminStudentAPI } from "@/api/Api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const AdminStudent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newStudent, setNewStudent] = useState({ name: "", email: "", studentId: "", program: "", course: "" });
  const queryClient = useQueryClient();

  // ------------------ Lấy danh sách ------------------
  const { data: students = [], isLoading, refetch } = useQuery({
    queryKey: ["adminStudents", searchQuery],
    queryFn: () => adminStudentAPI.getAll(searchQuery).then((res) => res.data),
  });

  // ------------------ Thêm học viên ------------------
  const addMutation = useMutation({
    mutationFn: () => adminStudentAPI.create(newStudent),
    onSuccess: () => {
      toast.success("Thêm học viên thành công");
      setNewStudent({ name: "", email: "", studentId: "", program: "", course: "" });
      queryClient.invalidateQueries({ queryKey: ["adminStudents"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Thêm thất bại"),
  });

  // ------------------ Xóa học viên ------------------
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminStudentAPI.delete(id),
    onSuccess: () => {
      toast.success("Xóa học viên thành công");
      queryClient.invalidateQueries({ queryKey: ["adminStudents"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Xóa thất bại"),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý học viên</h1>
          <p className="text-muted-foreground mt-1">
            Danh sách và thông tin học viên sau đại học
          </p>
        </div>

        {/* Modal Thêm học viên */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm học viên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm học viên mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <Input
                placeholder="Họ và tên"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              />
              <Input
                placeholder="Mã sinh viên"
                value={newStudent.studentId}
                onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
              />
              <Input
                placeholder="Chương trình"
                value={newStudent.program}
                onChange={(e) => setNewStudent({ ...newStudent, program: e.target.value })}
              />
              <Input
                placeholder="Niên khóa"
                value={newStudent.course}
                onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
              />
              <Button
                onClick={() => addMutation.mutate()}
                className="w-full mt-2 bg-blue-600 text-white"
              >
                Thêm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card danh sách học viên */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách học viên</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Đang tải...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã SV</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Chương trình</TableHead>
                  <TableHead>Niên khóa</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell>{student.program}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>
                      <Badge variant={student.isActive ? "default" : "secondary"}>
                        {student.isActive ? "Đang học" : "Nghỉ học"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteMutation.mutate(student._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStudent;

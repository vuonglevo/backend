import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Plus } from "lucide-react";

const faculty = [
  {
    id: 1,
    name: "TS. Nguyễn Văn A",
    title: "Phó Giáo sư",
    department: "Khoa Công nghệ Thông tin",
    email: "nguyenvana@university.edu.vn",
    phone: "024.1234.5678",
    students: 12,
    initials: "NVA",
  },
  {
    id: 2,
    name: "TS. Trần Thị B",
    title: "Tiến sĩ",
    department: "Khoa Khoa học Máy tính",
    email: "tranthib@university.edu.vn",
    phone: "024.1234.5679",
    students: 8,
    initials: "TTB",
  },
  {
    id: 3,
    name: "PGS.TS. Lê Văn C",
    title: "Phó Giáo sư",
    department: "Khoa Trí tuệ Nhân tạo",
    email: "levanc@university.edu.vn",
    phone: "024.1234.5680",
    students: 15,
    initials: "LVC",
  },
  {
    id: 4,
    name: "TS. Phạm Thị D",
    title: "Tiến sĩ",
    department: "Khoa An toàn Thông tin",
    email: "phamthid@university.edu.vn",
    phone: "024.1234.5681",
    students: 10,
    initials: "PTD",
  },
];

const AdminFaculty = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý giảng viên</h1>
          <p className="text-muted-foreground mt-1">
            Danh sách giảng viên hướng dẫn sau đại học
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm giảng viên
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {faculty.map((member) => (
          <Card key={member.id} className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {member.title}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {member.department}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{member.phone}</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Hướng dẫn:{" "}
                  <span className="font-semibold text-foreground">
                    {member.students} học viên
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminFaculty;

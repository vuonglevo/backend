import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";

export default function Profile() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Hồ sơ cá nhân</h1>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  NV
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Nguyễn Văn A
                  </h2>
                  <p className="text-muted-foreground">Học viên cao học</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>nguyenvana@example.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>0123 456 789</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>15/03/1995</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Hà Nội, Việt Nam</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Họ và tên</Label>
                <Input id="fullname" value="Nguyễn Văn A" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-id">Mã sinh viên</Label>
                <Input id="student-id" value="20241234" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Ngày sinh</Label>
                <Input id="dob" type="date" value="1995-03-15" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Input id="gender" value="Nam" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Quốc tịch</Label>
                <Input id="nationality" value="Việt Nam" readOnly />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value="nguyenvana@example.com" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" type="tel" value="0123 456 789" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ thường trú</Label>
                <Textarea
                  id="address"
                  value="123 Đường ABC, Quận XYZ, Hà Nội"
                  readOnly
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-address">Địa chỉ tạm trú</Label>
                <Textarea
                  id="current-address"
                  value="456 Đường DEF, Quận UVW, Hà Nội"
                  readOnly
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin học vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="program">Chương trình đào tạo</Label>
                <Input id="program" value="Thạc sĩ Công nghệ thông tin" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Chuyên ngành</Label>
                <Input id="major" value="Khoa học máy tính" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Khóa học</Label>
                <Input id="course" value="2024" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advisor">Giáo viên hướng dẫn</Label>
                <Input id="advisor" value="TS. Trần Thị B" readOnly />
              </div>
            </CardContent>
          </Card>

          {/* Education Background */}
          <Card>
            <CardHeader>
              <CardTitle>Trình độ học vấn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bachelor">Đại học</Label>
                <Input
                  id="bachelor"
                  value="ĐH Bách Khoa Hà Nội - CNTT"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bachelor-year">Năm tốt nghiệp</Label>
                <Input id="bachelor-year" value="2020" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bachelor-gpa">Điểm trung bình</Label>
                <Input id="bachelor-gpa" value="3.5/4.0" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="english">Trình độ tiếng Anh</Label>
                <Input id="english" value="IELTS 7.0" readOnly />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

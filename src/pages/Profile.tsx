import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Calendar, Edit, X, Save } from "lucide-react";
import { authAPI } from "@/api/Api";

export default function Profile() {
  const defaultForm = {
    name: "",
    studentId: "",
    dob: "",
    gender: "",
    nationality: "",
    email: "",
    phone: "",
    permanentAddress: "",
    temporaryAddress: "",
    program: "",
    major: "",
    course: "",
    advisor: "",
    bachelor: "",
    bachelorYear: "",
    bachelorGPA: "",
    englishLevel: "",
    avatar: "",
    role: "Học viên",
  };
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAPI.getProfile();
        const userData = res.data.user;
  
        // Chỉ ghi đè các field không null/undefined
        const mergedUser = { ...defaultForm, ...form, ...userData };
        setUser(mergedUser);
        setForm(mergedUser);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);
  


  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  
  
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await authAPI.updateProfile(form, token!);
      const updatedUser = res.data.user;
  
      // Merge dữ liệu: ưu tiên giữ các field trong form hiện tại nếu backend không trả
      const mergedUser = { ...user, ...form, ...updatedUser };
  
      setUser(mergedUser);
      setForm(mergedUser);
  
      localStorage.setItem("user", JSON.stringify(mergedUser));
      setEditMode(false);
  
      // Thông báo thành công
      if (window.confirm(res.data.message || "Cập nhật thành công")) {
        // không reset gì cả, chỉ tắt chế độ edit
      }
    } catch (err: any) {  
      console.error(err);
      alert(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };
  
  const handleCancel = () => {
    setForm({ ...defaultForm, ...user });
    setEditMode(false);
  };
  

  if (!form) return <div>Đang tải...</div>;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Hồ sơ cá nhân</h1>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" /> Lưu
                </Button>
                <Button variant="ghost" onClick={handleCancel} className="gap-2">
                  <X className="h-4 w-4" /> Hủy
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)} className="gap-2">
                <Edit className="h-4 w-4" /> Chỉnh sửa
              </Button>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  {form.avatar ? (
                    <AvatarImage src={form.avatar} alt={form.name} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                      {form.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                {editMode && (
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute bottom-0 right-0 w-10 h-10 opacity-70 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => handleChange("avatar", reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <Input
                    value={form.name}
                    readOnly={!editMode}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="text-2xl font-bold border-0 p-0"
                  />
                  <p className="text-muted-foreground">{form.role || "Học viên"}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <Input
                      value={form.email}
                      readOnly
                      className="border-0 p-0 text-muted-foreground"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <Input
                      value={form.phone || ""}
                      readOnly={!editMode}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />

                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <Input
                      type="date"
                      value={form.dob?.split("T")[0] || ""}
                      readOnly={!editMode}
                      onChange={(e) => handleChange("dob", e.target.value)}
                      className="border-0 p-0 text-muted-foreground"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <Input
                      value={form.permanentAddress}
                      readOnly={!editMode}
                      onChange={(e) => handleChange("permanentAddress", e.target.value)}
                      className="border-0 p-0 text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards thông tin chi tiết */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "name", label: "Họ và tên", value: form.name },
                { id: "studentId", label: "Mã sinh viên", value: form.studentId, readOnly: true },
                { id: "dob", label: "Ngày sinh", value: form.dob?.split("T")[0], type: "date" },
                { id: "gender", label: "Giới tính", value: form.gender },
                { id: "nationality", label: "Quốc tịch", value: form.nationality },
              ].map((item) => (
                <div key={item.id} className="space-y-2">
                  <Label htmlFor={item.id}>{item.label}</Label>
                  <Input
                    id={item.id}
                    type={item.type || "text"}
                    value={item.value || ""}
                    readOnly={item.readOnly ?? !editMode}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "email", label: "Email", value: form.email, readOnly: true },
                { id: "phone", label: "Số điện thoại", value: form.phone },
                { id: "permanentAddress", label: "Địa chỉ thường trú", value: form.permanentAddress, isTextarea: true },
                { id: "temporaryAddress", label: "Địa chỉ tạm trú", value: form.temporaryAddress, isTextarea: true },
              ].map((item) => (
                <div key={item.id} className="space-y-2">
                  <Label htmlFor={item.id}>{item.label}</Label>
                  {item.isTextarea ? (
                    <Textarea
                      id={item.id}
                      value={item.value || ""}
                      readOnly={!editMode}
                      onChange={(e) => handleChange(item.id, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={item.id}
                      value={item.value || ""}
                      readOnly={item.readOnly ?? !editMode}
                      onChange={(e) => handleChange(item.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin học vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "program", label: "Chương trình đào tạo", value: form.program },
                { id: "major", label: "Chuyên ngành", value: form.major },
                { id: "course", label: "Khóa học", value: form.course },
                { id: "advisor", label: "Giáo viên hướng dẫn", value: form.advisor },
              ].map((item) => (
                <div key={item.id} className="space-y-2">
                  <Label htmlFor={item.id}>{item.label}</Label>
                  <Input
                    id={item.id}
                    value={item.value || ""}
                    readOnly={!editMode}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education Background */}
          <Card>
            <CardHeader>
              <CardTitle>Trình độ học vấn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "bachelor", label: "Đại học", value: form.bachelor },
                { id: "bachelorYear", label: "Năm tốt nghiệp", value: form.bachelorYear },
                { id: "bachelorGPA", label: "Điểm trung bình", value: form.bachelorGPA },
                { id: "englishLevel", label: "Trình độ tiếng Anh", value: form.englishLevel },
              ].map((item) => (
                <div key={item.id} className="space-y-2">
                  <Label htmlFor={item.id}>{item.label}</Label>
                  <Input
                    id={item.id}
                    value={item.value || ""}
                    readOnly={!editMode}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

// AuthDialog.tsx
import React, { useEffect, useMemo, useState } from "react";
import * as api from "@/api/Api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { LoginResponse } from "@/api/Api";

// (gợi ý) kiểu dữ liệu giảng viên từ backend
type TeacherOption = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  initials?: string;
};

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: { name: string; email: string; role?: string }) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"student" | "teacher">("student");

  // form cơ bản
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // field bổ sung cho giáo viên
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [initials, setInitials] = useState("");

  // chọn giảng viên để auto-fill
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // tải danh sách giảng viên khi mở dialog và khi role=teacher
  useEffect(() => {
    if (!open) return;
    if (role !== "teacher") return;
    (async () => {
      try {
        const res = await api.teacherAPI.getAll({ page: 1, limit: 100 });
        const items = res.data.items || [];
        setTeachers(items as any);
      } catch (e) {
        console.error("Load teachers failed", e);
      }
    })();
  }, [open, role]);

  // khi chọn giảng viên → auto-fill
  useEffect(() => {
    if (!selectedTeacherId) return;
    const t = teachers.find((x) => x._id === selectedTeacherId);
    if (!t) return;
    setName(t.name || "");
    setEmail(t.email || "");
    setPhone(t.phone || "");
    setTitle(t.title || "");
    setDepartment(t.department || "");
    setInitials(t.initials || "");
  }, [selectedTeacherId, teachers]);

  const navigateByRole = (r?: string) => {
    if (r === "admin" || r === "teacher") navigate("/admin", { replace: true });
    else navigate("/", { replace: true });
  };

  const handleSubmit = async () => {
    if (!isLogin) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        alert("Vui lòng nhập đầy đủ họ tên, email, mật khẩu.");
        return;
      }
      if (password.length < 6) {
        alert("Mật khẩu tối thiểu 6 ký tự.");
        return;
      }
    } else {
      if (!email.trim() || !password.trim()) {
        alert("Vui lòng nhập email và mật khẩu.");
        return;
      }
    }

    setLoading(true);
    try {
      const res = isLogin
        ? await api.authAPI.login({ email: email.trim().toLowerCase(), password })
        : await api.authAPI.register({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: role, // nếu là teacher thì gửi teacher
          });

      if (!res || !res.data) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      const { token, user } = res.data as LoginResponse;
      if (!token || !user) throw new Error("Phản hồi không hợp lệ từ server");

      if (isLogin && user.isActive === false) {
        alert("Tài khoản của bạn đã bị chặn. Vui lòng liên hệ quản trị viên.");
        return;
      }

      // lưu local
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role || "");
      localStorage.setItem("userId", user._id);

      // Nếu đăng ký giáo viên, cập nhật thêm thông tin chuyên môn
      if (!isLogin && role === "teacher") {
        const extra = {
          phone: phone || undefined,
          // thêm field vào User schema trước khi dùng:
          // title, department, initials
          title: title || undefined,
          department: department || undefined,
          initials: initials || undefined,
        };
        try {
          await api.authAPI.updateProfile(extra, token);
        } catch (e) {
          console.warn("Cập nhật hồ sơ giáo viên thất bại:", e);
        }
      }

      onLoginSuccess?.(user);
      if (user.role === "teacher" || user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      onClose();
      alert(isLogin ? "Đăng nhập thành công" : "Đăng ký thành công");
      navigateByRole(user.role);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        alert("Tài khoản của bạn đã bị chặn. Vui lòng liên hệ quản trị viên.");
      } else {
        alert(err.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent className="sm:max-w-md rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md border border-gray-200 p-8">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-3xl font-extrabold text-gray-900 mb-2">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            {isLogin ? "Nhập email và mật khẩu để đăng nhập" : "Điền thông tin để tạo tài khoản mới"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {/* Chọn chế độ và role */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant={isLogin ? "default" : "outline"} onClick={() => setIsLogin(true)}>
              Đăng nhập
            </Button>
            <Button variant={!isLogin ? "default" : "outline"} onClick={() => setIsLogin(false)}>
              Đăng ký
            </Button>
          </div>

          {!isLogin && (
            <>
              <select
                className="h-10 rounded-md border px-3 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value as "student" | "teacher")}
              >
                <option value="student">Sinh viên</option>
                <option value="teacher">Giáo viên</option>
              </select>

             
            </>
          )}

          {/* Trường nhập chung */}
          {!isLogin && (
            <Input placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
          />

          {/* Chỉ hiển thị khi đăng ký role = teacher */}
          {!isLogin && role === "teacher" && (
            <>
              <Input placeholder="Học hàm/học vị (VD: Tiến sĩ)" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input placeholder="Khoa/Bộ môn" value={department} onChange={(e) => setDepartment(e.target.value)} />
              <Input placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </>
          )}
        </div>

        <div className="flex flex-col items-stretch gap-3 w-full mt-4">
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;

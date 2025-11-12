// src/pages/admin/AdminNotification.tsx
import { useEffect, useState, useRef } from "react";
import { adminStudentAPI, adminDocumentAPI, notificationAPI } from "@/api/Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AdminLayout } from "./AdminLayout";
import { Bell, Send, FileText, User, Search, Clock, AlertCircle, Inbox } from "lucide-react";

interface Student { _id: string; name: string; email: string; }
interface Document { _id: string; name: string; status: "pending" | "approved" | "rejected"; }
interface Notification { _id: string; userIds: Student[]; title: string; content: string; createdAt: string; }

export default function AdminNotification() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchText, setSearchText] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingNoti, setLoadingNoti] = useState(false);
  const [mode, setMode] = useState<"file" | "normal">("file");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try { const res = await adminStudentAPI.getAll(); setStudents(res.data); }
      catch { toast.error("Không thể tải danh sách học viên"); }
    };
    fetchStudents();
    fetchNotificationsAdmin();
  }, []);

  const fetchNotificationsAdmin = async () => {
    setLoadingNoti(true);
    try {
      const res = await notificationAPI.getAllAdmin();
      const formatted: Notification[] = res.data.map((n: any) => ({
        _id: n._id,
        title: n.title,
        content: n.content,
        createdAt: n.createdAt,
        userIds: n.userId ? [{ _id: n.userId, name: "Học viên", email: "" }] : [],
      }));
      setNotifications(formatted);
    } catch {} 
    finally { setLoadingNoti(false); }
  };

  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(searchText.toLowerCase()) || s.email.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    if (selectedStudent && mode === "file") fetchDocuments(selectedStudent._id);
    else { setDocuments([]); setSelectedDocument(""); }
  }, [selectedStudent, mode]);

  const fetchDocuments = async (studentId: string) => {
    setLoadingDocs(true);
    try {
      const res = await adminDocumentAPI.getAll("", "");
      const docs = res.data.filter(
        (doc: Document & { userId: { _id: string } }) => doc.userId._id === studentId
      );
      setDocuments(docs); setSelectedDocument(docs[0]?._id || "");
    } catch { toast.error("Không thể tải danh sách file"); }
    finally { setLoadingDocs(false); }
  };

  const handleSendNotification = async () => {
    if (!selectedStudent || !message) return toast.error("Vui lòng chọn học viên và điền nội dung");
    let title = mode === "file" ? `Thông báo về file: ${documents.find(d => d._id === selectedDocument)?.name}` : "Thông báo từ giảng viên";
    if (mode === "file" && !selectedDocument) return toast.error("Vui lòng chọn file");
    try {
      await notificationAPI.create({ userIds: [selectedStudent._id], title, content: message, type: "info" });
      toast.success("Gửi thông báo thành công");
      setMessage(""); setSelectedStudent(null); setSelectedDocument(""); setSearchText("");
      fetchNotificationsAdmin();
    } catch { toast.error("Gửi thông báo thất bại"); }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Quản lý thông báo học viên
              </h1>
              <p className="text-gray-600 mt-1">Gửi thông báo và theo dõi lịch sử</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form gửi thông báo */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Gửi thông báo mới</h2>
              </div>

              {/* Mode Selection */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                <Button
                  variant={mode === "file" ? "default" : "ghost"}
                  className={`flex-1 gap-2 transition-all ${
                    mode === "file"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "hover:bg-white"
                  }`}
                  onClick={() => setMode("file")}
                >
                  <FileText className="w-4 h-4" />
                  Thông báo về file
                </Button>
                <Button
                  variant={mode === "normal" ? "default" : "ghost"}
                  className={`flex-1 gap-2 transition-all ${
                    mode === "normal"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "hover:bg-white"
                  }`}
                  onClick={() => setMode("normal")}
                >
                  <User className="w-4 h-4" />
                  Thông báo học viên
                </Button>
              </div>

              {/* Student Selection */}
              <div className="relative" ref={dropdownRef}>
                <Label className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
                  <Search className="w-4 h-4" />
                  Chọn học viên
                </Label>
                <div className="relative">
                  <Input
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Nhập tên hoặc email học viên..."
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {showDropdown && filteredStudents.length > 0 && (
                  <ul className="absolute z-50 w-full max-h-60 overflow-y-auto border border-gray-200 rounded-xl shadow-2xl bg-white mt-2 divide-y divide-gray-100">
                    {filteredStudents.map((s) => (
                      <li
                        key={s._id}
                        className="p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all flex items-center gap-3 group"
                        onClick={() => {
                          setSelectedStudent(s);
                          setSearchText(`${s.name} (${s.email})`);
                          setShowDropdown(false);
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-semibold">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                            {s.name}
                          </p>
                          <p className="text-xs text-gray-500">{s.email}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* File Selection */}
              {mode === "file" && selectedStudent && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <Label className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
                    <FileText className="w-4 h-4" />
                    Chọn file học viên
                  </Label>
                  {loadingDocs ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <p>Đang tải danh sách file...</p>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="flex items-center gap-2 text-gray-500 py-2">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-sm">Học viên chưa nộp file nào</p>
                    </div>
                  ) : (
                    <select
                      className="border border-gray-300 rounded-lg p-3 w-full bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      value={selectedDocument}
                      onChange={(e) => setSelectedDocument(e.target.value)}
                    >
                      {documents.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          {doc.name} ({doc.status})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Message Input */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
                  <FileText className="w-4 h-4" />
                  Nội dung thông báo
                </Label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập nội dung thông báo cho học viên..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                />
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSendNotification}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Gửi thông báo
              </Button>
            </div>

            {/* Lịch sử thông báo */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">Lịch sử thông báo</h2>
              </div>

              <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {loadingNoti ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Đang tải lịch sử...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <Inbox className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 font-medium">Chưa có thông báo nào</p>
                      <p className="text-sm text-gray-400 mt-1">Các thông báo bạn gửi sẽ xuất hiện ở đây</p>
                    </div>
                  </div>
                ) : (
                  notifications.map((noti) => (
                    <div
                      key={noti._id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all bg-gradient-to-br from-white to-gray-50 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 mb-1">{noti.title}</p>
                          <p className="text-gray-600 text-sm leading-relaxed mb-2">{noti.content}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span>{noti.userIds.map((u) => u.name).join(", ")}</span>
                            <span className="text-gray-300">•</span>
                            <Clock className="w-3 h-3" />
                            <span>{new Date(noti.createdAt).toLocaleString("vi-VN")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
     </>
  );
}

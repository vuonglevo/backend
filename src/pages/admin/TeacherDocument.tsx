// src/pages/TeacherStudentDocuments.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Upload, Search } from "lucide-react";
import { teacherAPI, AdminDocument, adminStudentAPI, User } from "@/api/Api";

type Props = { studentId?: string };
type SentDoc = AdminDocument & {
  uploadedBy?: { _id: string; name?: string; email?: string };
  userId?: { _id: string; name?: string; email?: string; studentId?: string };
};

const TeacherStudentDocuments: React.FC<Props> = ({ studentId: studentIdProp }) => {
  const qc = useQueryClient();

  // --- chọn học viên ---
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [errorSuggest, setErrorSuggest] = useState<string | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // NEW: broadcast toggle
  const [broadcastAll, setBroadcastAll] = useState(false);

  const effectiveStudentId = broadcastAll ? "" : (studentIdProp || selectedStudent?._id || "");

  useEffect(() => {
    if (!showDropdown) return;
    const q = searchText.trim();
    if (!q) {
      setStudents([]); setErrorSuggest(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoadingSuggest(true); setErrorSuggest(null);
      try {
        const res = await adminStudentAPI.getAll(q);
        if (!cancelled) setStudents(res.data || []);
      } catch (e: any) {
        if (!cancelled) setErrorSuggest(e?.response?.data?.message || "Lỗi tải gợi ý");
      } finally {
        if (!cancelled) setLoadingSuggest(false);
      }
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [searchText, showDropdown]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onKeyDownSelect = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || students.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => (i + 1) % students.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => (i - 1 + students.length) % students.length); }
    else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      const s = students[activeIdx];
      setSelectedStudent(s);
      setSearchText(`${s.name} (${s.email})`);
      setShowDropdown(false);
      setTimeout(() => refetch(), 0);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // --- danh sách đã gửi ---
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["teacherDocsSent", effectiveStudentId || "ALL"],
    queryFn: async () => {
      if (effectiveStudentId) {
        const res = await teacherAPI.listSentDocs(effectiveStudentId);
        return (res?.data?.items ?? []) as SentDoc[];
      }
      const res = await teacherAPI.listAllSentDocs();
      return (res?.data?.items ?? []) as SentDoc[];
    },
    staleTime: 60_000,
  });

  const list: SentDoc[] = useMemo(() => {
    const lower = search.toLowerCase();
    let raw = (data || []) as SentDoc[];
    if (effectiveStudentId) {
      raw = raw.filter(d => d.userId?._id === effectiveStudentId);
    }
    if (!search) return raw;
    return raw.filter(
      (doc) =>
        (doc.name || "").toLowerCase().includes(lower) ||
        (doc.type || "").toLowerCase().includes(lower) ||
        (doc.statusText || "").toLowerCase().includes(lower) ||
        (doc.userId?.name || "").toLowerCase().includes(lower) ||
        (doc.uploadedBy?.name || "").toLowerCase().includes(lower)
    );
  }, [data, search, effectiveStudentId]);

  // --- upload ---
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState(""); // nội dung -> statusText

  const uploadMut = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Chưa chọn file");
      const fd = new FormData();
      fd.append("file", file);
      if (name.trim()) fd.append("name", name.trim());
      if (content.trim()) fd.append("statusText", content.trim()); // gửi nội dung đúng field

      if (broadcastAll) {
        return (await teacherAPI.uploadToAll(fd)).data;
      }
      if (!effectiveStudentId) throw new Error("Chưa chọn học viên");
      return (await teacherAPI.uploadToStudent(effectiveStudentId, fd)).data;
    },
    onSuccess: () => {
      setFile(null);
      setName("");
      setContent("");
      // refresh cả list chung
      qc.invalidateQueries({ queryKey: ["teacherDocsSent", "ALL"] });
      if (effectiveStudentId) {
        qc.invalidateQueries({ queryKey: ["teacherDocsSent", effectiveStudentId] });
      }
    },
  });

  const handleDownload = (doc: SentDoc) => {
    if (!doc.fileUrl) return;
    const a = document.createElement("a");
    a.href = doc.fileUrl;
    a.target = "_blank";
    a.rel = "noopener";
    a.download = doc.name || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Tài liệu giảng viên đã gửi</h1>
          <p className="text-muted-foreground">Chọn học viên, tải file hoặc gửi cho tất cả</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Broadcast toggle */}
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={broadcastAll}
              onChange={(e) => {
                setBroadcastAll(e.target.checked);
                if (e.target.checked) {
                  setSelectedStudent(null);
                  setSearchText("");
                }
                // cập nhật list
                setTimeout(() => refetch(), 0);
              }}
            />
            <span>Gửi cho tất cả </span>
          </label>

          {/* Chọn học viên: disable khi broadcast */}
          {!studentIdProp && (
            <div className={`relative md:w-72 ${broadcastAll ? "opacity-50 pointer-events-none" : ""}`} ref={dropdownRef}>
              <div className="relative">
                <Input
                  value={searchText}
                  onChange={(e) => {
                    setSelectedStudent(null);
                    setSearchText(e.target.value);
                    setShowDropdown(true);
                    setActiveIdx(-1);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={onKeyDownSelect}
                  placeholder="Nhập tên hoặc email học viên…"
                  className="pl-9"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              {showDropdown && !broadcastAll && (
                <ul className="absolute z-50 w-full max-h-60 overflow-y-auto border border-gray-200 rounded-xl shadow-2xl bg-white mt-2 divide-y divide-gray-100">
                  {loadingSuggest && <li className="p-3 text-sm text-gray-500">Đang tìm…</li>}
                  {!loadingSuggest && errorSuggest && <li className="p-3 text-sm text-red-600">{errorSuggest}</li>}
                  {!loadingSuggest && !errorSuggest && students.length === 0 && searchText.trim() && (
                    <li className="p-3 text-sm text-gray-500">Không có kết quả</li>
                  )}
                  {!loadingSuggest && !errorSuggest && students.map((s, idx) => (
                    <li
                      key={s._id}
                      className={`p-3 cursor-pointer transition-all flex items-center gap-3 ${idx === activeIdx ? "bg-blue-50" : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"}`}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => {
                        setSelectedStudent(s);
                        setSearchText(`${s.name} (${s.email})`);
                        setShowDropdown(false);
                        setTimeout(() => refetch(), 0);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-semibold">
                        {s.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Tìm trong danh sách đã gửi */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm theo tên, loại, ghi chú…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button type="button" variant="outline" onClick={() => refetch()} disabled={isFetching}>
            Làm mới
          </Button>
        </div>
      </div>

      {/* Upload */}
      <Card className="shadow-card">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1 grid md:grid-cols-3 gap-3">
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <Input placeholder="Tên tài liệu (tùy chọn)" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Nội dung" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <Button
              type="button"
              onClick={() => uploadMut.mutate()}
              disabled={!file || uploadMut.isPending || (!broadcastAll && !effectiveStudentId)}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadMut.isPending ? "Đang tải lên..." : (broadcastAll ? "Gửi cho tất cả" : "Tải lên cho sinh viên")}
            </Button>
          </div>
          {!broadcastAll && !effectiveStudentId && (
            <p className="text-xs text-red-600 mt-2">Hãy chọn học viên trước khi tải lên, hoặc bật “Gửi cho tất cả”.</p>
          )}
        </CardContent>
      </Card>

      {/* Danh sách đã gửi */}
      {isLoading ? (
        <p>Đang tải...</p>
      ) : (list?.length ?? 0) === 0 ? (
        <p className="text-gray-500 italic">
          {effectiveStudentId ? "Chưa có tài liệu đã gửi cho học viên này." : "Chưa có tài liệu đã gửi."}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((doc) => (
            <Card key={doc._id} className="shadow-card transition-smooth hover:shadow-elegant">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Người nhận: <span className="font-medium">{doc.userId?.name || "Không rõ"}</span>
                      {doc.userId?.email ? ` (${doc.userId.email})` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Người gửi: <span className="font-medium">{doc.uploadedBy?.name || "Bạn"}</span>
                      {doc.uploadedBy?.email ? ` (${doc.uploadedBy.email})` : ""}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>{doc.type}</span>
                      <span>{doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : ""}</span>
                    </div>
                    <p className="text-xs mt-1">
                      Trạng thái: <span className={`font-semibold ${
                        doc.status === "approved" ? "text-green-600" :
                        doc.status === "rejected" ? "text-red-600" : "text-yellow-600"
                      }`}>{doc.statusText || doc.status}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(doc)} disabled={!doc.fileUrl}>
                    <Download className="h-4 w-4" /> Tải xuống
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherStudentDocuments;

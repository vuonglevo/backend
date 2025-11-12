import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Check, X, Search } from "lucide-react";
import { adminDocumentAPI, AdminDocument } from "@/api/Api";

const AdminDocuments = () => {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await adminDocumentAPI.getAll();
      const safeData = (res.data || []).map((doc: any) => ({
        ...doc,
        userId: doc.userId || {},
      }));
      setDocuments(safeData);
      setFilteredDocs(safeData);
    } catch (err) {
      console.error(err);
      setDocuments([]);
      setFilteredDocs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: AdminDocument) => {
    try {
      const res = await adminDocumentAPI.download(doc._id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (doc: AdminDocument) => {
    try {
      await adminDocumentAPI.updateStatus(doc._id, "approved", "Đã duyệt");
      fetchDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (doc: AdminDocument) => {
    try {
      await adminDocumentAPI.updateStatus(doc._id, "rejected", "Từ chối");
      fetchDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  // 🧠 Lọc theo từ khóa
  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();

    const filtered = documents.filter((doc) => {
      return (
        doc.name?.toLowerCase().includes(lower) ||
        doc.type?.toLowerCase().includes(lower) ||
        doc.userId?.name?.toLowerCase().includes(lower) ||
        doc.userId?.email?.toLowerCase().includes(lower)
      );
    });

    setFilteredDocs(filtered);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tiêu đề + thanh tìm kiếm */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Tài liệu đã nộp</h1>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm theo tên tài liệu, học viên, loại..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Danh sách tài liệu */}
      {filteredDocs.length === 0 ? (
        <p className="text-gray-500 italic">Không tìm thấy tài liệu phù hợp.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => (
            <Card
              key={doc._id}
              className="shadow-card transition-smooth hover:shadow-elegant"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Học viên: {doc.userId?.name || "Không rõ"} (
                      {doc.userId?.studentId ||
                        doc.userId?.email ||
                        "N/A"}
                      )
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.type}</span>
                      <span>
                        {new Date(doc.uploadDate || "").toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs mt-1">
                      Trạng thái:{" "}
                      <span
                        className={`font-semibold ${
                          doc.status === "approved"
                            ? "text-green-600"
                            : doc.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {doc.statusText || doc.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-4 w-4" /> Tải xuống
                  </Button>
                  {doc.status !== "approved" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600"
                      onClick={() => handleApprove(doc)}
                    >
                      <Check className="h-4 w-4" /> Duyệt
                    </Button>
                  )}
                  {doc.status !== "rejected" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleReject(doc)}
                    >
                      <X className="h-4 w-4" /> Từ chối
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDocuments;

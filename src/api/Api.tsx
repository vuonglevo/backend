import axios, { AxiosResponse } from "axios";

// ----------------- Axios instance -----------------
export const api = axios.create({
    baseURL: "http://localhost:3000/api", // port backend
});

// Interceptor thêm token tự động
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor xử lý 401
// Thay đổi interceptor 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("❌ Token hết hạn hoặc không hợp lệ.");
            // Không redirect, chỉ remove token
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            // Trả về Promise.resolve(null) để component tự xử lý
            return Promise.resolve({ data: null });
        }
        return Promise.reject(error);
    }
);

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: "student" | "admin";
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        _id: string;
        name: string;
        email: string;
        role: "student" | "admin";
        isActive?: boolean;
    };
}
export interface DocumentData {
    _id?: string;
    name: string;
    type: string;
    fileUrl?: string;
    uploadDate?: string;
    status: "pending" | "approved" | "rejected";
    statusText?: string;
}
export interface Notification {
    _id: string;
    title: string;
    content: string;
    type: "info" | "success" | "warning";
    unread: boolean;
    createdAt: string;
}
export interface DashboardStats {
    totalDocs: number;
    pendingDocs: number;
    approvedDocs: number;
    rejectedDocs: number;
}


export interface DashboardNotification {
    _id: string;
    title: string;
    type: "info" | "success" | "warning";
    unread: boolean;
    createdAt: string;
}
export interface AdminDashboardStats {
    totalDocs: number;
    pendingDocs: number;
    approvedDocs: number;
    rejectedDocs: number;
    totalUsers: number;
    activeUsers: number;
}

// Dashboard notification admin (có thể giống user)
export interface AdminDashboardNotification {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    userIds?: { _id: string; name?: string; email?: string }[];
}

// Admin dashboard data
export interface AdminDashboardData {
    stats: AdminDashboardStats;
    notifications: AdminDashboardNotification[];
}
export interface DashboardData {
    stats: DashboardStats;
    notifications: DashboardNotification[]; // thêm vào đây
    user: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        studentId?: string;
        major?: string;
        course?: string;
        role?: string;
    };
    studyProgress: {
        creditsCompleted: number;
        totalCredits: number;
        gpa: number;
        currentSemester: string;
        status: string;
    };
}
export interface User {
    _id: string;
    name: string;
    email: string;
    role: "student" | "admin";
    isActive?: boolean;
    studentId?: string;
    dob?: string;
    gender?: string;
    nationality?: string;
    phone?: string;
    permanentAddress?: string;
    temporaryAddress?: string;
    program?: string;
    major?: string;
    course?: string;
    advisor?: string;
    bachelor?: string;
    bachelorYear?: string;
    bachelorGPA?: string;
    englishLevel?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface AdminDocument {
    _id: string;
    name: string;
    type: string;
    fileUrl: string;
    status: "pending" | "approved" | "rejected";
    statusText?: string;
    uploadDate?: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        studentId?: string;
    };
}

export const adminDocumentAPI = {
    getAll: (search?: string, status?: string): Promise<AxiosResponse<AdminDocument[]>> =>
        api.get("/admin/documents", { params: { search, status } }),

    updateStatus: (id: string, status: "approved" | "rejected" | "pending", statusText?: string) =>
        api.put(`/admin/documents/${id}/status`, { status, statusText }),

    download: (id: string) =>
        api.get(`/admin/documents/${id}/download`, { responseType: "blob" }),
};
export const adminStudentAPI = {
    getAll: (search?: string) =>
        api.get<User[]>("/admin/students", { params: { search } }),  // thêm /admin
    create: (data: Partial<User>) => api.post("/admin/students", data),
    update: (id: string, data: Partial<User>) => api.put(`/admin/students/${id}`, data),
    delete: (id: string) => api.delete(`/admin/students/${id}`),
};


export const dashboardAPI = {
    get: (): Promise<AxiosResponse<DashboardData>> => api.get("/dashboard"),
};
// ------------------- Notification API -------------------
export const notificationAPI = {
    // Lấy danh sách notifications
    getAll: (): Promise<AxiosResponse<Notification[]>> =>
        api.get("/notifications"),
    getAllAdmin: (): Promise<AxiosResponse<Notification[]>> =>
        api.get("/notifications/admin"),
    // Đánh dấu tất cả đã đọc
    markAllRead: (): Promise<AxiosResponse<void>> =>
        api.put("/notifications/mark-all-read"),

    // Xóa 1 notification
    delete: (id: string): Promise<AxiosResponse<void>> =>
        api.delete(`/notifications/${id}`),
    create: (data: { userIds: string[]; title: string; content: string; type?: "info" | "success" | "warning" }) =>
        api.post("/notifications", data),
};
export const documentAPI = {
    getAll: () => api.get<DocumentData[]>("/documents"),
    upload: (formData: FormData) =>
        api.post("/documents", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    download: (id: string) =>
        api.get(`/documents/${id}/download`, { responseType: "blob" }),
    delete: (id: string) =>
        api.delete(`/documents/${id}`),
};
export const authAPI = {
    register: (data: RegisterData): Promise<AxiosResponse<LoginResponse>> =>
        api.post("/auth/register", data),

    login: (data: LoginData): Promise<AxiosResponse<LoginResponse>> =>
        api.post("/auth/login", data),

    getCurrentUser: (): Promise<AxiosResponse<{ user: LoginResponse["user"] }>> =>
        api.get("/auth/me"),

    updateProfile: (data: any, token: string) =>
        api.put("/auth/update", data, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    getProfile: () => api.get("/profile"),

    logout: async (): Promise<void> => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.warn("Server logout lỗi (bỏ qua vì token ở localStorage):", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
        }
    },
};

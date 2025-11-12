import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Documents from "./pages/Documents";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./routes/PrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminStudent from "./pages/admin/AdminStudent";
import { AdminLayout } from "./pages/admin/AdminLayout";
import AdminNotification from "./pages/admin/AdminNotification";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Route chung */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />

          {/* Route admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin", "teacher"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminDoc"
            element={
              <PrivateRoute allowedRoles={["admin", "teacher"]}>
                <AdminLayout>
                  <AdminDocuments />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/adminFac"
            element={
              <PrivateRoute allowedRoles={["admin", "teacher"]}>
                <AdminLayout>
                  <AdminFaculty />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/adminStu"
            element={
              <PrivateRoute allowedRoles={["admin", "teacher"]}>
                <AdminLayout>
                  <AdminStudent />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/adminNot"
            element={
              <PrivateRoute allowedRoles={["admin", "teacher"]}>
                <AdminLayout>
                  <AdminNotification />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // admin, teacher, student
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
    const userStr = localStorage.getItem("user");
  
    // Nếu chưa login → redirect về login page, hoặc giữ nguyên / nếu có dialog
    if (!userStr) return <>{children}</>; // hoặc redirect /login nếu có
  
    const user = JSON.parse(userStr);
  
    // Nếu role không đúng → redirect về "/"
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  
    return <>{children}</>;
  };
export default PrivateRoute;

import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../lib/auth";

export const AdminProtectedRoute = () => {
  // Kiểm tra xác thực và quyền admin
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }

  // Nếu đã đăng nhập và là admin, hiển thị nội dung bên trong route
  return <Outlet />;
};

export const UserProtectedRoute = () => {
  // Kiểm tra xác thực
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung bên trong route
  return <Outlet />;
};

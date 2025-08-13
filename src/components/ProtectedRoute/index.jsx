import { Navigate, Outlet } from "react-router-dom";

export const AdminProtectedRoute = () => {
  // Kiểm tra xác thực từ cả hai nguồn có thể có
  const userInfo = JSON.parse(localStorage.getItem("USER_INFO") || localStorage.getItem("USER_LOGIN") || "{}");
  const accessToken = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("USER_LOGIN_TOKEN");
  
  const isAuthenticated = userInfo && accessToken;
  const isAdmin = userInfo && userInfo.maLoaiNguoiDung === "QuanTri";

  // Nếu chưa đăng nhập hoặc không phải admin, chuyển hướng đến trang đăng nhập admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Nếu đã đăng nhập và là admin, hiển thị nội dung bên trong route
  return <Outlet />;
};

export const UserProtectedRoute = () => {
  // Kiểm tra xác thực từ cả hai nguồn có thể có
  const userInfo = JSON.parse(localStorage.getItem("USER_INFO") || localStorage.getItem("USER_LOGIN") || "{}");
  const accessToken = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("USER_LOGIN_TOKEN");
  
  const isAuthenticated = userInfo && accessToken;

  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung bên trong route
  return <Outlet />;
};

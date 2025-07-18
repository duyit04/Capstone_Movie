import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await api.post("QuanLyNguoiDung/DangNhap", values);
      
      // Save user info and token to localStorage
      localStorage.setItem("userInfo", JSON.stringify(result.data.content));
      localStorage.setItem("accessToken", result.data.content.accessToken);
      
      // Redirect to home page
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.content || "Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-md">
        <div className="md:flex">
          <div className="w-full p-6">
            <div className="flex justify-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Đăng nhập</h1>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={(e) => {
              e.preventDefault();
              onFinish({
                taiKhoan: e.target.taiKhoan.value,
                matKhau: e.target.matKhau.value
              });
            }}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taiKhoan">
                  Tài khoản
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="taiKhoan"
                  type="text"
                  name="taiKhoan"
                  placeholder="Nhập tài khoản"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="matKhau">
                  Mật khẩu
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="matKhau"
                  type="password"
                  name="matKhau"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Bạn chưa có tài khoản?{" "}
                  <Link to="/register" className="text-blue-600 hover:underline">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

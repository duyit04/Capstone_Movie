import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const onSubmit = async (event) => {
    event.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const formData = {
        taiKhoan: event.target.taiKhoan.value,
        matKhau: event.target.matKhau.value,
        email: event.target.email.value,
        soDt: event.target.soDt.value,
        maNhom: "GP01", // Sử dụng mã nhóm mặc định
        hoTen: event.target.hoTen.value
      };
      
      // Kiểm tra mật khẩu xác nhận
      if (formData.matKhau !== event.target.confirmPassword.value) {
        setError("Mật khẩu xác nhận không khớp");
        setLoading(false);
        return;
      }
      
      const result = await api.post("QuanLyNguoiDung/DangKy", formData);
      
      // Đăng ký thành công, chuyển hướng đến trang đăng nhập
      navigate("/login", { 
        replace: true,
        state: { message: "Đăng ký thành công. Vui lòng đăng nhập." }
      });
    } catch (err) {
      setError(err.response?.data?.content || "Đã xảy ra lỗi khi đăng ký");
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
              <h1 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h1>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={onSubmit}>
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

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hoTen">
                  Họ tên
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="hoTen"
                  type="text"
                  name="hoTen"
                  placeholder="Nhập họ tên"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="soDt">
                  Số điện thoại
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="soDt"
                  type="text"
                  name="soDt"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="mb-4">
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

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Nhập lại mật khẩu
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Đăng nhập
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

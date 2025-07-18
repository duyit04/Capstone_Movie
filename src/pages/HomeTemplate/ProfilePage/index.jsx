import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../services/api";
import { Tabs } from "antd";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Get user information from localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        
        const result = await api.post(
          "QuanLyNguoiDung/ThongTinTaiKhoan",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setUserInfo(result.data.content);
      } catch (err) {
        setError(err.response?.data?.content || "Không thể lấy thông tin người dùng");
        
        // If token is expired or invalid, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userInfo");
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [navigate]);
  
  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      setUpdateSuccess(false);
      
      const formData = {
        taiKhoan: userInfo.taiKhoan, // Cannot change username
        matKhau: event.target.matKhau.value,
        email: event.target.email.value,
        soDt: event.target.soDt.value,
        maNhom: userInfo.maNhom,
        maLoaiNguoiDung: userInfo.maLoaiNguoiDung, // Cannot change user type
        hoTen: event.target.hoTen.value
      };
      
      const result = await api.put(
        "QuanLyNguoiDung/CapNhatThongTinNguoiDung",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update userInfo in state and localStorage
      setUserInfo(result.data.content);
      localStorage.setItem("userInfo", JSON.stringify(result.data.content));
      
      setUpdateSuccess(true);
    } catch (err) {
      setUpdateError(err.response?.data?.content || "Không thể cập nhật thông tin");
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  if (loading) return <div className="container mx-auto py-10 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto py-10 text-center text-red-600">{error}</div>;
  if (!userInfo) return <div className="container mx-auto py-10 text-center">No data found</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>
          
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Thông tin cá nhân",
                children: (
                  <div>
                    {updateSuccess && (
                      <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                        Cập nhật thông tin thành công!
                      </div>
                    )}
                    
                    {updateError && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {updateError}
                      </div>
                    )}
                    
                    <form onSubmit={handleUpdateProfile}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tài khoản
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
                            type="text"
                            value={userInfo.taiKhoan}
                            readOnly
                          />
                          <p className="text-xs text-gray-500 mt-1">Tài khoản không thể thay đổi</p>
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hoTen">
                            Họ tên
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="hoTen"
                            name="hoTen"
                            type="text"
                            defaultValue={userInfo.hoTen}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={userInfo.email}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="soDt">
                            Số điện thoại
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="soDt"
                            name="soDt"
                            type="text"
                            defaultValue={userInfo.soDT}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="matKhau">
                            Mật khẩu
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="matKhau"
                            name="matKhau"
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Loại người dùng
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
                            type="text"
                            value={userInfo.maLoaiNguoiDung === "KhachHang" ? "Khách hàng" : "Quản trị"}
                            readOnly
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <button
                          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          type="submit"
                          disabled={updateLoading}
                        >
                          {updateLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </form>
                  </div>
                ),
              },
              {
                key: "2",
                label: "Lịch sử đặt vé",
                children: (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Danh sách vé đã đặt</h2>
                    
                    {userInfo.thongTinDatVe && userInfo.thongTinDatVe.length > 0 ? (
                      <div className="space-y-4">
                        {userInfo.thongTinDatVe.map((booking) => (
                          <div 
                            key={booking.maVe} 
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg">{booking.tenPhim}</h3>
                                <p className="text-gray-600">
                                  Ngày đặt: {new Date(booking.ngayDat).toLocaleDateString('vi-VN')}
                                </p>
                                <p className="text-gray-600">
                                  Thời lượng: {booking.thoiLuongPhim} phút
                                </p>
                                <p className="text-gray-600">
                                  Giá vé: {booking.giaVe.toLocaleString('vi-VN')} VND
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-medium">{booking.danhSachGhe[0]?.tenHeThongRap}</p>
                                <p className="text-sm">{booking.danhSachGhe[0]?.tenRap}</p>
                              </div>
                            </div>
                            
                            <div className="mt-2">
                              <p className="font-medium">Danh sách ghế:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {booking.danhSachGhe.map((seat) => (
                                  <span 
                                    key={seat.maGhe} 
                                    className="inline-block px-2 py-1 bg-gray-200 rounded text-sm"
                                  >
                                    {seat.tenGhe}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Bạn chưa đặt vé nào.</p>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

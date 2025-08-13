import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../services/api";
import { Tabs, Spin, Alert, Card, Typography, Space, Form, Input, Button, message } from "antd";
import { UserOutlined, LoadingOutlined, SaveOutlined, LogoutOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Get user information from localStorage
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    
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
        // Set form values
        form.setFieldsValue({
          taiKhoan: result.data.content.taiKhoan,
          hoTen: result.data.content.hoTen,
          email: result.data.content.email,
          soDt: result.data.content.soDT,
          maLoaiNguoiDung: result.data.content.maLoaiNguoiDung
        });
      } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
        setError(err.response?.data?.content || "Không thể lấy thông tin người dùng");
        
        // If token is expired or invalid, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("ACCESS_TOKEN");
          localStorage.removeItem("USER_INFO");
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [navigate, form]);

  const handleUpdateProfile = async (values) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) return;
    
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      setUpdateSuccess(false);
      
      const formData = {
        taiKhoan: userInfo.taiKhoan, // Cannot change username
        matKhau: values.matKhau,
        email: values.email,
        soDt: values.soDt,
        maNhom: userInfo.maNhom,
        maLoaiNguoiDung: userInfo.maLoaiNguoiDung, // Cannot change user type
        hoTen: values.hoTen
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
      localStorage.setItem("USER_INFO", JSON.stringify(result.data.content));
      
      setUpdateSuccess(true);
      message.success('Cập nhật thông tin thành công!');
    } catch (err) {
      const errorMsg = err.response?.data?.content || "Không thể cập nhật thông tin";
      setUpdateError(errorMsg);
      message.error(errorMsg);
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER_INFO");
    navigate("/login", { replace: true });
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 16
      }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />} 
          size="large" 
        />
        <Text type="secondary" style={{ fontSize: 16 }}>
          Đang tải thông tin tài khoản...
        </Text>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                background: '#ff4d4f', 
                color: 'white', 
                border: 'none', 
                padding: '4px 8px', 
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Thử lại
            </button>
          }
        />
      </div>
    );
  }

  // No data state
  if (!userInfo) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 16
      }}>
        <UserOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
        <Text type="secondary" style={{ fontSize: 16 }}>
          Không tìm thấy thông tin người dùng
        </Text>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            background: '#1890ff', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Tải lại trang
        </button>
      </div>
    );
  }

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
                    
                    <Form
                      form={form}
                      onFinish={handleUpdateProfile}
                      layout="vertical"
                      className="space-y-4"
                    >
                      <Form.Item
                        label="Tài khoản"
                        name="taiKhoan"
                        rules={[{ message: 'Tài khoản không thể thay đổi' }]}
                      >
                        <Input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
                          type="text"
                          value={userInfo.taiKhoan}
                          readOnly
                        />
                      </Form.Item>
                      
                      <Form.Item
                        label="Họ tên"
                        name="hoTen"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                      >
                        <Input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="Nhập họ tên"
                        />
                      </Form.Item>
                      
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ type: 'email', message: 'Vui lòng nhập địa chỉ email hợp lệ' }]}
                      >
                        <Input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="email"
                          placeholder="Nhập email"
                        />
                      </Form.Item>
                      
                      <Form.Item
                        label="Số điện thoại"
                        name="soDt"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                      >
                        <Input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="Nhập số điện thoại"
                        />
                      </Form.Item>
                      
                      <Form.Item
                        label="Mật khẩu"
                        name="matKhau"
                        rules={[{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }]}
                      >
                        <Input.Password
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Nhập mật khẩu mới"
                        />
                      </Form.Item>
                      
                      <Form.Item
                        label="Loại người dùng"
                        name="maLoaiNguoiDung"
                        rules={[{ required: true, message: 'Vui lòng chọn loại người dùng' }]}
                      >
                        <Input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
                          type="text"
                          value={userInfo.maLoaiNguoiDung === "KhachHang" ? "Khách hàng" : "Quản trị"}
                          readOnly
                        />
                      </Form.Item>
                      
                      <div className="mt-6 flex justify-between">
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={updateLoading ? <LoadingOutlined /> : <SaveOutlined />}
                          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={updateLoading}
                        >
                          {updateLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                        </Button>
                        
                        <Button
                          type="primary"
                          danger
                          icon={<LogoutOutlined />}
                          onClick={handleLogout}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Đăng xuất
                        </Button>
                      </div>
                    </Form>
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

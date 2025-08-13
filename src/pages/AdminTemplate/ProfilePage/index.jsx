import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { 
  Card, 
  Typography, 
  Form, 
  Input, 
  Button, 
  message, 
  Space, 
  Avatar, 
  Divider,
  Row,
  Col,
  Statistic,
  Tag
} from "antd";
import { 
  UserOutlined, 
  SaveOutlined, 
  LogoutOutlined, 
  CrownOutlined,
  MailOutlined,
  PhoneOutlined,
  KeyOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ACCESS_TOKEN");
        
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
        form.setFieldsValue({
          taiKhoan: result.data.content.taiKhoan,
          hoTen: result.data.content.hoTen,
          email: result.data.content.email,
          soDt: result.data.content.soDT,
          maLoaiNguoiDung: result.data.content.maLoaiNguoiDung
        });
      } catch (err) {
        console.error('Lỗi khi lấy thông tin admin:', err);
        message.error("Không thể lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [form]);

  const handleUpdateProfile = async (values) => {
    try {
      setUpdateLoading(true);
      const token = localStorage.getItem("ACCESS_TOKEN");
      
      const formData = {
        taiKhoan: userInfo.taiKhoan,
        matKhau: values.matKhau,
        email: values.email,
        soDt: values.soDt,
        maNhom: userInfo.maNhom,
        maLoaiNguoiDung: userInfo.maLoaiNguoiDung,
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
      
      setUserInfo(result.data.content);
      localStorage.setItem("USER_INFO", JSON.stringify(result.data.content));
      
      message.success('Cập nhật thông tin thành công!');
    } catch (err) {
      const errorMsg = err.response?.data?.content || "Không thể cập nhật thông tin";
      message.error(errorMsg);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("USER_INFO");
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER_LOGIN");
    localStorage.removeItem("USER_LOGIN_TOKEN");
    
    window.dispatchEvent(new Event('userLoginChange'));
    
    message.success("Đăng xuất thành công! Bạn đã được chuyển về trang chủ.");
    navigate("/");
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Đang tải thông tin...</div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Không tìm thấy thông tin người dùng</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        <CrownOutlined style={{ marginRight: 12, color: '#faad14' }} />
        Thông tin Admin
      </Title>

      <Row gutter={[24, 24]}>
        {/* Thông tin tổng quan */}
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
              />
              <Title level={4} style={{ margin: '16px 0 8px 0' }}>
                {userInfo.hoTen || "Admin"}
              </Title>
              <Tag color="gold" icon={<CrownOutlined />}>
                Quản trị viên
              </Tag>
              <Divider />
              <Space direction="vertical" size="small">
                <Statistic 
                  title="Tài khoản" 
                  value={userInfo.taiKhoan} 
                  valueStyle={{ fontSize: '16px' }}
                />
                <Statistic 
                  title="Nhóm" 
                  value={userInfo.maNhom || "GP01"} 
                  valueStyle={{ fontSize: '16px' }}
                />
              </Space>
            </div>
          </Card>
        </Col>

        {/* Form cập nhật thông tin */}
        <Col xs={24} md={16}>
          <Card title="Cập nhật thông tin cá nhân">
            <Form
              form={form}
              onFinish={handleUpdateProfile}
              layout="vertical"
              size="large"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Tài khoản"
                    name="taiKhoan"
                  >
                    <Input 
                      prefix={<UserOutlined />}
                      disabled
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ tên"
                    name="hoTen"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />}
                      placeholder="Nhập họ tên"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
                  >
                    <Input 
                      prefix={<MailOutlined />}
                      placeholder="Nhập email"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="soDt"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input 
                      prefix={<PhoneOutlined />}
                      placeholder="Nhập số điện thoại"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Mật khẩu mới"
                    name="matKhau"
                    rules={[{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }]}
                  >
                    <Input.Password 
                      prefix={<KeyOutlined />}
                      placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Loại người dùng"
                    name="maLoaiNguoiDung"
                  >
                    <Input 
                      value={userInfo.maLoaiNguoiDung === "QuanTri" ? "Quản trị viên" : "Khách hàng"}
                      disabled
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Space size="middle">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  loading={updateLoading}
                  size="large"
                >
                  {updateLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </Button>
                
                <Button 
                  danger 
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  size="large"
                >
                  Đăng xuất
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Space, Row, Col, Divider } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserAddOutlined } from "@ant-design/icons";
import api from "../../../services/api";
import BearAvatar from "../LoginPage/BearAvatar";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('idle');
  const [userValue, setUserValue] = useState('');
  
  const onFinish = async (values) => {
    console.log("RegisterPage onFinish called with:", values);
    try {
      setLoading(true);
      
      // Kiểm tra mật khẩu xác nhận
      if (values.matKhau !== values.confirmPassword) {
        message.error("Mật khẩu xác nhận không khớp");
        setLoading(false);
        return;
      }
      
      const formData = {
        taiKhoan: values.taiKhoan,
        matKhau: values.matKhau,
        xacNhanMatKhau: values.confirmPassword,
        email: values.email,
        soDt: values.soDt,
        maNhom: "GP01", // Sử dụng mã nhóm mặc định
        hoTen: values.hoTen
      };
      
      console.log("RegisterPage sending payload:", formData);
      await api.post("QuanLyNguoiDung/DangKy", formData);
      
      // Đăng ký thành công
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("RegisterPage error:", err);
      console.error("RegisterPage error response:", err.response?.data);
      message.error(err.response?.data?.content || "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <Row justify="center" align="middle">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card 
            bordered={false} 
            style={{ 
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: 8
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <BearAvatar mode={mode} value={userValue} />
              <Title level={2}>Đăng ký tài khoản</Title>
              <Text type="secondary">
                Tạo tài khoản để đặt vé xem phim và nhận các ưu đãi từ Movie Booking
              </Text>
            </div>

            <Form
              form={form}
              name="register"
              layout="vertical"
              onFinish={onFinish}
              scrollToFirstError
            >
              <Form.Item
                name="taiKhoan"
                rules={[
                  { required: true, message: 'Vui lòng nhập tài khoản!' },
                  { min: 4, message: 'Tài khoản phải có ít nhất 4 ký tự!' },
                ]}
              >
                <Input 
                  size="large"
                  prefix={<UserOutlined />} 
                  placeholder="Tài khoản" 
                  onFocus={() => setMode('user')}
                  onBlur={() => setMode('idle')}
                  onChange={(e) => setUserValue(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="hoTen"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input 
                  size="large"
                  prefix={<UserAddOutlined />} 
                  placeholder="Họ tên" 
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input 
                  size="large"
                  prefix={<MailOutlined />} 
                  placeholder="Email" 
                />
              </Form.Item>

              <Form.Item
                name="soDt"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ bao gồm các chữ số!' }
                ]}
              >
                <Input 
                  size="large"
                  prefix={<PhoneOutlined />} 
                  placeholder="Số điện thoại" 
                />
              </Form.Item>

              <Form.Item
                name="matKhau"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password 
                  size="large"
                  prefix={<LockOutlined />} 
                  placeholder="Mật khẩu" 
                  onFocus={() => setMode('password')}
                  onBlur={() => setMode('idle')}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('matKhau') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  size="large"
                  prefix={<LockOutlined />} 
                  placeholder="Xác nhận mật khẩu" 
                  onFocus={() => setMode('password')}
                  onBlur={() => setMode('idle')}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large"
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Space>
                <Text type="secondary">Bạn đã có tài khoản?</Text>
                <Link to="/login">
                  <Text strong style={{ color: '#1890ff' }}>Đăng nhập ngay</Text>
                </Link>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

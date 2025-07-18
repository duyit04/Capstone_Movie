import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Space, Divider, Row, Col } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import api from "../../../services/api";

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      const result = await api.post("QuanLyNguoiDung/DangNhap", values);
      
      // Lưu thông tin người dùng và token vào localStorage
      localStorage.setItem("USER_LOGIN", JSON.stringify(result.data.content));
      localStorage.setItem("USER_LOGIN_TOKEN", result.data.content.accessToken);
      
      message.success("Đăng nhập thành công!");
      
      // Kiểm tra nếu là admin thì chuyển đến trang admin, còn không thì về trang chủ
      if (result.data.content.maLoaiNguoiDung === "QuanTri") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      message.error(err.response?.data?.content || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <Row justify="center" align="middle">
        <Col xs={24} sm={18} md={14} lg={10} xl={8}>
          <Card 
            bordered={false} 
            style={{ 
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: 8
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={2}>Đăng nhập</Title>
              <Text type="secondary">
                Chào mừng bạn quay trở lại với Movie Booking
              </Text>
            </div>

            <Form
              form={form}
              name="login"
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ remember: true }}
            >
              <Form.Item
                name="taiKhoan"
                rules={[
                  { required: true, message: 'Vui lòng nhập tài khoản!' },
                ]}
              >
                <Input 
                  size="large"
                  prefix={<UserOutlined />} 
                  placeholder="Tài khoản" 
                />
              </Form.Item>

              <Form.Item
                name="matKhau"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                ]}
              >
                <Input.Password 
                  size="large"
                  prefix={<LockOutlined />} 
                  placeholder="Mật khẩu" 
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
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center' }}>
              <Link to="/forgot-password">
                <Text type="secondary" style={{ cursor: 'pointer' }}>
                  Quên mật khẩu?
                </Text>
              </Link>
            </div>

            <Divider>
              <Text type="secondary">Hoặc đăng nhập với</Text>
            </Divider>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Button 
                size="large" 
                icon={<GoogleOutlined />}
                onClick={() => message.info("Tính năng đang phát triển")}
              >
                Google
              </Button>
              <Button 
                size="large" 
                icon={<FacebookOutlined />}
                onClick={() => message.info("Tính năng đang phát triển")}
              >
                Facebook
              </Button>
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Space>
                <Text type="secondary">Bạn chưa có tài khoản?</Text>
                <Link to="/register">
                  <Text strong style={{ color: '#1890ff' }}>Đăng ký ngay</Text>
                </Link>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

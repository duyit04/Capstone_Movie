import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Space, Divider, Row, Col, Modal, notification } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import api from "../../../services/api";

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
      setErrorMessage(""); // Reset error message
      console.log('Đang đăng nhập với:', values);
      
      const result = await api.post("QuanLyNguoiDung/DangNhap", values);
      console.log('Kết quả đăng nhập:', result);
      
      const userInfo = result.data.content;
      
      // Lưu thông tin người dùng và token vào localStorage
      localStorage.setItem("USER_INFO", JSON.stringify(userInfo));
      localStorage.setItem("ACCESS_TOKEN", userInfo.accessToken);
      
      // Thông báo cho header biết về thay đổi đăng nhập
      window.dispatchEvent(new Event('userLoginChange'));
      
      // Thông báo đăng nhập thành công với toast notification đẹp mắt
      if (userInfo.maLoaiNguoiDung === "QuanTri") {
        console.log('Đăng nhập admin thành công');
        notification.success({
          message: 'Đăng nhập thành công!',
          description: `Chào mừng Admin ${userInfo.hoTen || userInfo.taiKhoan}!`,
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          duration: 4,
          placement: 'topRight',
          style: {
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        });
        // Delay để đảm bảo thông báo hiển thị trước khi chuyển trang
        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 1500);
      } else {
        console.log('Đăng nhập user thành công');
        notification.success({
          message: 'Đăng nhập thành công!',
          description: `Chào mừng ${userInfo.hoTen || userInfo.taiKhoan}!`,
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          duration: 4,
          placement: 'topRight',
          style: {
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        });
        // Delay để đảm bảo thông báo hiển thị trước khi chuyển trang
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      
      // Thông báo lỗi chi tiết
      let errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.";
      
      if (err.response) {
        // Có response từ server
        if (err.response.data && err.response.data.content) {
          errorMessage = err.response.data.content;
        } else if (err.response.status === 400) {
          errorMessage = "Thông tin đăng nhập không chính xác!";
        } else if (err.response.status === 500) {
          errorMessage = "Lỗi server, vui lòng thử lại sau!";
        }
      } else if (err.request) {
        // Không có response từ server
        errorMessage = "Không thể kết nối đến server, vui lòng kiểm tra kết nối mạng!";
      }
      
      console.log('Hiển thị thông báo lỗi:', errorMessage);
      
      // Hiển thị lỗi trong modal popup
      setErrorMessage(errorMessage);
      setErrorModalVisible(true);
      
      // Toast notification lỗi đẹp mắt
      notification.error({
        message: 'Đăng nhập thất bại!',
        description: errorMessage,
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
        duration: 5,
        placement: 'topRight',
        style: {
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
    setErrorMessage("");
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

      {/* Modal popup thông báo lỗi thân thiện */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
            <span>Thông báo đăng nhập</span>
          </div>
        }
        open={errorModalVisible}
        onOk={handleErrorModalClose}
        onCancel={handleErrorModalClose}
        okText="Đóng"
        cancelText="Thử lại"
        okButtonProps={{ 
          style: { 
            backgroundColor: '#ff4d4f', 
            borderColor: '#ff4d4f',
            borderRadius: 6
          } 
        }}
        cancelButtonProps={{ 
          style: { 
            borderColor: '#d9d9d9',
            borderRadius: 6
          } 
        }}
        centered
        width={400}
        style={{ borderRadius: 12 }}
      >
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <div style={{ 
            backgroundColor: '#fff2f0', 
            border: '1px solid #ffccc7', 
            borderRadius: 8, 
            padding: 16,
            marginBottom: 16
          }}>
            <ExclamationCircleOutlined style={{ 
              color: '#ff4d4f', 
              fontSize: 32, 
              marginBottom: 8 
            }} />
            <div style={{ color: '#ff4d4f', fontSize: 16, fontWeight: 500 }}>
              {errorMessage}
            </div>
          </div>
          <Text type="secondary">
            Vui lòng kiểm tra lại thông tin đăng nhập và thử lại.
          </Text>
        </div>
      </Modal>
    </div>
  );
}

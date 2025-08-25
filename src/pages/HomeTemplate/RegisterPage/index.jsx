import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Space, Row, Col, Divider, notification, Modal } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserAddOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import api from "../../../services/api";
import BearAvatar from "../LoginPage/BearAvatar";
import { DEFAULT_GROUP_CODE } from "../../../config/constants";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('idle');
  const [userValue, setUserValue] = useState('');
  
  // Tạo API cho notification
  const [notificationApi, contextHolder] = notification.useNotification();
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Kiểm tra mật khẩu xác nhận
      if (values.matKhau !== values.confirmPassword) {
        message.error("Mật khẩu xác nhận không khớp");
        setLoading(false);
        return;
      }
      
      // Kiểm tra và format dữ liệu trước khi gửi
      const formData = {
        taiKhoan: values.taiKhoan?.trim(),
        matKhau: values.matKhau,
        email: values.email?.trim().toLowerCase(),
        soDt: values.soDt?.replace(/\s/g, ''), // Loại bỏ khoảng trắng
        maNhom: DEFAULT_GROUP_CODE,
        hoTen: values.hoTen?.trim()
      };
      
      // Validation bổ sung
      if (!formData.taiKhoan || formData.taiKhoan.length < 4) {
        message.error("Tài khoản phải có ít nhất 4 ký tự!");
        setLoading(false);
        return;
      }
      
      if (!formData.matKhau || formData.matKhau.length < 6) {
        message.error("Mật khẩu phải có ít nhất 6 ký tự!");
        setLoading(false);
        return;
      }
      
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        message.error("Email không hợp lệ!");
        setLoading(false);
        return;
      }
      
      if (!formData.soDt || !/^[0-9]{10,11}$/.test(formData.soDt)) {
        message.error("Số điện thoại phải có 10-11 chữ số!");
        setLoading(false);
        return;
      }
      
      if (!formData.hoTen || formData.hoTen.length < 2) {
        message.error("Họ tên phải có ít nhất 2 ký tự!");
        setLoading(false);
        return;
      }
      
      console.log('📝 Dữ liệu đăng ký:', formData);
      console.log('🔗 API Endpoint:', 'QuanLyNguoiDung/DangKy');
      console.log('📋 MaNhom:', DEFAULT_GROUP_CODE);
      
      // Hiển thị loading message
      message.loading({
        content: `Đang đăng ký tài khoản "${formData.taiKhoan}"...`,
        duration: 0,
        key: 'registerUser'
      });
      
      const result = await api.post("QuanLyNguoiDung/DangKy", formData);
      
      console.log('✅ Kết quả đăng ký:', result);
      
      // Đóng loading message
      message.destroy('registerUser');
      
      // Thông báo thành công đẹp hơn
      message.success({
        content: `🎉 Tài khoản "${formData.taiKhoan}" đã được đăng ký thành công!`,
        duration: 4,
        style: {
          marginTop: '20vh',
          fontSize: '16px',
          fontWeight: 'bold',
        },
        icon: <span style={{ fontSize: '20px' }}>✅</span>,
      });
      
      // Hiển thị notification
      notificationApi.success({
        message: 'Đăng ký thành công',
        description: `Tài khoản "${formData.taiKhoan}" đã được tạo. Vui lòng đăng nhập để sử dụng.`,
        placement: 'topRight',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 5
      });
      
      // Hiển thị modal thông báo
      setTimeout(() => {
        Modal.success({
          title: 'Đăng ký thành công! 🎉',
          content: (
            <div>
              <p>Tài khoản <strong>"{formData.taiKhoan}"</strong> đã được đăng ký thành công!</p>
              <div className="mt-4 p-3 bg-green-50 rounded">
                <p><strong>Thông tin tài khoản:</strong></p>
                <ul className="list-disc list-inside mt-2">
                  <li>Tài khoản: {formData.taiKhoan}</li>
                  <li>Họ tên: {formData.hoTen}</li>
                  <li>Email: {formData.email}</li>
                  <li>Số điện thoại: {formData.soDt}</li>
                </ul>
              </div>
              <p className="mt-3 text-blue-600">Bạn sẽ được chuyển đến trang đăng nhập...</p>
            </div>
          ),
        });
      }, 300);
      
      // Chuyển về trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      
    } catch (err) {
      console.error('❌ Lỗi đăng ký:', err);
      
      // Đóng loading message nếu có
      message.destroy('registerUser');
      
      // Xử lý lỗi chi tiết
      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;
        
        console.log('📊 Chi tiết lỗi server:', {
          status: status,
          data: errorData,
          url: err.config?.url,
          method: err.config?.method
        });
        
        let errorMessage = 'Đã xảy ra lỗi khi đăng ký!';
        
        if (status === 400) {
          // Lỗi Bad Request - thường do dữ liệu không hợp lệ
          if (errorData?.content) {
            errorMessage = errorData.content;
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          } else {
            errorMessage = 'Dữ liệu đăng ký không hợp lệ. Vui lòng kiểm tra lại!';
          }
          
          // Hiển thị notification lỗi
          notificationApi.error({
            message: 'Lỗi đăng ký',
            description: errorMessage,
            placement: 'topRight',
            icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
            duration: 10
          });
          
          // Hiển thị modal thông báo lỗi chi tiết
          Modal.error({
            title: 'Lỗi đăng ký tài khoản',
            content: (
              <div>
                <p><strong>Mã lỗi:</strong> {status} (Bad Request)</p>
                <p><strong>Chi tiết:</strong> {errorMessage}</p>
                <div className="mt-4 p-3 bg-red-50 rounded">
                  <p><strong>Nguyên nhân có thể:</strong></p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Tài khoản đã tồn tại trong hệ thống</li>
                    <li>Email đã được sử dụng</li>
                    <li>Số điện thoại đã được đăng ký</li>
                    <li>Dữ liệu không đúng format</li>
                  </ul>
                </div>
                <p className="mt-3 text-blue-600">Vui lòng kiểm tra và thử lại!</p>
              </div>
            ),
          });
          
        } else if (status === 500) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau!';
        } else if (status === 401) {
          errorMessage = 'Không có quyền đăng ký. Vui lòng liên hệ quản trị viên!';
        }
        
        message.error(errorMessage);
        
      } else if (err.request) {
        // Lỗi network
        const errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!';
        
        message.error(errorMessage);
        
        // Hiển thị notification lỗi network
        notificationApi.error({
          message: 'Lỗi kết nối',
          description: errorMessage,
          placement: 'topRight',
          icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
          duration: 10
        });
        
      } else {
        // Lỗi khác
        const errorMessage = err.message || 'Đã xảy ra lỗi không xác định khi đăng ký!';
        message.error(errorMessage);
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      {contextHolder} {/* Thêm contextHolder để hiển thị notification */}
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
                  { 
                    pattern: /^[a-zA-Z0-9_]+$/, 
                    message: 'Tài khoản chỉ được chứa chữ cái, số và dấu gạch dưới!' 
                  },
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
                  { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ bao gồm các chữ số!' },
                  { min: 10, message: 'Số điện thoại phải có ít nhất 10 chữ số!' },
                  { max: 11, message: 'Số điện thoại không được quá 11 chữ số!' }
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

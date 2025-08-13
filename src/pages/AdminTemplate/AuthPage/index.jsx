import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Content } = Layout;

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Đang đăng nhập admin với:', values);
      
      // Gọi API đăng nhập
      const result = await axios({
        url: 'https://movieapi.cyberlearn.vn/api/QuanLyNguoiDung/DangNhap',
        method: 'POST',
        data: values
      });
      
      console.log('Kết quả đăng nhập admin:', result);
      
      // Lưu thông tin người dùng và token vào localStorage
      const userInfo = result.data.content;
      
      // Kiểm tra quyền admin thực tế
      if (userInfo.maLoaiNguoiDung === 'QuanTri') {
        localStorage.setItem('USER_INFO', JSON.stringify(userInfo));
        localStorage.setItem('ACCESS_TOKEN', userInfo.accessToken);
        
        console.log('Đăng nhập admin thành công');
        // Thông báo đăng nhập thành công với thông tin chi tiết
        message.success({
          content: `Chào mừng Admin ${userInfo.hoTen || userInfo.taiKhoan}! Đăng nhập thành công!`,
          duration: 3,
        });
        navigate('/admin/dashboard');
      } else {
        console.log('Tài khoản không có quyền admin');
        // Thông báo lỗi quyền truy cập
        message.error({
          content: `Tài khoản ${userInfo.taiKhoan} không có quyền truy cập trang quản trị! Vui lòng đăng nhập với tài khoản admin.`,
          duration: 5,
        });
        // Xóa thông tin đăng nhập nếu không phải admin
        localStorage.removeItem('USER_INFO');
        localStorage.removeItem('ACCESS_TOKEN');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập admin:', error);
      
      // Thông báo lỗi chi tiết
      let errorMessage = 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!';
      
      if (error.response) {
        // Có response từ server
        if (error.response.data && error.response.data.content) {
          errorMessage = error.response.data.content;
        } else if (error.response.status === 400) {
          errorMessage = "Thông tin đăng nhập không chính xác!";
        } else if (error.response.status === 500) {
          errorMessage = "Lỗi server, vui lòng thử lại sau!";
        }
      } else if (error.request) {
        // Không có response từ server
        errorMessage = "Không thể kết nối đến server, vui lòng kiểm tra kết nối mạng!";
      }
      
      console.log('Hiển thị thông báo lỗi admin:', errorMessage);
      message.error({
        content: errorMessage,
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout min-h-screen bg-gray-100">
      <Content className="flex items-center justify-center p-4">
        <Card 
          className="w-full max-w-md shadow-lg" 
          variant="borderless"
        >
          <div className="text-center mb-6">
            <Title level={2} className="mb-2">Đăng nhập Admin</Title>
            <p className="text-gray-500">Vui lòng đăng nhập với tài khoản quản trị</p>
          </div>
          
          <Form
            name="admin_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="taiKhoan"
              rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Tài khoản" 
              />
            </Form.Item>

            <Form.Item
              name="matKhau"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full" 
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}

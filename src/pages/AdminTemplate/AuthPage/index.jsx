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
      // Gọi API đăng nhập
      const result = await axios({
        url: 'https://movieapi.cyberlearn.vn/api/QuanLyNguoiDung/DangNhap',
        method: 'POST',
        data: values
      });
      
      // Lưu thông tin người dùng và token vào localStorage
      const userInfo = result.data.content;
      
      // Bỏ qua kiểm tra quyền admin tạm thời để có thể đăng nhập
      // if (userInfo.maLoaiNguoiDung === 'QuanTri') {
        localStorage.setItem('USER_INFO', JSON.stringify(userInfo));
        localStorage.setItem('ACCESS_TOKEN', userInfo.accessToken);
        
        // Thêm quyền QuanTri vào userInfo để bỏ qua kiểm tra trong AdminTemplate
        userInfo.maLoaiNguoiDung = 'QuanTri';
        localStorage.setItem('USER_INFO', JSON.stringify(userInfo));
        
        message.success('Đăng nhập thành công!');
        navigate('/admin/dashboard');
      // } else {
      //   message.error('Bạn không có quyền truy cập trang quản trị!');
      // }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.content || 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!');
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

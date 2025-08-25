import { useState } from 'react';
import { Form, Input, Button, Checkbox, App } from 'antd';
import { UserOutlined, LockOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import BearAvatar from '../../pages/HomeTemplate/LoginPage/BearAvatar';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { saveUserAuth } from '../../lib/auth';

/**
 * Modal đăng nhập (popup) dùng trong Header
 */
export default function LoginModal({ open, onOpenChange, onSwitchRegister }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [bearMode, setBearMode] = useState('idle');
  const [usernameVal, setUsernameVal] = useState('');
  const [pwdStrength, setPwdStrength] = useState(0);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const calcStrength = (val='') => {
    let score = 0; if (val.length >= 6) score += 25; if (val.length >= 10) score += 15; if (/[A-Z]/.test(val)) score += 20; if (/[0-9]/.test(val)) score += 20; if (/[^A-Za-z0-9]/.test(val)) score += 20; return Math.min(score,100);
  };

  const onFinish = async(values)=>{
    try {
      setLoading(true);
      console.log('Đang đăng nhập modal với:', values);
      
      const result = await api.post('QuanLyNguoiDung/DangNhap', values);
      console.log('Kết quả đăng nhập modal:', result);
      
      const userInfo = result.data.content;
      
      // Lưu thông tin người dùng vào localStorage
      saveUserAuth(userInfo);
      
      // Thông báo đăng nhập thành công với thông tin chi tiết
      if (userInfo.maLoaiNguoiDung === 'QuanTri') {
        console.log('Đăng nhập admin thành công từ modal');
        message.success({
          content: `Chào mừng Admin ${userInfo.hoTen || userInfo.taiKhoan}! Đăng nhập thành công!`,
          duration: 3,
        });
        onOpenChange(false);
        // Nếu là admin, chuyển đến trang admin
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('Đăng nhập user thành công từ modal');
        message.success({
          content: `Chào mừng ${userInfo.hoTen || userInfo.taiKhoan}! Đăng nhập thành công!`,
          duration: 3,
        });
        onOpenChange(false);
        // Nếu là user thường, chuyển về trang chủ
        navigate('/', { replace: true });
      }
    } catch(err){
      console.error('Lỗi đăng nhập modal:', err);
      
      // Thông báo lỗi chi tiết
      let errorMessage = 'Đăng nhập thất bại';
      
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
      
      console.log('Hiển thị thông báo lỗi modal:', errorMessage);
      message.error({
        content: errorMessage,
        duration: 5,
      });
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl border border-gray-200">
        <DialogTitle className="sr-only">Đăng Nhập Tài Khoản</DialogTitle>
        <div className="p-8">
          <div className="flex flex-col items-center mb-4">
            <BearAvatar mode={bearMode} value={usernameVal} />
            <h2 className="text-xl font-bold -mt-4 mb-2">Đăng Nhập Tài Khoản</h2>
          </div>
          <Form form={form} layout="vertical" requiredMark={false} initialValues={{remember:true}} onFinish={onFinish}>
            <Form.Item name="taiKhoan" label={<span className="font-medium">Email</span>} rules={[{required:true,message:'Nhập Email'}]}>
              <Input size="large" prefix={<UserOutlined className="text-gray-400" />} placeholder="Nhập Email" autoComplete="username" onFocus={()=>setBearMode('user')} onBlur={()=> setTimeout(()=> setBearMode(prev=> prev==='password'?prev:'idle'),100)} onChange={(e)=> {setUsernameVal(e.target.value); if(bearMode!=='password') setBearMode('user');}} />
            </Form.Item>
            <Form.Item name="matKhau" label={<span className="font-medium">Mật khẩu</span>} rules={[{required:true,message:'Nhập mật khẩu'}]}>
              <Input.Password size="large" prefix={<LockOutlined className="text-gray-400" />} placeholder="Nhập Mật khẩu" onChange={(e)=> setPwdStrength(calcStrength(e.target.value))} onFocus={()=> setBearMode('password')} onBlur={()=> setTimeout(()=> setBearMode(prev=> prev==='user'?prev:'idle'),120)} />
            </Form.Item>
            <div className="flex items-center justify-between mb-4">
              <Form.Item name="remember" valuePropName="checked" noStyle><Checkbox>Ghi nhớ</Checkbox></Form.Item>
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600">Quên mật khẩu?</Link>
            </div>
            <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<ThunderboltOutlined />} className="w-full h-11 font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 border-0 shadow">Đăng nhập</Button>
            <div className="mt-6 text-center text-sm text-gray-600">Bạn chưa có tài khoản? <button type="button" className="text-orange-600 font-semibold hover:underline" onClick={()=> { onOpenChange(false); onSwitchRegister && onSwitchRegister(); }}>Đăng ký</button></div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

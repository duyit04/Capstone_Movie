import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, App } from 'antd';
import { UserOutlined, LockOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import BearAvatar from '../../pages/HomeTemplate/LoginPage/BearAvatar';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Modal đăng ký (popup) dùng trong Header
 */
export default function RegisterModal({ open, onOpenChange, onSwitchLogin }) {
  const [loading, setLoading] = useState(false);
  const [bearMode, setBearMode] = useState('idle');
  const [usernameVal, setUsernameVal] = useState('');
  const [pwdStrength, setPwdStrength] = useState(0);
  const navigate = useNavigate();
  const { message } = App.useApp();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const calcStrength = (val='') => {
    let score = 0; if (val.length >= 6) score += 25; if (val.length >= 10) score += 15; if (/[A-Z]/.test(val)) score += 20; if (/[0-9]/.test(val)) score += 20; if (/[^A-Za-z0-9]/.test(val)) score += 20; return Math.min(score,100);
  };

  const submit = async(values) => {
    try {
      setLoading(true);
      const result = await api.post('QuanLyNguoiDung/DangKy', values);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      onOpenChange(false);
      onSwitchLogin && onSwitchLogin();
      reset();
    } catch(err){
      message.error(err.response?.data?.content || 'Đăng ký thất bại');
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl border border-gray-200">
        <DialogTitle className="sr-only">Đăng Ký Tài Khoản</DialogTitle>
        <div className="p-8">
          <div className="flex flex-col items-center mb-2">
            <BearAvatar mode={bearMode} value={usernameVal} />
            <h2 className="text-xl font-bold -mt-4 mb-2">Đăng Ký Tài Khoản</h2>
          </div>
          <form onSubmit={handleSubmit(submit)} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Tài khoản</label>
              <input {...register('taiKhoan')} className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nhập tài khoản" onFocus={()=> setBearMode('user')} onBlur={()=> setTimeout(()=> setBearMode('idle'),100)} onChange={(e)=> setUsernameVal(e.target.value)} />
              {errors.taiKhoan && <p className="text-xs text-red-500 mt-1">{errors.taiKhoan.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Họ tên</label>
              <input {...register('hoTen')} className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nhập họ tên" />
              {errors.hoTen && <p className="text-xs text-red-500 mt-1">{errors.hoTen.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" {...register('email')} className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nhập email" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Mật khẩu</label>
              <input type="password" {...register('matKhau')} className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nhập mật khẩu" onFocus={()=> setBearMode('password')} onBlur={()=> setTimeout(()=> setBearMode('idle'),120)} onChange={(e)=> setPwdStrength(calcStrength(e.target.value))} />
              {errors.matKhau && <p className="text-xs text-red-500 mt-1">{errors.matKhau.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Xác nhận mật khẩu</label>
              <input type="password" {...register('xacNhanMatKhau')} className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nhập lại mật khẩu" />
              {errors.xacNhanMatKhau && <p className="text-xs text-red-500 mt-1">{errors.xacNhanMatKhau.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Số điện thoại</label>
              <input {...register('soDT')} className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nhập số điện thoại" />
              {errors.soDT && <p className="text-xs text-red-500 mt-1">{errors.soDT.message}</p>}
            </div>
            <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<ThunderboltOutlined />} className="w-full h-11 font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 border-0 shadow">Đăng ký</Button>
            <div className="mt-6 text-center text-sm text-gray-600">Bạn đã có tài khoản? <button type="button" className="text-orange-600 font-semibold hover:underline" onClick={()=> { onOpenChange(false); onSwitchLogin && onSwitchLogin(); }}>Đăng nhập</button></div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

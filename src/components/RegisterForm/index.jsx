import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { useTheme } from '../../context/ThemeContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { DEFAULT_GROUP_CODE } from "../../config/constants";

// Định nghĩa schema validation với Zod
const registerSchema = z.object({
  taiKhoan: z
    .string()
    .min(3, "Tài khoản phải có ít nhất 3 ký tự")
    .max(20, "Tài khoản không được quá 20 ký tự"),
  matKhau: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số"),
  xacNhanMatKhau: z.string(),
  email: z.string().email("Email không hợp lệ"),
  soDt: z.string().regex(/^\d{10,11}$/, "Số điện thoại phải có 10-11 số"),
  hoTen: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
}).refine((data) => data.matKhau === data.xacNhanMatKhau, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["xacNhanMatKhau"],
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
      xacNhanMatKhau: "",
      email: "",
      soDt: "",
      hoTen: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      // Gọi API đăng ký
      const response = await api.post("/QuanLyNguoiDung/DangKy", {
        ...data,
        maNhom: DEFAULT_GROUP_CODE,
      });
      
      // Xử lý thành công
      navigate("/login", { 
        state: { 
          successMessage: "Đăng ký thành công! Vui lòng đăng nhập." 
        } 
      });
    } catch (error) {
      // Xử lý lỗi
      console.error("Đăng ký thất bại:", error);
      setErrorMessage(
        error.response?.data?.content || 
        "Đăng ký thất bại. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-4"
    >
      <Card className={`rounded-xl ${theme==='dark' ? 'bg-slate-800/70 border border-slate-700 shadow-md' : ''}`}>
        <CardHeader>
          <CardTitle className={`text-2xl text-center ${theme==='dark' ? 'text-slate-100' : ''}`}>Đăng Ký</CardTitle>
          <CardDescription className={`text-center ${theme==='dark' ? 'text-slate-400' : ''}`}>
            Tạo tài khoản để đặt vé và theo dõi phim
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm dark:bg-red-900/30 dark:text-red-400">
                {errorMessage}
              </div>
            )}
            
            <div className="space-y-2">
              <label className={`text-sm font-medium ${theme==='dark' ? 'text-slate-200' : ''}`}>Tài khoản</label>
              <input
                {...register("taiKhoan")}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${theme==='dark' ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' : ''}`}
                placeholder="Nhập tài khoản"
              />
              {errors.taiKhoan && (
                <p className="text-red-500 text-xs">{errors.taiKhoan.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className={`text-sm font-medium ${theme==='dark' ? 'text-slate-200' : ''}`}>Họ tên</label>
              <input
                {...register("hoTen")}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${theme==='dark' ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' : ''}`}
                placeholder="Nhập họ tên"
              />
              {errors.hoTen && (
                <p className="text-red-500 text-xs">{errors.hoTen.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className={`text-sm font-medium ${theme==='dark' ? 'text-slate-200' : ''}`}>Email</label>
              <input
                {...register("email")}
                type="email"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${theme==='dark' ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' : ''}`}
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className={`text-sm font-medium ${theme==='dark' ? 'text-slate-200' : ''}`}>Số điện thoại</label>
              <input
                {...register("soDt")}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${theme==='dark' ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' : ''}`}
                placeholder="Nhập số điện thoại"
              />
              {errors.soDt && (
                <p className="text-red-500 text-xs">{errors.soDt.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className={`text-sm font-medium ${theme==='dark' ? 'text-slate-200' : ''}`}>Mật khẩu</label>
              <input
                {...register("matKhau")}
                type="password"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${theme==='dark' ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' : ''}`}
                placeholder="Nhập mật khẩu"
              />
              {errors.matKhau && (
                <p className="text-red-500 text-xs">{errors.matKhau.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className={`text-sm font-medium ${theme==='dark' ? 'text-slate-200' : ''}`}>Xác nhận mật khẩu</label>
              <input
                {...register("xacNhanMatKhau")}
                type="password"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${theme==='dark' ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' : ''}`}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.xacNhanMatKhau && (
                <p className="text-red-500 text-xs">{errors.xacNhanMatKhau.message}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full rounded-full font-semibold"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đăng Ký'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className={`text-sm text-center ${theme==='dark' ? 'text-slate-300' : ''}`}>
            Đã có tài khoản?{' '}
            <a
              href="/login"
              className="text-primary hover:underline"
            >
              Đăng nhập
            </a>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

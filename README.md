# Cyber Movie - Cinema Booking System

## 🚀 Deployment trên Vercel

### **Cấu hình API**

API configuration được lưu trữ trong file `src/config/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: "https://movienew.cybersoft.edu.vn/api/",
  TOKEN_CYBERSOFT: "your_token_here"
};
```

#### **Để thay đổi API hoặc token:**

1. **Chỉnh sửa file** `src/config/api.js`
2. **Commit và push** thay đổi
3. **Redeploy** trên Vercel

### **Ưu điểm của cách này:**

- ✅ **Đơn giản**: Không cần cấu hình biến môi trường
- ✅ **Dễ deploy**: Hoạt động ngay trên Vercel
- ✅ **Dễ maintain**: Tất cả config ở một nơi
- ✅ **Không có vấn đề**: Với Vercel environment variables

### **Tính năng chính:**

- 🎬 Quản lý phim và lịch chiếu
- 🎫 Đặt vé trực tuyến
- 👤 Hệ thống đăng nhập/đăng ký
- 🎭 Giao diện admin cho quản lý
- 📱 Responsive design

### **Công nghệ sử dụng:**

- React 18 + Vite
- Ant Design UI
- Tailwind CSS
- React Router DOM
- Axios API

### **Chạy locally:**

```bash
npm install
npm run dev
```

### **Build cho production:**

```bash
npm run build
```

## 📝 **Lưu ý quan trọng:**

- **Config được lưu trong code**: Dễ dàng thay đổi và deploy
- **Token được bảo mật**: Trong file config riêng biệt
- **Không cần setup**: Biến môi trường phức tạp

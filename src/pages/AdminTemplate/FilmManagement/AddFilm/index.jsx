import { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, InputNumber, Switch, Upload, message, notification, Modal } from "antd";
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../../../services/api";
import moment from "moment";
import { DEFAULT_GROUP_CODE } from "../../../../config/constants";

export default function AddFilm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Tạo API cho notification
  const [notificationApi, contextHolder] = notification.useNotification();
  
  // Hàm xử lý lỗi chung
  const handleError = (error, action) => {
    console.error(`❌ Lỗi khi ${action}:`, error);
    
    // Xử lý các loại lỗi khác nhau
    if (error.response) {
      // Lỗi từ server
      const status = error.response.status;
      const errorMessage = error.response.data?.content || error.response.data?.message || 'Lỗi không xác định';
      
      console.log('📊 Chi tiết lỗi server:', {
        status: status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Hiển thị thông báo lỗi dạng notification
      notificationApi.error({
        message: `Lỗi ${status}: Không thể ${action}`,
        description: errorMessage,
        placement: 'topRight',
        duration: 10,
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      });
      
      // Hiển thị modal thông báo lỗi chi tiết
      Modal.error({
        title: `Không thể ${action}`,
        content: (
          <div>
            <p><strong>Mã lỗi:</strong> {status}</p>
            <p><strong>Chi tiết:</strong> {errorMessage}</p>
            {status === 401 && <p><strong>Lưu ý:</strong> Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.</p>}
            {status === 403 && <p><strong>Lưu ý:</strong> Bạn không có quyền thực hiện thao tác này.</p>}
            {status === 500 && <p><strong>Lưu ý:</strong> Có lỗi xảy ra ở máy chủ. Vui lòng thử lại sau.</p>}
          </div>
        ),
      });
      
      // Hiển thị thông báo dạng message
      if (status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else if (status === 403) {
        message.error(`Bạn không có quyền ${action}!`);
      } else {
        message.error(errorMessage);
      }
    } else if (error.request) {
      // Lỗi network
      console.log('🌐 Lỗi network:', error.request);
      
      // Hiển thị thông báo lỗi network dạng notification
      notificationApi.error({
        message: 'Lỗi kết nối',
        description: `Không thể kết nối đến server khi ${action}. Vui lòng kiểm tra kết nối mạng của bạn.`,
        placement: 'topRight',
        duration: 10,
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      });
      
      // Hiển thị modal thông báo lỗi network
      Modal.error({
        title: 'Lỗi kết nối mạng',
        content: (
          <div>
            <p>Không thể kết nối đến máy chủ khi {action}.</p>
            <p>Vui lòng kiểm tra:</p>
            <ul>
              <li>Kết nối internet của bạn</li>
              <li>Tường lửa hoặc proxy</li>
              <li>Máy chủ có thể đang bảo trì</li>
            </ul>
          </div>
        ),
      });
      
      message.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!");
    } else {
      // Lỗi khác
      console.log('❓ Lỗi không xác định:', error.message);
      
      // Hiển thị thông báo lỗi không xác định dạng notification
      notificationApi.error({
        message: 'Lỗi không xác định',
        description: error.message || `Đã xảy ra lỗi không xác định khi ${action}.`,
        placement: 'topRight',
        duration: 10,
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      });
      
      // Hiển thị modal thông báo lỗi không xác định
      Modal.error({
        title: 'Lỗi không xác định',
        content: (
          <div>
            <p>Đã xảy ra lỗi không xác định khi {action}: {error.message || 'Không có thông tin chi tiết.'}</p>
            <p>Vui lòng thử lại sau hoặc liên hệ quản trị viên nếu lỗi vẫn tiếp tục.</p>
          </div>
        ),
      });
      
      message.error(error.message || "Lỗi không xác định");
    }
  };
  
  useEffect(() => {
    // Check if user is admin
    const userInfo = localStorage.getItem("USER_INFO") || localStorage.getItem("USER_LOGIN");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.maLoaiNguoiDung !== "QuanTri") {
        message.error("Bạn không có quyền truy cập trang này!");
        navigate("/");
        return;
      }
    } else {
      message.error("Vui lòng đăng nhập để truy cập trang này!");
      navigate("/admin/login");
      return;
    }
  }, [navigate]);
  
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file hình ảnh!');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước hình phải nhỏ hơn 2MB!');
    }
    
    // Preview image
    if (isImage && isLt2M) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    
    // Return false to prevent automatic upload
    return false;
  };
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("accessToken");
      
      if (!token) {
        message.error("Không tìm thấy thông tin đăng nhập!");
        navigate("/admin/login");
        return;
      }
      
      if (!imageFile) {
        message.error("Vui lòng chọn hình ảnh cho phim!");
        setLoading(false);
        return;
      }
      
      // Hiển thị loading message
      message.loading({
        content: `Đang thêm phim "${values.tenPhim}"...`,
        duration: 0,
        key: 'addMovie'
      });
      
      const formData = new FormData();
      formData.append("tenPhim", values.tenPhim);
      formData.append("trailer", values.trailer);
      formData.append("moTa", values.moTa);
      formData.append("ngayKhoiChieu", moment(values.ngayKhoiChieu).format("DD/MM/YYYY"));
      formData.append("dangChieu", values.dangChieu || false);
      formData.append("sapChieu", values.sapChieu || false);
      formData.append("hot", values.hot || false);
      formData.append("danhGia", values.danhGia);
      formData.append("maNhom", DEFAULT_GROUP_CODE);
      formData.append("hinhAnh", imageFile);
      
      await api.post("QuanLyPhim/ThemPhimUploadHinh", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      
      // Đóng loading message
      message.destroy('addMovie');
      
      // Thông báo thành công chi tiết hơn
      message.success({
        content: `🎬 Phim "${values.tenPhim}" đã được thêm thành công!`,
        duration: 4,
        style: {
          marginTop: '20vh',
          fontSize: '16px',
          fontWeight: 'bold',
        },
        icon: <span style={{ fontSize: '20px' }}>🎉</span>,
      });
      
      // Hiển thị notification
      notificationApi.success({
        message: 'Thêm phim thành công',
        description: `Phim "${values.tenPhim}" đã được thêm vào hệ thống.`,
        placement: 'topRight',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 5
      });
      
      // Hiển thị modal thông báo
      setTimeout(() => {
        Modal.success({
          title: 'Thêm phim thành công!',
          content: `Phim "${values.tenPhim}" đã được thêm vào hệ thống.`,
        });
      }, 300);
      
      // Hiển thị thông tin chi tiết về phim đã thêm
      console.log('🎬 Phim đã được thêm thành công:', {
        tenPhim: values.tenPhim,
        ngayKhoiChieu: values.ngayKhoiChieu,
        dangChieu: values.dangChieu,
        sapChieu: values.sapChieu,
        hot: values.hot,
        danhGia: values.danhGia
      });
      
      // Reset form và chuyển về trang quản lý phim
      form.resetFields();
      setImageFile(null);
      setPreviewImage(null);
      
      // Chuyển về trang quản lý phim sau 1 giây để người dùng thấy thông báo
      setTimeout(() => {
        navigate("/admin/films");
      }, 1000);
    } catch (err) {
      console.error("Failed to add movie:", err);
      
      // Đóng loading message nếu có
      message.destroy('addMovie');
      
      // Kiểm tra nếu token hết hạn hoặc không hợp lệ
      if (err.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        navigate("/admin/login");
        return;
      }
      
      // Sử dụng hàm xử lý lỗi chung
      handleError(err, `thêm phim "${values.tenPhim}"`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      {contextHolder} {/* Thêm contextHolder để hiển thị notification */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Thêm phim mới</h1>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            dangChieu: false,
            sapChieu: false,
            hot: false,
            danhGia: 5,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="tenPhim"
              label="Tên phim"
              rules={[{ required: true, message: "Vui lòng nhập tên phim!" }]}
            >
              <Input placeholder="Nhập tên phim" />
            </Form.Item>
            
            <Form.Item
              name="trailer"
              label="Trailer URL"
              rules={[
                { required: true, message: "Vui lòng nhập URL trailer!" },
                { type: 'url', message: "URL không hợp lệ!" },
              ]}
            >
              <Input placeholder="https://www.youtube.com/watch?v=..." />
            </Form.Item>
            
            <Form.Item
              name="ngayKhoiChieu"
              label="Ngày khởi chiếu"
              rules={[{ required: true, message: "Vui lòng chọn ngày khởi chiếu!" }]}
            >
              <DatePicker 
                placeholder="Chọn ngày" 
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
            
            <Form.Item
              name="danhGia"
              label="Đánh giá (1-10)"
              rules={[
                { required: true, message: "Vui lòng nhập đánh giá!" },
                { type: 'number', min: 1, max: 10, message: "Đánh giá phải từ 1-10!" },
              ]}
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="hinhAnh"
              label="Hình ảnh"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
            >
              <Upload
                name="hinhAnh"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                {previewImage ? (
                  <img src={previewImage} alt="Poster" style={{ width: '100%' }} />
                ) : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Chọn hình</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            
            <div className="flex flex-col gap-4">
              <Form.Item
                name="trangThai"
                label="Trạng thái phim"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái phim!" }]}
              >
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="trangThai"
                      value="dangChieu"
                      className="mr-2"
                      onChange={(e) => {
                        if (e.target.checked) {
                          form.setFieldsValue({
                            dangChieu: true,
                            sapChieu: false
                          });
                        }
                      }}
                    />
                    <span className="text-green-600 font-medium">Đang chiếu</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="trangThai"
                      value="sapChieu"
                      className="mr-2"
                      onChange={(e) => {
                        if (e.target.checked) {
                          form.setFieldsValue({
                            dangChieu: false,
                            sapChieu: true
                          });
                        }
                      }}
                    />
                    <span className="text-blue-600 font-medium">Sắp chiếu</span>
                  </label>
                </div>
              </Form.Item>
              
              {/* Hidden fields để gửi dữ liệu */}
              <Form.Item name="dangChieu" hidden>
                <input type="hidden" />
              </Form.Item>
              
              <Form.Item name="sapChieu" hidden>
                <input type="hidden" />
              </Form.Item>
              
              {/* Trạng thái Hot - có thể chọn hoặc không */}
              <Form.Item
                name="hot"
                label="Hot"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>
          </div>
          
          <Form.Item
            name="moTa"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả phim" />
          </Form.Item>
          
          <Form.Item>
            <div className="flex justify-between">
              <Button onClick={() => navigate("/admin/films")}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm phim
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

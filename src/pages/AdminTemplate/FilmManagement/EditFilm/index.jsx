import { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, InputNumber, Switch, Upload, message, notification, Modal, Radio } from "antd";
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../services/api";
import moment from "moment";
import { DEFAULT_GROUP_CODE } from "../../../../config/constants";

export default function EditFilm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
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
    // Kiểm tra quyền truy cập
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
    
    // Fetch movie details
    fetchMovieDetails();
  }, [id, navigate]);

  // Thêm useEffect để sync radio buttons với form values
  useEffect(() => {
    const dangChieu = form.getFieldValue('dangChieu');
    const sapChieu = form.getFieldValue('sapChieu');
    
    if (dangChieu !== undefined && sapChieu !== undefined) {
      const trangThai = dangChieu ? 'dangChieu' : 'sapChieu';
      form.setFieldsValue({ trangThai });
      
      // Debug log để kiểm tra sync
      console.log('🔄 Sync trạng thái phim:', {
        dangChieu,
        sapChieu,
        trangThai
      });
    }
  }, [form]);
  
  const fetchMovieDetails = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("accessToken");
      
      if (!token) {
        message.error("Không tìm thấy thông tin đăng nhập!");
        navigate("/admin/login");
        return;
      }
      
      const result = await api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
            const movie = result.data.content;
      
      // Debug log để kiểm tra dữ liệu từ API
      console.log('📽️ Dữ liệu phim từ API:', {
        tenPhim: movie.tenPhim,
        dangChieu: movie.dangChieu,
        sapChieu: movie.sapChieu,
        trangThai: movie.dangChieu ? 'dangChieu' : 'sapChieu'
      });
      
      // Set form values
      form.setFieldsValue({
        tenPhim: movie.tenPhim,
        trailer: movie.trailer,
        moTa: movie.moTa,
        ngayKhoiChieu: moment(movie.ngayKhoiChieu),
        dangChieu: movie.dangChieu,
        sapChieu: movie.sapChieu,
        hot: movie.hot,
        danhGia: movie.danhGia,
        // Thêm trạng thái tổng hợp
        trangThai: movie.dangChieu ? 'dangChieu' : 'sapChieu'
      });
      
      // Set preview image
      setPreviewImage(movie.hinhAnh);
    } catch (err) {
      console.error("Failed to fetch movie details:", err);
      handleError(err, "tải thông tin phim");
    } finally {
      setLoadingData(false);
    }
  };
  
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
      
      // Hiển thị loading message
      message.loading({
        content: `Đang cập nhật phim "${values.tenPhim}"...`,
        duration: 0,
        key: 'editMovie'
      });
      
      const formData = new FormData();
      formData.append("maPhim", id);
      formData.append("tenPhim", values.tenPhim);
      formData.append("trailer", values.trailer);
      formData.append("moTa", values.moTa);
      formData.append("ngayKhoiChieu", moment(values.ngayKhoiChieu).format("DD/MM/YYYY"));
      formData.append("dangChieu", values.dangChieu || false);
      formData.append("sapChieu", values.sapChieu || false);
      formData.append("hot", values.hot || false);
      formData.append("danhGia", values.danhGia);
      formData.append("maNhom", DEFAULT_GROUP_CODE);
      
      // Only append image if a new one was selected
      if (imageFile) {
        formData.append("hinhAnh", imageFile);
      }
      
      await api.post("QuanLyPhim/CapNhatPhimUpload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      
      // Đóng loading message
      message.destroy('editMovie');
      
      // Thông báo cập nhật thành công đẹp hơn
      message.success({
        content: `✏️ Phim "${values.tenPhim}" đã được cập nhật thành công!`,
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
        message: 'Cập nhật phim thành công',
        description: `Phim "${values.tenPhim}" đã được cập nhật.`,
        placement: 'topRight',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 5
      });
      
      // Hiển thị modal thông báo
      setTimeout(() => {
        Modal.success({
          title: 'Cập nhật phim thành công!',
          content: `Phim "${values.tenPhim}" đã được cập nhật.`,
        });
      }, 300);
      
      // Hiển thị thông tin chi tiết về phim đã cập nhật
      console.log('✏️ Phim đã được cập nhật thành công:', {
        tenPhim: values.tenPhim,
        ngayKhoiChieu: values.ngayKhoiChieu,
        trangThai: values.trangThai,
        dangChieu: values.dangChieu,
        sapChieu: values.sapChieu,
        hot: values.hot,
        danhGia: values.danhGia
      });
      
      // Chuyển về trang quản lý phim sau 1 giây để người dùng thấy thông báo
      setTimeout(() => {
        navigate("/admin/films");
      }, 1000);
    } catch (err) {
      console.error("Failed to update movie:", err);
      
      // Đóng loading message nếu có
      message.destroy('editMovie');
      
      // Sử dụng hàm xử lý lỗi chung
      handleError(err, `cập nhật phim "${values.tenPhim}"`);
    } finally {
      setLoading(false);
    }
  };
  
  if (loadingData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải thông tin phim...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      {contextHolder} {/* Thêm contextHolder để hiển thị notification */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Chỉnh sửa phim</h1>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
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
                help="Chọn trạng thái hiện tại của phim"
              >
                <Radio.Group
                  onChange={(e) => {
                    const value = e.target.value;
                    form.setFieldsValue({
                      trangThai: value,
                      dangChieu: value === 'dangChieu',
                      sapChieu: value === 'sapChieu'
                    });
                  }}
                >
                  <Radio value="dangChieu" className="text-green-600 font-medium">
                    🎬 Đang chiếu
                  </Radio>
                  <Radio value="sapChieu" className="text-blue-600 font-medium">
                    📅 Sắp chiếu
                  </Radio>
                </Radio.Group>
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
                Cập nhật phim
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

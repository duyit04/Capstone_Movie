import { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, InputNumber, Switch, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../../../services/api";
import moment from "moment";

export default function AddFilm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  useEffect(() => {
    // Check if user is admin
    const userInfo = localStorage.getItem("USER_INFO");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.maLoaiNguoiDung !== "QuanTri") {
        message.error("Bạn không có quyền truy cập trang này!");
        navigate("/");
      }
    } else {
      navigate("/admin/login");
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
      const token = localStorage.getItem("ACCESS_TOKEN");
      
      if (!token) {
        message.error("Bạn chưa đăng nhập!");
        navigate("/admin/login");
        return;
      }
      
      if (!imageFile) {
        message.error("Vui lòng chọn hình ảnh cho phim!");
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append("tenPhim", values.tenPhim);
      formData.append("trailer", values.trailer);
      formData.append("moTa", values.moTa);
      formData.append("ngayKhoiChieu", moment(values.ngayKhoiChieu).format("DD/MM/YYYY"));
      formData.append("dangChieu", values.dangChieu || false);
      formData.append("sapChieu", values.sapChieu || false);
      formData.append("hot", values.hot || false);
      formData.append("danhGia", values.danhGia);
      formData.append("maNhom", "GP01");
      formData.append("hinhAnh", imageFile);
      
      await api.post("QuanLyPhim/ThemPhimUploadHinh", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      
      message.success("Thêm phim thành công!");
      navigate("/admin/films");
    } catch (err) {
      console.error("Failed to add movie:", err);
      
      // Kiểm tra nếu token hết hạn hoặc không hợp lệ
      if (err.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        navigate("/admin/login");
        return;
      }
      
      message.error("Không thể thêm phim: " + (err.response?.data?.content || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
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
                name="dangChieu"
                label="Đang chiếu"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name="sapChieu"
                label="Sắp chiếu"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              
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

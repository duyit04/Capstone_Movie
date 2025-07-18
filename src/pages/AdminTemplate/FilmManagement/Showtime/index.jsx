import { useState, useEffect } from "react";
import { Form, Button, Select, DatePicker, InputNumber, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../services/api";
import moment from "moment";

const { Option } = Select;

export default function ShowtimeManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [cinemaComplexes, setCinemaComplexes] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  
  useEffect(() => {
    // Check if user is admin
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.maLoaiNguoiDung !== "QuanTri") {
        message.error("Bạn không có quyền truy cập trang này!");
        navigate("/");
        return;
      }
    } else {
      navigate("/login");
      return;
    }
    
    // Fetch movie info and cinema systems
    fetchMovieInfo();
    fetchCinemaSystems();
  }, [id, navigate]);
  
  const fetchMovieInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      const result = await api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMovieInfo(result.data.content);
    } catch (err) {
      console.error("Failed to fetch movie info:", err);
      message.error("Không thể tải thông tin phim!");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCinemaSystems = async () => {
    try {
      setLoading(true);
      
      const result = await api.get("QuanLyRap/LayThongTinHeThongRap");
      
      setCinemas(result.data.content);
    } catch (err) {
      console.error("Failed to fetch cinema systems:", err);
      message.error("Không thể tải danh sách hệ thống rạp!");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCinemaComplexes = async (cinemaId) => {
    try {
      setLoading(true);
      
      const result = await api.get(`QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${cinemaId}`);
      
      setCinemaComplexes(result.data.content);
    } catch (err) {
      console.error("Failed to fetch cinema complexes:", err);
      message.error("Không thể tải danh sách cụm rạp!");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCinemaChange = (value) => {
    setSelectedCinema(value);
    form.setFieldsValue({ maRap: undefined }); // Reset cinema complex selection
    fetchCinemaComplexes(value);
  };
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        message.error("Bạn chưa đăng nhập!");
        navigate("/login");
        return;
      }
      
      // Format date and time for API
      const formattedDateTime = moment(values.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm:ss");
      
      const showtime = {
        maPhim: Number(id),
        ngayChieuGioChieu: formattedDateTime,
        maRap: values.maRap,
        giaVe: values.giaVe,
      };
      
      await api.post("QuanLyDatVe/TaoLichChieu", showtime, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      message.success("Tạo lịch chiếu thành công!");
      navigate("/admin/films");
    } catch (err) {
      console.error("Failed to create showtime:", err);
      message.error("Không thể tạo lịch chiếu: " + (err.response?.data?.content || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Tạo lịch chiếu phim</h1>
        
        {movieInfo && (
          <div className="flex mb-6">
            <img 
              src={movieInfo.hinhAnh} 
              alt={movieInfo.tenPhim} 
              className="w-24 h-36 object-cover rounded mr-4"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/96x144?text=No+Image";
              }}
            />
            <div>
              <h2 className="text-xl font-bold mb-2">{movieInfo.tenPhim}</h2>
              <p className="text-gray-600">{movieInfo.moTa?.substring(0, 200)}...</p>
            </div>
          </div>
        )}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="heThongRap"
            label="Hệ thống rạp"
            rules={[{ required: true, message: "Vui lòng chọn hệ thống rạp!" }]}
          >
            <Select
              placeholder="Chọn hệ thống rạp"
              onChange={handleCinemaChange}
            >
              {cinemas.map((cinema) => (
                <Option key={cinema.maHeThongRap} value={cinema.maHeThongRap}>
                  {cinema.tenHeThongRap}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="maRap"
            label="Cụm rạp"
            rules={[{ required: true, message: "Vui lòng chọn cụm rạp!" }]}
          >
            <Select
              placeholder="Chọn cụm rạp"
              disabled={!selectedCinema}
            >
              {cinemaComplexes.map((complex) => (
                <Option key={complex.maCumRap} value={complex.maCumRap}>
                  {complex.tenCumRap}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="ngayChieuGioChieu"
            label="Ngày chiếu, giờ chiếu"
            rules={[{ required: true, message: "Vui lòng chọn ngày chiếu và giờ chiếu!" }]}
          >
            <DatePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="DD/MM/YYYY HH:mm:ss"
              placeholder="Chọn ngày và giờ chiếu"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="giaVe"
            label="Giá vé (VND)"
            rules={[
              { required: true, message: "Vui lòng nhập giá vé!" },
              { type: 'number', min: 75000, max: 200000, message: "Giá vé phải từ 75,000đ đến 200,000đ!" },
            ]}
          >
            <InputNumber
              min={75000}
              max={200000}
              step={1000}
              defaultValue={75000}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          
          <Form.Item>
            <div className="flex justify-between">
              <Button onClick={() => navigate("/admin/films")}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tạo lịch chiếu
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

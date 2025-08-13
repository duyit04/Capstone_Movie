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
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(id || null);
  
  useEffect(() => {
    // Debug info
    console.log("Showtime management loaded. Film ID:", id);
    
    // Fetch cinema systems regardless of movie ID
    fetchCinemaSystems();
    
    // Fetch list of movies if no specific ID provided
    if (!id) {
      fetchMovieList();
    } else {
      setSelectedMovieId(id);
      fetchMovieInfo(id);
    }
  }, [id, navigate]);
  
  const fetchMovieList = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching movie list");
      const result = await api.get("QuanLyPhim/LayDanhSachPhim?maNhom=GP01");
      
      console.log("Movie list response:", result);
      if (result.data && result.data.content) {
        setMovies(result.data.content);
      } else {
        console.error("API trả về dữ liệu không hợp lệ:", result);
        setError("Không nhận được danh sách phim từ API");
        message.error("Không thể tải danh sách phim!");
      }
    } catch (err) {
      console.error("Failed to fetch movie list:", err);
      setError(err.message || "Không thể tải danh sách phim");
      message.error("Không thể tải danh sách phim: " + (err.response?.data?.content || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieInfo = async (movieId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching movie info for ID:", movieId);
      
      // Kiểm tra movieId
      if (!movieId) {
        console.error("Không có ID phim");
        setError("Không có ID phim");
        return;
      }
      
      const result = await api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${movieId}`);
      
      console.log("Movie info response:", result);
      if (result.data && result.data.content) {
        setMovieInfo(result.data.content);
      } else {
        console.error("API trả về dữ liệu không hợp lệ:", result);
        setError("Không nhận được dữ liệu phim từ API");
        message.error("Không thể tải thông tin phim!");
      }
    } catch (err) {
      console.error("Failed to fetch movie info:", err);
      setError(err.message || "Không thể tải thông tin phim");
      message.error("Không thể tải thông tin phim: " + (err.response?.data?.content || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCinemaSystems = async () => {
    try {
      setLoading(true);
      
      console.log("Fetching cinema systems");
      const result = await api.get("QuanLyRap/LayThongTinHeThongRap");
      
      console.log("Cinema systems response:", result);
      if (result.data && result.data.content) {
        setCinemas(result.data.content);
      } else {
        setError("Không nhận được dữ liệu hệ thống rạp từ API");
        message.error("Không thể tải danh sách hệ thống rạp!");
      }
    } catch (err) {
      console.error("Failed to fetch cinema systems:", err);
      setError(err.message || "Không thể tải danh sách hệ thống rạp");
      message.error("Không thể tải danh sách hệ thống rạp: " + (err.response?.data?.content || err.message));
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
      
      console.log("Form values:", values);
      console.log("Selected movie ID:", selectedMovieId);
      
      // Kiểm tra có phim đã chọn chưa
      if (!selectedMovieId) {
        message.error("Vui lòng chọn phim để tạo lịch chiếu!");
        setLoading(false);
        return;
      }
      
      // Kiểm tra giá vé
      if (!values.giaVe || values.giaVe < 75000 || values.giaVe > 200000) {
        message.error("Giá vé phải từ 75,000đ đến 200,000đ!");
        setLoading(false);
        return;
      }
      
      // Format date and time for API
      const formattedDateTime = moment(values.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm:ss");
      
      const showtime = {
        maPhim: Number(selectedMovieId),
        ngayChieuGioChieu: formattedDateTime,
        maRap: values.maRap,
        giaVe: Number(values.giaVe),
      };
      
      console.log("Showtime data to send:", showtime);
      
      await api.post("QuanLyDatVe/TaoLichChieu", showtime);
      
      message.success("Tạo lịch chiếu thành công!");
      navigate("/admin/films");
    } catch (err) {
      console.error("Failed to create showtime:", err);
      message.error("Không thể tạo lịch chiếu: " + (err.response?.data?.content || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const handleMovieSelect = (movieId) => {
    setSelectedMovieId(movieId);
    fetchMovieInfo(movieId);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Tạo lịch chiếu phim</h1>
        
        {loading && <div className="text-center py-4">Đang tải dữ liệu...</div>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block"> {error}</span>
          </div>
        )}

        {!id && !selectedMovieId && movies.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Chọn phim để tạo lịch chiếu:</h2>
            <Select 
              placeholder="Chọn phim" 
              style={{ width: '100%' }}
              onChange={handleMovieSelect}
            >
              {movies.map((movie) => (
                <Option key={movie.maPhim} value={movie.maPhim}>
                  {movie.tenPhim}
                </Option>
              ))}
            </Select>
          </div>
        )}
        
        {movieInfo && (
          <div className="flex mb-6">
            <img 
              src={movieInfo.hinhAnh} 
              alt={movieInfo.tenPhim} 
              className="w-24 h-36 object-cover rounded mr-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/96x144?text=No+Image";
              }}
            />
            <div>
              <h2 className="text-xl font-bold mb-2">{movieInfo.tenPhim}</h2>
              <p className="text-gray-600">{movieInfo.moTa?.substring(0, 200)}...</p>
            </div>
          </div>
        )}
        
        {(movieInfo || selectedMovieId) && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              giaVe: 75000
            }}
            onValuesChange={(changedValues, allValues) => {
              console.log("Form changed:", changedValues, allValues);
            }}
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
              style={{ width: '100%' }}
              formatter={(value) => {
                if (value) {
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
                return '';
              }}
              parser={(value) => {
                if (typeof value === 'string') {
                  const parsed = value.replace(/\$\s?|(,*)/g, '');
                  return parsed ? Number(parsed) : 75000;
                }
                return value || 75000;
              }}
              placeholder="Nhập giá vé"
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(value)) {
                  form.setFieldsValue({ giaVe: Number(value) });
                }
              }}
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
        )}
      </div>
    </div>
  );
}

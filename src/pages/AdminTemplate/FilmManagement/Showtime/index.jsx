import { useState, useEffect } from "react";
import { Form, Button, Select, DatePicker, InputNumber, message, notification, Modal, Space, Alert, Result, Spin, Card } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../services/api";
import moment from "moment";
import { DEFAULT_GROUP_CODE } from "../../../../config/constants";

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
    
    // Thêm event listener để lắng nghe khi quay lại từ trang khác
    const handleFocus = () => {
      if (!id) {
        fetchMovieList();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [id, navigate]);
  
  const fetchMovieList = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching movie list");
      const result = await api.get(`QuanLyPhim/LayDanhSachPhim?maNhom=${DEFAULT_GROUP_CODE}`);
      
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
      handleError(err, "tải danh sách phim");
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
      handleError(err, "tải thông tin phim");
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
      handleError(err, "tải danh sách hệ thống rạp");
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
      handleError(err, "tải danh sách cụm rạp");
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
      
      // Hiển thị loading message
      message.loading({
        content: `Đang tạo lịch chiếu cho phim "${movieInfo?.tenPhim || 'Phim'}"...`,
        duration: 0,
        key: 'createShowtime'
      });
      
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
      
      // Đóng loading message nếu có
      message.destroy('createShowtime');
      
      // Thông báo thành công đẹp hơn
      message.success({
        content: `🎬 Lịch chiếu đã được tạo thành công!`,
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
        message: 'Tạo lịch chiếu thành công',
        description: `Lịch chiếu cho phim "${movieInfo?.tenPhim || 'Phim'}" đã được tạo.`,
        placement: 'topRight',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 5
      });
      
      // Hiển thị modal thông báo
      setTimeout(() => {
        Modal.success({
          title: 'Tạo lịch chiếu thành công!',
          content: (
            <div>
              <p>Lịch chiếu cho phim <strong>"{movieInfo?.tenPhim || 'Phim'}"</strong> đã được tạo thành công!</p>
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p><strong>Chi tiết lịch chiếu:</strong></p>
                <ul className="list-disc list-inside mt-2">
                  <li>Ngày chiếu: {moment(values.ngayChieuGioChieu).format('DD/MM/YYYY')}</li>
                  <li>Giờ chiếu: {moment(values.ngayChieuGioChieu).format('HH:mm')}</li>
                  <li>Giá vé: {values.giaVe?.toLocaleString('vi-VN')} VNĐ</li>
                </ul>
              </div>
            </div>
          ),
        });
      }, 300);
      
      // Hiển thị thông tin chi tiết về lịch chiếu đã tạo
      console.log('🎬 Lịch chiếu đã được tạo thành công:', {
        maPhim: selectedMovieId,
        tenPhim: movieInfo?.tenPhim,
        ngayChieuGioChieu: formattedDateTime,
        maRap: values.maRap,
        giaVe: values.giaVe
      });
      
      // Reset form
      form.resetFields();
      
      // Chuyển về trang quản lý phim sau 2 giây để người dùng thấy thông báo
      setTimeout(() => {
        navigate("/admin/films");
      }, 2000);
    } catch (err) {
      console.error("Failed to create showtime:", err);
      
      // Đóng loading message nếu có
      message.destroy('createShowtime');
      
      // Sử dụng hàm xử lý lỗi chung
      handleError(err, `tạo lịch chiếu cho phim "${movieInfo?.tenPhim || 'Phim'}"`);
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
      {contextHolder} {/* Thêm contextHolder để hiển thị notification */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tạo lịch chiếu phim</h1>
            <p className="text-gray-600 text-sm mt-1">
              🎬 Tạo lịch chiếu mới cho phim trong hệ thống
            </p>
          </div>
          <Button onClick={() => navigate("/admin/films")}>
            Quay lại
          </Button>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}
        
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            className="mb-6"
            action={
              <Button size="small" danger onClick={() => setError(null)}>
                Đóng
              </Button>
            }
          />
        )}

        {!id && !selectedMovieId && movies.length > 0 && (
          <Card className="mb-6" size="small">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <InfoCircleOutlined className="mr-2 text-blue-500" />
              Chọn phim để tạo lịch chiếu:
            </h2>
            <Select 
              placeholder="Chọn phim từ danh sách" 
              style={{ width: '100%' }}
              onChange={handleMovieSelect}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {movies.map((movie) => (
                <Option key={movie.maPhim} value={movie.maPhim}>
                  <div className="flex items-center">
                    <img 
                      src={movie.hinhAnh} 
                      alt={movie.tenPhim} 
                      className="w-8 h-12 object-cover rounded mr-2"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/32x48?text=No+Img";
                      }}
                    />
                    <span>{movie.tenPhim}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Card>
        )}
        
        {movieInfo && (
          <Card className="mb-6" size="small">
            <div className="flex items-start">
              <img 
                src={movieInfo.hinhAnh} 
                alt={movieInfo.tenPhim} 
                className="w-24 h-36 object-cover rounded mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/96x144?text=No+Image";
                }}
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 text-blue-600">{movieInfo.tenPhim}</h2>
                <p className="text-gray-600 mb-2">{movieInfo.moTa?.substring(0, 200)}...</p>
                <Space size="small">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {movieInfo.dangChieu ? 'Đang chiếu' : 'Sắp chiếu'}
                  </span>
                  {movieInfo.hot && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Hot
                    </span>
                  )}
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    ⭐ {movieInfo.danhGia}/10
                  </span>
                </Space>
              </div>
            </div>
          </Card>
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

import { useState, useEffect } from "react";
import { Table, Space, Button, Input, Popconfirm, message, notification, Modal } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { DEFAULT_GROUP_CODE } from "../../../config/constants";

export default function FilmManagement() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  
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
  
  // Kiểm tra token xác thực
  const checkAuth = () => {
    const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("accessToken");
    if (!token) {
      message.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại!");
      return false;
    }
    return token;
  };
  
  useEffect(() => {
    // Kiểm tra xác thực thực tế
    const userInfo = localStorage.getItem("USER_INFO") || localStorage.getItem("USER_LOGIN");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.maLoaiNguoiDung !== "QuanTri") {
        message.error("Bạn không có quyền truy cập trang này!");
        navigate("/");
        return;
      }
    } else {
      navigate("/admin/login");
      return;
    }
    
    fetchMovies();
    
    // Thêm event listener để lắng nghe khi quay lại từ trang thêm phim
    const handleFocus = () => {
      console.log('🔄 Trang được focus lại, refresh danh sách phim...');
      fetchMovies();
    };
    
    // Thêm event listener để lắng nghe khi quay lại từ trang thêm phim
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Trang được hiển thị lại, refresh danh sách phim...');
        fetchMovies();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);
  
  const fetchMovies = async (keyword = "") => {
    try {
      setLoading(true);
      const token = checkAuth();
      if (!token) return;
      
      const url = keyword 
        ? `QuanLyPhim/LayDanhSachPhim?maNhom=${DEFAULT_GROUP_CODE}&tenPhim=${keyword}`
        : `QuanLyPhim/LayDanhSachPhim?maNhom=${DEFAULT_GROUP_CODE}`;
        
      const result = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Sắp xếp phim mới nhất lên đầu (ưu tiên phim mới thêm)
      const sortedMovies = result.data.content.sort((a, b) => {
        // Ưu tiên 1: Sắp xếp theo maPhim (phim mới thường có maPhim lớn hơn)
        const maPhimComparison = Number(b.maPhim) - Number(a.maPhim);
        
        // Ưu tiên 2: Nếu maPhim bằng nhau, sắp xếp theo ngày khởi chiếu mới nhất
        if (maPhimComparison === 0 && a.ngayKhoiChieu && b.ngayKhoiChieu) {
          return new Date(b.ngayKhoiChieu) - new Date(a.ngayKhoiChieu);
        }
        
        return maPhimComparison;
      });
      
      // Debug log để kiểm tra thứ tự sắp xếp
      console.log('🎬 Danh sách phim đã sắp xếp (phim mới nhất lên đầu):', 
        sortedMovies.slice(0, 3).map(m => ({ 
          maPhim: m.maPhim, 
          tenPhim: m.tenPhim, 
          ngayKhoiChieu: m.ngayKhoiChieu 
        }))
      );
      
      setMovies(sortedMovies);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      handleError(err, "tải danh sách phim");
      setMovies([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    fetchMovies(searchText);
  };
  
  const handleDelete = async (movieId) => {
    try {
      setLoading(true);
      const token = checkAuth();
      if (!token) return;
      
      // Tìm thông tin phim trước khi xóa để hiển thị tên
      const movieToDelete = movies.find(movie => movie.maPhim === movieId);
      const movieName = movieToDelete ? movieToDelete.tenPhim : 'Phim';
      
      // Hiển thị loading message
      message.loading({
        content: `Đang xóa phim "${movieName}"...`,
        duration: 0,
        key: 'deleteMovie'
      });
      
      await api.delete(`QuanLyPhim/XoaPhim?MaPhim=${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Đóng loading message
      message.destroy('deleteMovie');
      
      // Thông báo xóa thành công đẹp hơn với tên phim
      message.success({
        content: `🗑️ Phim "${movieName}" đã được xóa thành công!`,
        duration: 3,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
        icon: <span style={{ fontSize: '18px' }}>✅</span>,
      });
      
      // Hiển thị notification
      notificationApi.success({
        message: 'Xóa phim thành công',
        description: `Phim "${movieName}" đã được xóa khỏi hệ thống.`,
        placement: 'topRight',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 5
      });
      
      // Hiển thị modal thông báo
      setTimeout(() => {
        Modal.success({
          title: 'Xóa phim thành công!',
          content: `Phim "${movieName}" đã được xóa khỏi hệ thống.`,
        });
      }, 300);
      
      // Hiển thị thông tin chi tiết về phim đã xóa
      console.log('🗑️ Phim đã được xóa thành công:', {
        maPhim: movieId,
        tenPhim: movieName,
        hinhAnh: movieToDelete?.hinhAnh,
        moTa: movieToDelete?.moTa
      });
      
      fetchMovies(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete movie:", err);
      
      // Đóng loading nếu có
      message.destroy('deleteMovie');
      
      // Sử dụng hàm xử lý lỗi chung
      handleError(err, `xóa phim "${movieToDelete?.tenPhim || 'Phim'}"`);
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    {
      title: "Mã phim",
      dataIndex: "maPhim",
      key: "maPhim",
      sorter: (a, b) => a.maPhim - b.maPhim,
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (text) => (
        <img 
          src={text} 
          alt="Movie" 
          style={{ width: 50, height: 50, objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/50x50?text=No+Image";
          }}
        />
      ),
    },
    {
      title: "Tên phim",
      dataIndex: "tenPhim",
      key: "tenPhim",
      sorter: (a, b) => a.tenPhim.localeCompare(b.tenPhim),
    },
    {
      title: "Mô tả",
      dataIndex: "moTa",
      key: "moTa",
      render: (text) => (
        <p className="truncate max-w-xs">{text}</p>
      ),
    },
    {
      title: "Trạng thái",
      key: "trangThai",
      render: (_, record) => {
        // Hiển thị trạng thái chính (đang chiếu hoặc sắp chiếu)
        let trangThai = '';
        let bgColor = '';
        let textColor = '';
        
        if (record.dangChieu) {
          trangThai = 'Đang chiếu';
          bgColor = 'bg-green-100';
          textColor = 'text-green-800';
        } else if (record.sapChieu) {
          trangThai = 'Sắp chiếu';
          bgColor = 'bg-blue-100';
          textColor = 'text-blue-800';
        } else {
          // Mặc định là sắp chiếu nếu không có trạng thái nào
          trangThai = 'Sắp chiếu';
          bgColor = 'bg-blue-100';
          textColor = 'text-blue-800';
        }
        
        return (
          <Space size="small">
            <span className={`px-2 py-1 ${bgColor} ${textColor} rounded-full text-xs`}>
              {trangThai}
            </span>
            {/* Hiển thị trạng thái Hot nếu có */}
            {record.hot && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                Hot
              </span>
            )}
          </Space>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/films/edit/${record.maPhim}`}>
            <Button type="primary" icon={<EditOutlined />} size="small">
              Sửa
            </Button>
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phim này?"
            onConfirm={() => handleDelete(record.maPhim)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/films/showtime/${record.maPhim}`}>
            <Button icon={<CalendarOutlined />} size="small">
              Tạo lịch chiếu
            </Button>
          </Link>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="container mx-auto py-8">
      {contextHolder} {/* Thêm contextHolder để hiển thị notification */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Quản lý phim</h1>
            <p className="text-gray-600 text-sm mt-1">
              📍 Phim mới thêm sẽ hiển thị ở trên cùng
              <span className="ml-2 text-green-600">
                • Tổng: {movies.length} phim
              </span>
              {lastUpdated && (
                <span className="ml-2 text-blue-600">
                  • Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
                </span>
              )}
            </p>
          </div>
          <Link to="/admin/films/addnew">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Thêm phim mới
            </Button>
          </Link>
        </div>
        
        <div className="mb-6">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Tìm kiếm phim theo tên"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
              allowClear
              style={{ flex: 1, maxWidth: '400px' }}
            />
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                console.log('🔄 Manual refresh danh sách phim...');
                fetchMovies();
                message.success('Đã refresh danh sách phim!');
              }}
              title="Refresh danh sách phim"
            >
              Refresh
            </Button>
          </div>
        </div>
        
        <Table
          columns={columns}
          dataSource={movies}
          rowKey="maPhim"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Table, Space, Button, Input, Popconfirm, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function FilmManagement() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  
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
  }, [navigate]);
  
  const fetchMovies = async (keyword = "") => {
    try {
      setLoading(true);
      const token = checkAuth();
      if (!token) return;
      
      const url = keyword 
        ? `QuanLyPhim/LayDanhSachPhim?maNhom=GP01&tenPhim=${keyword}`
        : "QuanLyPhim/LayDanhSachPhim?maNhom=GP01";
        
      const result = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMovies(result.data.content);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      
      if (err.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else if (err.response?.status === 403) {
        message.error("Bạn không có quyền truy cập danh sách phim!");
      } else {
        message.error("Không thể tải danh sách phim!");
      }
      
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
      
      await api.delete(`QuanLyPhim/XoaPhim?MaPhim=${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      message.success("Xóa phim thành công!");
      fetchMovies(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete movie:", err);
      
      if (err.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        // Có thể redirect về trang login
        // navigate("/admin/login");
      } else if (err.response?.status === 403) {
        message.error("Bạn không có quyền xóa phim này!");
      } else {
        message.error("Không thể xóa phim này!");
      }
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
      render: (_, record) => (
        <Space size="middle">
          {record.dangChieu && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Đang chiếu
            </span>
          )}
          {record.sapChieu && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Sắp chiếu
            </span>
          )}
          {record.hot && (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
              Hot
            </span>
          )}
        </Space>
      ),
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quản lý phim</h1>
          <Link to="/admin/films/addnew">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Thêm phim mới
            </Button>
          </Link>
        </div>
        
        <div className="mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm phim theo tên"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
              allowClear
            />
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
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

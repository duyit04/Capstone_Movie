import { useState, useEffect } from "react";
import { Table, Button, Input, Space, Popconfirm, App, Modal, Form, Select, Tag, Tooltip, Progress } from "antd";
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import api from "../../services/api";
import "./enhanced-table.css";

const { Search } = Input;
const { Option } = Select;

export default function MovieTable() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockMovies = [
        {
          maPhim: 1,
          tenPhim: "Avengers: Endgame",
          moTa: "Khi sự kiện phá hủy một nửa vũ trụ, Avengers còn lại phải đối mặt với những tổn thất và tìm cách khôi phục lại sự cân bằng.",
          hinhAnh: "https://images.unsplash.com/photo-1531259683000-063dcc206147?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          dangChieu: true,
          sapChieu: false,
          hot: true,
          danhGia: 9.0,
          thoiLuong: 181,
          ngayKhoiChieu: "2023-04-26",
          doanhThu: 2798000000,
          theLoai: "Hành động, Viễn tưởng",
          daoDien: "Anthony Russo, Joe Russo"
        },
        {
          maPhim: 2,
          tenPhim: "Spider-Man: No Way Home",
          moTa: "Peter Parker phải đối mặt với những thách thức mới khi danh tính của anh bị tiết lộ.",
          hinhAnh: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          dangChieu: true,
          sapChieu: false,
          hot: false,
          danhGia: 8.5,
          thoiLuong: 148,
          ngayKhoiChieu: "2023-12-17",
          doanhThu: 1902000000,
          theLoai: "Hành động, Phiêu lưu",
          daoDien: "Jon Watts"
        },
        {
          maPhim: 3,
          tenPhim: "Black Panther: Wakanda Forever",
          moTa: "Các quốc gia trên thế giới bắt đầu can thiệp vào Wakanda trong khi cư dân nơi đây phải đối mặt với một mối đe dọa mới.",
          hinhAnh: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          dangChieu: false,
          sapChieu: true,
          hot: true,
          danhGia: 8.8,
          thoiLuong: 161,
          ngayKhoiChieu: "2023-11-11",
          doanhThu: 0,
          theLoai: "Hành động, Siêu anh hùng",
          daoDien: "Ryan Coogler"
        },
        {
          maPhim: 4,
          tenPhim: "The Batman",
          moTa: "Khi Riddler bắt đầu giết hại các quan chức thành phố Gotham, Batman phải điều tra để tìm ra sự thật.",
          hinhAnh: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          dangChieu: false,
          sapChieu: true,
          hot: false,
          danhGia: 8.2,
          thoiLuong: 176,
          ngayKhoiChieu: "2023-03-04",
          doanhThu: 0,
          theLoai: "Hành động, Tội phạm",
          daoDien: "Matt Reeves"
        }
      ];
      setMovies(mockMovies);
      setPagination(prev => ({ ...prev, total: mockMovies.length }));
    } catch (error) {
      message.error("Không thể tải danh sách phim!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      message.warning("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }
    
    const filteredMovies = movies.filter(movie =>
      movie.tenPhim.toLowerCase().includes(searchText.toLowerCase()) ||
      movie.moTa.toLowerCase().includes(searchText.toLowerCase()) ||
      movie.theLoai.toLowerCase().includes(searchText.toLowerCase())
    );
    
    if (filteredMovies.length === 0) {
      message.info("Không tìm thấy phim nào phù hợp!");
    } else {
      message.success(`Tìm thấy ${filteredMovies.length} phim!`);
    }
  };

  const handleDelete = async (maPhim) => {
    try {
      const updatedMovies = movies.filter(movie => movie.maPhim !== maPhim);
      setMovies(updatedMovies);
      setPagination(prev => ({ ...prev, total: updatedMovies.length }));
      message.success("Xóa phim thành công!");
    } catch (error) {
      message.error("Không thể xóa phim!");
    }
  };

  const handleBulkDelete = () => {
    if (selectedMovies.length === 0) {
      message.warning("Vui lòng chọn phim để xóa!");
      return;
    }
    
    const updatedMovies = movies.filter(movie => !selectedMovies.includes(movie.maPhim));
    setMovies(updatedMovies);
    setSelectedMovies([]);
    setPagination(prev => ({ ...prev, total: updatedMovies.length }));
    message.success(`Đã xóa ${selectedMovies.length} phim thành công!`);
  };

  const handleTableChange = (paginationInfo) => {
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    }));
  };

  const handleViewMovie = (maPhim) => {
    navigate(`/movie/${maPhim}`);
  };

  const handleEditMovie = (maPhim) => {
    navigate(`/admin/films/edit/${maPhim}`);
  };

  const handleManageShowtimes = (maPhim) => {
    navigate(`/admin/films/showtime/${maPhim}`);
  };

  const handleAddNewMovie = () => {
    navigate(`/admin/films/addnew`);
  };

  const rowSelection = {
    selectedRowKeys: selectedMovies,
    onChange: (selectedRowKeys) => {
      setSelectedMovies(selectedRowKeys);
    },
  };

  const getFilteredMovies = () => {
    let filtered = movies;

    if (searchText) {
      filtered = filtered.filter(movie =>
        movie.tenPhim.toLowerCase().includes(searchText.toLowerCase()) ||
        movie.moTa.toLowerCase().includes(searchText.toLowerCase()) ||
        movie.theLoai.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      if (filterStatus === "dangChieu") {
        filtered = filtered.filter(movie => movie.dangChieu);
      } else if (filterStatus === "sapChieu") {
        filtered = filtered.filter(movie => movie.sapChieu);
      } else if (filterStatus === "hot") {
        filtered = filtered.filter(movie => movie.hot);
      }
    }

    if (filterRating !== "all") {
      if (filterRating === "high") {
        filtered = filtered.filter(movie => movie.danhGia >= 8.5);
      } else if (filterRating === "medium") {
        filtered = filtered.filter(movie => movie.danhGia >= 7.0 && movie.danhGia < 8.5);
      } else if (filterRating === "low") {
        filtered = filtered.filter(movie => movie.danhGia < 7.0);
      }
    }

    return filtered;
  };

  const filteredMovies = getFilteredMovies();

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      width: 120,
      render: (image, record) => (
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={image}
            alt={record.tenPhim}
            className="w-20 h-28 object-cover rounded-lg shadow-md transform transition-all duration-300 group-hover:scale-110 cursor-pointer"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
            }}
            onClick={() => handleViewMovie(record.maPhim)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
            <Tooltip title="Xem chi tiết">
              <EyeOutlined 
                className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" 
                onClick={() => handleViewMovie(record.maPhim)}
              />
            </Tooltip>
          </div>
        </motion.div>
      ),
    },
    {
      title: "Thông tin phim",
      key: "movieInfo",
      render: (_, record) => (
        <div className="space-y-2">
          <h3 
            className="font-bold text-lg text-gray-800 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
            onClick={() => handleViewMovie(record.maPhim)}
          >
            {record.tenPhim}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 max-w-xs">
            {record.moTa}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <StarOutlined className="text-yellow-400" />
              <span className="font-medium">{record.danhGia}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{record.thoiLuong} phút</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{record.theLoai}</span>
          </div>
          <div className="text-xs text-gray-500">
            Đạo diễn: {record.daoDien}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "trangThai",
      width: 200,
      render: (_, record) => (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {record.dangChieu && (
              <StatusBadge type="now" className="now">Đang chiếu</StatusBadge>
            )}
            {record.sapChieu && (
              <StatusBadge type="soon" className="soon">Sắp chiếu</StatusBadge>
            )}
            {record.hot && (
              <StatusBadge type="hot" className="hot flex items-center gap-1"><FireOutlined style={{ fontSize: 14 }} /> Hot</StatusBadge>
            )}
          </div>
          {record.doanhThu > 0 && (
            <div className="text-sm text-gray-600 font-medium">
              💰 {(record.doanhThu / 1000000).toFixed(1)}M VNĐ
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 300,
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              size="small"
              className="bg-blue-500 hover:bg-blue-600 border-0"
              onClick={() => handleViewMovie(record.maPhim)}
            >
              Xem
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="small"
              className="bg-green-500 hover:bg-green-600 border-0"
              onClick={() => handleEditMovie(record.maPhim)}
            >
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Xóa phim">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa phim này?"
              description="Hành động này không thể hoàn tác!"
              onConfirm={() => handleDelete(record.maPhim)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} size="small">
                Xóa
              </Button>
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Quản lý lịch chiếu">
            <Button 
              icon={<CalendarOutlined />} 
              size="small"
              className="bg-purple-500 hover:bg-purple-600 border-0 text-white"
              onClick={() => handleManageShowtimes(record.maPhim)}
            >
              Lịch chiếu
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const stats = [
    {
      title: "Tổng số phim",
      value: movies.length,
      color: "#3b82f6",
      icon: "🎬"
    },
    {
      title: "Đang chiếu",
      value: movies.filter(m => m.dangChieu).length,
      color: "#10b981",
      icon: "🎭"
    },
    {
      title: "Sắp chiếu",
      value: movies.filter(m => m.sapChieu).length,
      color: "#f59e0b",
      icon: "📅"
    },
    {
      title: "Phim hot",
      value: movies.filter(m => m.hot).length,
      color: "#ef4444",
      icon: "🔥"
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Statistics Cards */}
      <motion.div variants={itemVariants}>
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <Statistic
                    title={<span className="text-gray-600 font-medium">{stat.title}</span>}
                    value={stat.value}
                    valueStyle={{ color: stat.color, fontSize: '2rem', fontWeight: 'bold' }}
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg border-0 bg-gradient-to-r from-white to-blue-50">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <Search
                  placeholder="Tìm kiếm phim theo tên, mô tả, thể loại..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={handleSearch}
                  size="large"
                  className="rounded-full"
                />
              </div>
              <div className="flex gap-3">
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  placeholder="Trạng thái"
                  size="large"
                  className="min-w-32"
                >
                  <Option value="all">Tất cả trạng thái</Option>
                  <Option value="dangChieu">Đang chiếu</Option>
                  <Option value="sapChieu">Sắp chiếu</Option>
                  <Option value="hot">Phim hot</Option>
                </Select>
                <Select
                  value={filterRating}
                  onChange={setFilterRating}
                  placeholder="Đánh giá"
                  size="large"
                  className="min-w-32"
                >
                  <Option value="all">Tất cả đánh giá</Option>
                  <Option value="high">Cao (≥8.5)</Option>
                  <Option value="medium">Trung bình (7.0-8.4)</Option>
                  <Option value="low">Thấp (&lt;7.0)</Option>
                </Select>
                <Button 
                  onClick={() => {
                    setSearchText("");
                    setFilterStatus("all");
                    setFilterRating("all");
                    setSelectedMovies([]);
                  }}
                  size="large"
                  className="rounded-full px-6"
                  icon={<ReloadOutlined />}
                >
                  Làm mới
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-3">
            <Button 
              type="primary" 
              size="large"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 h-12 px-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              icon={<PlusOutlined />}
              onClick={handleAddNewMovie}
            >
              Thêm phim mới
            </Button>
            
            {selectedMovies.length > 0 && (
              <Popconfirm
                title={`Bạn có chắc chắn muốn xóa ${selectedMovies.length} phim đã chọn?`}
                onConfirm={handleBulkDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button 
                  danger 
                  size="large"
                  className="h-12 px-6 text-lg font-semibold rounded-full"
                  icon={<DeleteOutlined />}
                >
                  Xóa ({selectedMovies.length})
                </Button>
              </Popconfirm>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            Hiển thị {filteredMovies.length} / {movies.length} phim
          </div>
        </div>
      </motion.div>

      {/* Movies Table */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg border-0 bg-gradient-to-r from-white to-blue-50">
          <Table
            columns={columns}
            dataSource={filteredMovies}
            rowKey="maPhim"
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `Tổng cộng ${total} phim`,
              showQuickJumper: true,
              className: "mt-4"
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
            className="modern-table"
            rowClassName={(record, index) => index % 2 === 0 ? 'zebra-row-even' : 'zebra-row-odd'}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
}

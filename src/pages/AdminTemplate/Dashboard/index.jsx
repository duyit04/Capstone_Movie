import { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin } from "antd";
import { 
  FileOutlined, 
  UserOutlined, 
  TeamOutlined, 
  CalendarOutlined 
} from "@ant-design/icons";
import api from "../../../services/api";

const { Title } = Typography;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [movieStats, setMovieStats] = useState({ total: 0, nowShowing: 0, comingSoon: 0 });
  const [userStats, setUserStats] = useState({ total: 0 });
  const [recentMovies, setRecentMovies] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        console.log("Fetching dashboard data...");
        // Fetch movies data
        const moviesResponse = await api.get("/QuanLyPhim/LayDanhSachPhim?maNhom=GP01");
        console.log("Movies response:", moviesResponse);
        
        if (!moviesResponse.data || !moviesResponse.data.content) {
          console.error("Unexpected API response format:", moviesResponse);
          throw new Error("Định dạng dữ liệu không hợp lệ");
        }
        
        const movies = moviesResponse.data.content || [];

        // Calculate stats
        const nowShowing = movies.filter(movie => movie.dangChieu).length;
        const comingSoon = movies.filter(movie => movie.sapChieu).length;
        
        setMovieStats({
          total: movies.length,
          nowShowing,
          comingSoon
        });

        // Set recent movies (latest 5 movies)
        const sortedMovies = [...movies].sort((a, b) => 
          new Date(b.ngayKhoiChieu) - new Date(a.ngayKhoiChieu)
        ).slice(0, 5);

        setRecentMovies(sortedMovies);
        
        // Fetch users data
        const usersResponse = await api.get("/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01");
        const users = usersResponse.data.content;
        
        setUserStats({
          total: users.length
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Hiển thị lỗi cho người dùng
        const errorMessage = error.response?.data?.message || error.message || "Không thể tải dữ liệu";
        message.error(`Lỗi: ${errorMessage}`);
        
        // Set default data to prevent errors
        setMovieStats({ total: 0, nowShowing: 0, comingSoon: 0 });
        setUserStats({ total: 0 });
        setRecentMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const recentMoviesColumns = [
    {
      title: 'Mã phim',
      dataIndex: 'maPhim',
      key: 'maPhim',
      width: 100,
    },
    {
      title: 'Tên phim',
      dataIndex: 'tenPhim',
      key: 'tenPhim',
    },
    {
      title: 'Ngày khởi chiếu',
      dataIndex: 'ngayKhoiChieu',
      key: 'ngayKhoiChieu',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Đánh giá',
      dataIndex: 'danhGia',
      key: 'danhGia',
      render: (rating) => `${rating}/10`
    },
    {
      title: 'Trạng thái',
      key: 'trangThai',
      render: (_, record) => (
        <>
          {record.dangChieu && <Tag color="green">Đang chiếu</Tag>}
          {record.sapChieu && <Tag color="blue">Sắp chiếu</Tag>}
          {record.hot && <Tag color="red">Hot</Tag>}
        </>
      )
    },
  ];

  // Simpler rendering condition for error states
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Tổng quan hệ thống</Title>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số phim"
              value={movieStats.total}
              prefix={<FilmOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Phim đang chiếu"
              value={movieStats.nowShowing}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Phim sắp chiếu"
              value={movieStats.comingSoon}
              prefix={<FilmOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={userStats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Title level={4}>Phim mới nhất</Title>
        <Table 
          dataSource={recentMovies} 
          columns={recentMoviesColumns} 
          rowKey="maPhim"
          pagination={false}
        />
      </div>
    </div>
  );
}

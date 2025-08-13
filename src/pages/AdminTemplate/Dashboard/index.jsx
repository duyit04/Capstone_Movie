import { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin, message } from "antd";
import { 
  FileOutlined, 
  UserOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import api from "../../../services/api";
import "./styles.css";

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
      render: (text) => (
        <span style={{ 
          fontWeight: '600', 
          color: '#1890ff',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          #{text}
        </span>
      )
    },
    {
      title: 'Tên phim',
      dataIndex: 'tenPhim',
      key: 'tenPhim',
      render: (text) => (
        <span style={{ 
          fontWeight: '600', 
          color: '#1f1f1f',
          fontSize: '14px'
        }}>
          {text}
        </span>
      )
    },
    {
      title: 'Hình ảnh',
      key: 'hinhAnh',
      width: 120,
      render: (_, record) => (
        <img 
          src={record.hinhAnh} 
          alt={record.tenPhim}
          style={{
            width: 80,
            height: 120,
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '2px solid #f0f0f0'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x120/cccccc/666666?text=No+Image';
          }}
        />
      )
    },
    {
      title: 'Ngày khởi chiếu',
      dataIndex: 'ngayKhoiChieu',
      key: 'ngayKhoiChieu',
      render: (date) => (
        <span style={{ 
          color: '#666',
          fontSize: '13px'
        }}>
          {new Date(date).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      title: 'Đánh giá',
      dataIndex: 'danhGia',
      key: 'danhGia',
      render: (rating) => (
        <span style={{ 
          color: '#faad14',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          ⭐ {rating}/10
        </span>
      )
    },
    {
      title: 'Trạng thái',
      key: 'trangThai',
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {record.dangChieu && <Tag color="green">Đang chiếu</Tag>}
          {record.sapChieu && <Tag color="blue">Sắp chiếu</Tag>}
          {record.hot && <Tag color="red">Hot</Tag>}
        </div>
      )
    },
  ];

  // Simpler rendering condition for error states
  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
        <div style={{ marginTop: 16, fontSize: '18px', color: '#666' }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
             <div style={{ 
         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
         padding: '20px', 
         borderRadius: '12px', 
         marginBottom: '24px',
         boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
       }}>
         <Title level={2} style={{ 
           color: '#ffffff', 
           margin: 0, 
           textAlign: 'center',
           textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
           fontSize: '1.8rem',
           fontWeight: '600'
         }}>
           🎬 Tổng quan hệ thống
         </Title>
       </div>

             <Row gutter={[16, 16]}>
         <Col xs={24} sm={12} md={6}>
           <Card 
             hoverable
             style={{ 
               borderRadius: '12px', 
               boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
               border: 'none',
               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
             }}
             bodyStyle={{ padding: '16px', textAlign: 'center' }}
           >
             <Statistic
               title={<span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Tổng số phim</span>}
               value={movieStats.total}
               prefix={<VideoCameraOutlined style={{ color: '#ffffff', fontSize: '20px' }} />}
               valueStyle={{ 
                 color: '#ffffff', 
                 fontSize: '24px', 
                 fontWeight: '700',
                 textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
               }}
             />
           </Card>
         </Col>
         <Col xs={24} sm={12} md={6}>
           <Card 
             hoverable
             style={{ 
               borderRadius: '12px', 
               boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
               border: 'none',
               background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
             }}
             bodyStyle={{ padding: '16px', textAlign: 'center' }}
           >
             <Statistic
               title={<span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Phim đang chiếu</span>}
               value={movieStats.nowShowing}
               prefix={<CalendarOutlined style={{ color: '#ffffff', fontSize: '20px' }} />}
               valueStyle={{ 
                 color: '#ffffff', 
                 fontSize: '24px', 
                 fontWeight: '700',
                 textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
               }}
             />
           </Card>
         </Col>
         <Col xs={24} sm={12} md={6}>
           <Card 
             hoverable
             style={{ 
               borderRadius: '12px', 
               boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
               border: 'none',
               background: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)'
             }}
             bodyStyle={{ padding: '16px', textAlign: 'center' }}
           >
             <Statistic
               title={<span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Phim sắp chiếu</span>}
               value={movieStats.comingSoon}
               prefix={<CalendarOutlined style={{ color: '#ffffff', fontSize: '20px' }} />}
               valueStyle={{ 
                 color: '#ffffff', 
                 fontSize: '24px', 
                 fontWeight: '700',
                 textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
               }}
             />
           </Card>
         </Col>
         <Col xs={24} sm={12} md={6}>
           <Card 
             hoverable
             style={{ 
               borderRadius: '12px', 
               boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
               border: 'none',
               background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)'
             }}
             bodyStyle={{ padding: '16px', textAlign: 'center' }}
           >
             <Statistic
               title={<span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Người dùng</span>}
               value={userStats.total}
               prefix={<UserOutlined style={{ color: '#ffffff', fontSize: '20px' }} />}
               valueStyle={{ 
                 color: '#ffffff', 
                 fontSize: '24px', 
                 fontWeight: '700',
                 textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
               }}
             />
           </Card>
         </Col>
       </Row>

      <div style={{ 
        marginTop: '40px', 
        background: '#ffffff', 
        padding: '32px', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: 'none'
      }}>
        <Title level={3} style={{ 
          color: '#1f1f1f', 
          marginBottom: '24px',
          fontSize: '24px',
          fontWeight: '600',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '16px'
        }}>
          🎭 Phim mới nhất
        </Title>
        <Table 
          dataSource={recentMovies} 
          columns={recentMoviesColumns} 
          rowKey="maPhim"
          pagination={false}
          style={{
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          className="dashboard-table"
        />
      </div>
    </div>
  );
}

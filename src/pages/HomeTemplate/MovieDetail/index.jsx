import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../../services/api";
import { Row, Col, Typography, Tag, Rate, Button, Tabs, Collapse, Spin, Image, Space, Card, Divider, message } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, PlayCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showtimes, setShowtimes] = useState(null);
  const [activeSystem, setActiveSystem] = useState('');

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const result = await api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${id}`);
        
        // Xử lý dữ liệu phim để đảm bảo chỉ có 1 trạng thái duy nhất
        const movieData = { ...result.data.content }; // Tạo bản sao mới
        
        // Logic xử lý trạng thái: ưu tiên "đang chiếu" nếu có cả 2
        if (movieData.dangChieu === true && movieData.sapChieu === true) {
          movieData.sapChieu = false;
          console.log(`Phim "${movieData.tenPhim}" có cả 2 trạng thái, đã loại bỏ "sắp chiếu"`);
        }
        
        // Đảm bảo chỉ có 1 trạng thái duy nhất
        if (movieData.dangChieu === true) {
          movieData.sapChieu = false;
        } else if (movieData.sapChieu === true) {
          movieData.dangChieu = false;
        }
        
        console.log('Đã xử lý phim để đảm bảo trạng thái duy nhất:', movieData.tenPhim);
        setMovie(movieData);

        const showtimes = await api.get(`QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${id}`);
        setShowtimes(showtimes.data.content);

        // Set default active system if available
        if (showtimes.data.content.heThongRapChieu.length > 0) {
          setActiveSystem(showtimes.data.content.heThongRapChieu[0].maHeThongRap);
        }

      } catch (error) {
        console.error("Lỗi khi tải thông tin phim:", error);
        const errorMessage = error.response?.data?.content || error.response?.data?.message || "Không thể tải thông tin phim. Vui lòng thử lại sau.";
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const handleBookTicket = (maLichChieu) => {
    navigate(`/dat-ve/${maLichChieu}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Phim không tồn tại hoặc đã bị xóa!</Title>
        <Button type="primary" onClick={() => navigate('/')}>Quay lại trang chủ</Button>
      </div>
    );
  }

  const renderCinemaSystem = () => {
    if (!showtimes || !showtimes.heThongRapChieu || showtimes.heThongRapChieu.length === 0) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Text>Phim chưa có lịch chiếu.</Text>
        </div>
      );
    }

    return (
      <Tabs 
        tabPosition="left"
        activeKey={activeSystem}
        onChange={(key) => setActiveSystem(key)}
        style={{ minHeight: 500 }}
      >
        {showtimes.heThongRapChieu.map((system) => (
          <TabPane
            key={system.maHeThongRap}
            tab={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={system.logo} alt={system.tenHeThongRap} width={40} style={{ marginRight: 10 }} />
                <span>{system.tenHeThongRap}</span>
              </div>
            }
          >
            <Collapse accordion defaultActiveKey={system.cumRapChieu[0]?.maCumRap}>
              {system.cumRapChieu.map((cinema) => (
                <Panel
                  key={cinema.maCumRap}
                  header={
                    <div>
                      <Text strong>{cinema.tenCumRap}</Text>
                      <br />
                      <Text type="secondary">{cinema.diaChi}</Text>
                    </div>
                  }
                >
                  <Row gutter={[16, 16]}>
                    {cinema.lichChieuPhim
                      .sort((a, b) => moment(a.ngayChieuGioChieu) - moment(b.ngayChieuGioChieu))
                      .map((showtime) => (
                        <Col key={showtime.maLichChieu} xs={24} sm={12} md={8} lg={8} xl={6}>
                          <Card size="small" hoverable style={{ textAlign: 'center' }}>
                            <Space direction="vertical">
                              <Text>
                                <CalendarOutlined /> {moment(showtime.ngayChieuGioChieu).format('DD/MM/YYYY')}
                              </Text>
                              <Button 
                                type="primary" 
                                onClick={() => handleBookTicket(showtime.maLichChieu)}
                                style={{ width: '100%' }}
                              >
                                {moment(showtime.ngayChieuGioChieu).format('HH:mm')}
                              </Button>
                            </Space>
                          </Card>
                        </Col>
                      ))}
                  </Row>
                </Panel>
              ))}
            </Collapse>
          </TabPane>
        ))}
      </Tabs>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Movie Detail */}
      <div 
        className="movie-backdrop" 
        style={{ 
          backgroundImage: `url(${movie.hinhAnh})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '30px'
        }}
      >
        <div style={{ 
          background: 'rgba(0,0,0,0.75)', 
          padding: '40px 20px',
        }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} sm={24} md={8} lg={6}>
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={movie.hinhAnh}
                  alt={movie.tenPhim}
                  style={{ 
                    width: '100%', 
                    maxWidth: '300px', 
                    boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                    borderRadius: '8px' 
                  }}
                  fallback="https://placehold.co/300x450?text=No+Image"
                  preview={false}
                />
              </div>
            </Col>
            <Col xs={24} sm={24} md={16} lg={18}>
              <Title style={{ color: 'white', marginBottom: '16px' }}>{movie.tenPhim}</Title>
              
              <Space direction="vertical" size="large" style={{ width: '100%', color: 'white' }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Tag color="red">{movie.hot ? 'HOT' : 'NEW'}</Tag>
                    {(() => {
                      // Đảm bảo mỗi phim chỉ có 1 trạng thái duy nhất
                      if (movie.dangChieu === true && movie.sapChieu !== true) {
                        return <Tag color="green">Đang chiếu</Tag>;
                      } else if (movie.sapChieu === true && movie.dangChieu !== true) {
                        return <Tag color="blue">Sắp chiếu</Tag>;
                      } else {
                        return <Tag color="default">Phim</Tag>;
                      }
                    })()}
                  </Col>
                  
                  <Col span={24}>
                    <Space size="large">
                      <div>
                        <Text style={{ color: 'white' }}><CalendarOutlined /> Ngày khởi chiếu: </Text>
                        <Text strong style={{ color: 'white' }}>
                          {moment(movie.ngayKhoiChieu).format('DD/MM/YYYY')}
                        </Text>
                      </div>
                      
                      <div>
                        <Text style={{ color: 'white' }}><ClockCircleOutlined /> Thời lượng: </Text>
                        <Text strong style={{ color: 'white' }}>120 phút</Text>
                      </div>
                    </Space>
                  </Col>

                  <Col span={24}>
                    <div>
                      <Text style={{ color: 'white' }}>Đánh giá: </Text>
                      <Rate allowHalf disabled value={movie.danhGia / 2} style={{ fontSize: 16, marginLeft: 8 }} />
                      <Text strong style={{ marginLeft: 8, color: 'white' }}>{movie.danhGia}/10</Text>
                    </div>
                  </Col>
                </Row>

                <Paragraph style={{ color: '#ddd', fontSize: '16px' }}>
                  {movie.moTa || 'Chưa có mô tả cho phim này.'}
                </Paragraph>

                <Space>
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<PlayCircleOutlined />} 
                    onClick={() => {
                      if (movie.trailer) {
                        window.open(movie.trailer, '_blank');
                      } else {
                        message.info('Chức năng trailer đang được phát triển');
                      }
                    }}
                  >
                    Xem Trailer
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      {/* Showtimes */}
      <div>
        <Divider orientation="left">
          <Title level={3}>Lịch chiếu</Title>
        </Divider>
        {renderCinemaSystem()}
      </div>
    </div>
  );
}

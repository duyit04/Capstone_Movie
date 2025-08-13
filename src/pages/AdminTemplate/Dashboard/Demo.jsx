import React from 'react';
import { Card, Row, Col, Button, Progress, Tag, Space, Typography, Divider, Statistic } from 'antd';
import { 
  VideoCameraOutlined, 
  PlayCircleOutlined, 
  CalendarOutlined, 
  UserOutlined,
  LineChartOutlined,
  EyeOutlined,
  StarOutlined,
  FireOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Demo component để showcase các tính năng mới
export default function DashboardDemo() {
  const demoStats = {
    total: 57,
    nowShowing: 41,
    comingSoon: 20,
    users: 40
  };

  const getProgressColor = (value, total) => {
    const percentage = (value / total) * 100;
    if (percentage >= 70) return '#52c41a';
    if (percentage >= 40) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <Title level={2} className="dashboard-title">
            Demo Dashboard
          </Title>
          <Text className="sub">
            Showcase các tính năng mới của Admin Dashboard
          </Text>
        </div>
        <div className="actions">
          <Button type="primary" size="large">
            Xem Demo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card hover-lift">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Statistic
                  title={
                    <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                      Tổng số phim
                    </Text>
                  }
                  value={demoStats.total}
                  valueStyle={{ 
                    color: '#1890ff', 
                    fontSize: '32px', 
                    fontWeight: 700 
                  }}
                />
                <Progress 
                  percent={100} 
                  showInfo={false} 
                  strokeColor="#1890ff"
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </div>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)'
              }}>
                <VideoCameraOutlined style={{ fontSize: '24px', color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card hover-lift">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Statistic
                  title={
                    <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                      Phim đang chiếu
                    </Text>
                  }
                  value={demoStats.nowShowing}
                  valueStyle={{ 
                    color: '#52c41a', 
                    fontSize: '32px', 
                    fontWeight: 700 
                  }}
                />
                <Progress 
                  percent={demoStats.total > 0 ? (demoStats.nowShowing / demoStats.total) * 100 : 0} 
                  showInfo={false} 
                  strokeColor="#52c41a"
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </div>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(82, 196, 26, 0.3)'
              }}>
                <PlayCircleOutlined style={{ fontSize: '24px', color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card hover-lift">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Statistic
                  title={
                    <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                      Phim sắp chiếu
                    </Text>
                  }
                  value={demoStats.comingSoon}
                  valueStyle={{ 
                    color: '#faad14', 
                    fontSize: '32px', 
                    fontWeight: 700 
                  }}
                />
                <Progress 
                  percent={demoStats.total > 0 ? (demoStats.comingSoon / demoStats.total) * 100 : 0} 
                  showInfo={false} 
                  strokeColor="#faad14"
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </div>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #faad14, #ffc53d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(250, 173, 20, 0.3)'
              }}>
                <CalendarOutlined style={{ fontSize: '24px', color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card hover-lift">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Statistic
                  title={
                    <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                      Người dùng
                    </Text>
                  }
                  value={demoStats.users}
                  valueStyle={{ 
                    color: '#722ed1', 
                    fontSize: '32px', 
                    fontWeight: 700 
                  }}
                />
                <Progress 
                  percent={100} 
                  showInfo={false} 
                  strokeColor="#722ed1"
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </div>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #722ed1, #9254de)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(114, 46, 209, 0.3)'
              }}>
                <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Performance Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LineChartOutlined style={{ color: '#1890ff' }} />
                <span>Hiệu suất hệ thống</span>
              </div>
            }
            className="admin-table-card hover-lift"
          >
            <div style={{ padding: '16px 0' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Tỷ lệ phim đang chiếu</Text>
                  <Text strong>{demoStats.total > 0 ? Math.round((demoStats.nowShowing / demoStats.total) * 100) : 0}%</Text>
                </div>
                <Progress 
                  percent={demoStats.total > 0 ? (demoStats.nowShowing / demoStats.total) * 100 : 0} 
                  strokeColor={getProgressColor(demoStats.nowShowing, demoStats.total)}
                  size="large"
                />
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Tỷ lệ phim sắp chiếu</Text>
                  <Text strong>{demoStats.total > 0 ? Math.round((demoStats.comingSoon / demoStats.total) * 100) : 0}%</Text>
                </div>
                <Progress 
                  percent={demoStats.total > 0 ? (demoStats.comingSoon / demoStats.total) * 100 : 0} 
                  strokeColor={getProgressColor(demoStats.comingSoon, demoStats.total)}
                  size="large"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Tỷ lệ sử dụng hệ thống</Text>
                  <Text strong>85%</Text>
                </div>
                <Progress 
                  percent={85} 
                  strokeColor="#52c41a"
                  size="large"
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <EyeOutlined style={{ color: '#52c41a' }} />
                <span>Thống kê nhanh</span>
              </div>
            }
            className="admin-table-card hover-lift"
          >
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f6ffed', borderRadius: '12px', border: '1px solid #b7eb8f' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#52c41a', marginBottom: 4 }}>
                      {demoStats.total > 0 ? Math.round((demoStats.nowShowing / demoStats.total) * 100) : 0}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#52c41a' }}>Đang hoạt động</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#fff7e6', borderRadius: '12px', border: '1px solid #ffd591' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#faad14', marginBottom: 4 }}>
                      {demoStats.total > 0 ? Math.round((demoStats.comingSoon / demoStats.total) * 100) : 0}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#faad14' }}>Sắp ra mắt</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f5ff', borderRadius: '12px', border: '1px solid #adc6ff' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#1890ff', marginBottom: 4 }}>
                      {demoStats.total}
                    </div>
                    <div style={{ fontSize: '12px', color: '#1890ff' }}>Tổng phim</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f9f0ff', borderRadius: '12px', border: '1px solid #d3adf7' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#722ed1', marginBottom: 4 }}>
                      {demoStats.users}
                    </div>
                    <div style={{ fontSize: '12px', color: '#722ed1' }}>Người dùng</div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Demo Movies Section */}
      <div className="recent-movies-section">
        <div className="section-head">
          <Title level={4} className="section-title">
            Demo Phim
          </Title>
          <Text className="section-sub">
            Showcase giao diện bảng dữ liệu mới
          </Text>
        </div>
        
        <Card className="admin-table-card">
          <div style={{ padding: '20px' }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  padding: '16px',
                  background: 'linear-gradient(135deg, #f8faff 0%, #e6f3ff 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(24, 144, 255, 0.1)'
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px'
                  }}>
                    🎬
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                      Phàm Nhân Tu Tiên Truyện 1
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      Mã phim: 14822 • Ngày chiếu: 6/7/2344 • Đánh giá: 8/10
                    </div>
                  </div>
                  <Space size={8}>
                    <Tag icon={<CheckCircleOutlined />} color="success">Đang chiếu</Tag>
                    <Tag icon={<FireOutlined />} color="error">Hot</Tag>
                  </Space>
                </div>
              </Col>
              
              <Col span={24}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  padding: '16px',
                  background: 'linear-gradient(135deg, #f8faff 0%, #e6f3ff 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(24, 144, 255, 0.1)'
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px'
                  }}>
                    🎭
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                      Phim thám tử lừng danh
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      Mã phim: 14760 • Ngày chiếu: 20/11/2025 • Đánh giá: 10/10
                    </div>
                  </div>
                  <Space size={8}>
                    <Tag icon={<CheckCircleOutlined />} color="success">Đang chiếu</Tag>
                    <Tag icon={<StarOutlined />} color="warning">Premium</Tag>
                  </Space>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </div>

      {/* Features Showcase */}
      <div style={{ marginTop: '48px' }}>
        <Title level={4} className="section-title">
          Tính năng nổi bật
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card className="admin-table-card hover-lift">
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '28px',
                  color: 'white'
                }}>
                  ✨
                </div>
                <Title level={5}>Giao diện hiện đại</Title>
                <Text type="secondary">
                  Thiết kế với gradient colors, smooth animations và hover effects
                </Text>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card className="admin-table-card hover-lift">
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '28px',
                  color: 'white'
                }}>
                  📱
                </div>
                <Title level={5}>Responsive Design</Title>
                <Text type="secondary">
                  Tối ưu cho mọi kích thước màn hình từ mobile đến desktop
                </Text>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card className="admin-table-card hover-lift">
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #faad14, #ffc53d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '28px',
                  color: 'white'
                }}>
                  🎭
                </div>
                <Title level={5}>Smooth Animations</Title>
                <Text type="secondary">
                  Fade-in, slide-in và micro-interactions mượt mà
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCinemas, fetchCinemaSchedules } from '../HomePage/slice';
import { 
  Collapse, 
  Spin, 
  Tabs, 
  Tag, 
  Empty, 
  Timeline, 
  Card, 
  Skeleton, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Divider, 
  Space, 
  Avatar,
  Tooltip,
  Badge,
  Rate
} from 'antd';
import { 
  ClockCircleOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined,
  GlobalOutlined,
  StarOutlined,
  PlayCircleOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

// Đơn giản hóa animation để tăng performance
const simpleVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const simpleTransition = {
  duration: 0.3,
  ease: "easeOut"
};

// Lazy load component cho phim
const MovieItem = React.memo(({ phim, phimIndex, theme, handleBooking, navigate, formatTime, formatDate }) => {
  console.log('MovieItem render with phim:', phim.tenPhim);
  console.log('handleBooking function:', handleBooking);
  
  return (
    <motion.div 
      key={phim.maPhim} 
      className="border-b border-gray-200 pb-6 last:border-b-0"
      initial="hidden"
      animate="visible"
      variants={simpleVariants}
      transition={{ ...simpleTransition, delay: phimIndex * 0.05 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Row gutter={[16, 16]} align="top">
        <Col xs={24} sm={8} md={6}>
          <div className="relative">
            <img 
              src={phim.hinhAnh} 
              alt={phim.tenPhim} 
              className="w-full h-48 object-cover rounded-lg shadow-md"
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://placehold.co/400x600?text=Movie";
              }}
            />
            <Badge 
              count={phim.lstLichChieuTheoPhim?.length || 0} 
              className="absolute -top-2 -right-2"
              style={{ backgroundColor: '#52c41a' }}
            />
          </div>
        </Col>
        <Col xs={24} sm={16} md={18}>
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <Title level={5} className={`mb-2 ${theme==='dark' ? 'text-slate-100' : 'text-gray-900'}`}>
                {phim.tenPhim}
              </Title>
              <div className="flex flex-wrap gap-3 mb-3">
                {/* Trạng thái phim */}
                <Tag 
                  color={phim.trangThai === 'dang-chieu' ? 'green' : 'orange'} 
                  icon={<PlayCircleOutlined />}
                >
                  {phim.trangThaiText}
                </Tag>
                <Tag color="blue" icon={<ClockCircleOutlined />}>
                  {phim.thoiLuong} phút
                </Tag>
                <Tag color="green" icon={<CalendarOutlined />}>
                  {formatDate(phim.ngayKhoiChieu)}
                </Tag>
                <Tag color="purple" icon={<StarOutlined />}>
                  <Rate disabled defaultValue={4.2} className="text-xs" />
                </Tag>
              </div>
              <Paragraph 
                className={`text-sm ${theme==='dark' ? 'text-slate-300' : 'text-gray-600'} line-clamp-2`}
              >
                {phim.moTa || 'Phim mới nhất với công nghệ chiếu phim hiện đại, âm thanh vòm sống động và hình ảnh sắc nét.'}
              </Paragraph>
            </div>
            
            {/* Lịch chiếu - chỉ hiển thị cho phim đang chiếu */}
            {phim.trangThai === 'dang-chieu' && phim.lstLichChieuTheoPhim?.length > 0 && (
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-3">
                  <PlayCircleOutlined className="text-blue-600" />
                  <Text strong className={`text-sm ${theme==='dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                    Lịch chiếu hôm nay:
                  </Text>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {phim.lstLichChieuTheoPhim.slice(0, 12).map((lich, lichIndex) => (
                    <Button
                      key={lich.maLichChieu}
                      size="small"
                      type="primary"
                      className="w-full h-10 text-xs font-medium hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        console.log('Button clicked with maLichChieu:', lich.maLichChieu);
                        console.log('handleBooking function:', handleBooking);
                        handleBooking(lich.maLichChieu);
                      }}
                    >
                      {formatTime(lich.ngayChieuGioChieu)}
                    </Button>
                  ))}
                  {phim.lstLichChieuTheoPhim.length > 12 && (
                    <Button 
                      size="small" 
                      type="link" 
                      className="w-xs"
                      onClick={() => navigate(`/movie/${phim.maPhim}`)}
                    >
                      +{phim.lstLichChieuTheoPhim.length - 12} nữa
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Thông báo cho phim sắp chiếu */}
            {phim.trangThai === 'sap-chieu' && (
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-3">
                  <InfoCircleOutlined className="text-orange-600" />
                  <Text strong className={`text-sm ${theme==='dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                    Phim sẽ ra mắt vào: {formatDate(phim.ngayKhoiChieu)}
                  </Text>
                </div>
                <Button 
                  size="small" 
                  type="default" 
                  className="w-full h-10 text-xs font-medium"
                  onClick={() => navigate(`/movie/${phim.maPhim}`)}
                >
                  Xem chi tiết phim
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </motion.div>
  );
});

// Component hiển thị chi tiết rạp
const CinemaDetail = React.memo(({ cinema, theme, handleBooking, navigate, formatTime, formatDate }) => {
  console.log('CinemaDetail render with cinema:', cinema?.tenCumRap);
  console.log('CinemaDetail handleBooking function:', handleBooking);
  
  const [activePhimTab, setActivePhimTab] = useState('all');
  
  if (!cinema) return null;
  
  // Lọc phim theo tab
  const filteredPhim = useMemo(() => {
    if (!cinema.danhSachPhim) return [];
    
    if (activePhimTab === 'all') {
      return cinema.danhSachPhim;
    } else {
      return cinema.danhSachPhim.filter(phim => phim.trangThai === activePhimTab);
    }
  }, [cinema.danhSachPhim, activePhimTab]);

  return (
    <div className="space-y-8">
      {/* Header rạp */}
      <Card className={`${theme==='dark' ? 'bg-slate-800/70 border-slate-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/cinemas')}
            className="mb-4"
          >
            Quay lại danh sách rạp
          </Button>
        </div>
        
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={8}>
            <div className="flex items-center gap-4">
              <Avatar 
                src={cinema.systemInfo?.logo} 
                size={80} 
                className="bg-white p-2 shadow-lg"
              />
              <div>
                <Title level={2} className={`mb-2 ${theme==='dark' ? 'text-slate-100' : 'text-gray-900'}`}>
                  {cinema.tenCumRap}
                </Title>
                <div className="flex items-center gap-4 text-sm mb-3">
                  <Tag color="blue" icon={<HomeOutlined />}>
                    {cinema.diaChi}
                  </Tag>
                  <Tag color="green" icon={<StarOutlined />}>
                    {cinema.systemInfo?.tenHeThongRap}
                  </Tag>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <ClockCircleOutlined />
                    Mở cửa: 8:00 - 23:00
                  </span>
                  <span className="flex items-center gap-1">
                    <StarOutlined />
                    Đánh giá: 4.5/5
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {cinema.danhSachPhim?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Tổng số phim</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {cinema.danhSachPhim?.filter(p => p.trangThai === 'dang-chieu').length || 0}
                </div>
                <div className="text-sm text-gray-600">Đang chiếu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {cinema.danhSachPhim?.filter(p => p.trangThai === 'sap-chieu').length || 0}
                </div>
                <div className="text-sm text-gray-600">Sắp chiếu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {cinema.danhSachPhim?.reduce((total, phim) => 
                    total + (phim.lstLichChieuTheoPhim?.length || 0), 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Suất chiếu</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Danh sách phim */}
      <Card className={`${theme==='dark' ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-gray-200'}`}>
        <Title level={3} className={`mb-6 ${theme==='dark' ? 'text-slate-100' : 'text-gray-900'}`}>
          Danh sách phim
        </Title>
        
        {/* Tabs phân loại phim */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <Tag 
              color="blue" 
              className="cursor-pointer hover:opacity-80"
              onClick={() => setActivePhimTab('all')}
            >
              Tất cả ({cinema.danhSachPhim?.length || 0})
            </Tag>
            <Tag 
              color="green" 
              className="cursor-pointer hover:opacity-80"
              onClick={() => setActivePhimTab('dang-chieu')}
            >
              Đang chiếu ({cinema.danhSachPhim?.filter(p => p.trangThai === 'dang-chieu').length || 0})
            </Tag>
            <Tag 
              color="orange" 
              className="cursor-pointer hover:opacity-80"
              onClick={() => setActivePhimTab('sap-chieu')}
            >
              Sắp chiếu ({cinema.danhSachPhim?.filter(p => p.trangThai === 'sap-chieu').length || 0})
            </Tag>
          </div>
        </div>
        
        {filteredPhim.length ? (
          <div className="space-y-6">
            {filteredPhim.map((phim, phimIndex) => (
              <MovieItem
                key={phim.maPhim}
                phim={phim}
                phimIndex={phimIndex}
                theme={theme}
                handleBooking={handleBooking}
                navigate={navigate}
                formatTime={formatTime}
                formatDate={formatDate}
              />
            ))}
          </div>
        ) : (
          <Empty 
            description="Không có phim nào tại rạp này" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        )}
      </Card>
    </div>
  );
});

export default function CinemasPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { cinemas, cinemaSchedules } = useSelector(state => state.homeSlice);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { id: cinemaId } = useParams(); // Lấy ID của rạp từ URL

  // Tối ưu useEffect để tránh re-render không cần thiết
  useEffect(() => {
    // Fetch data ngay lập tức khi component mount
    if (!cinemas.data && !cinemas.loading) {
      dispatch(fetchCinemas());
    }
    if (!cinemaSchedules.data && !cinemaSchedules.loading) {
      dispatch(fetchCinemaSchedules());
    }
    setIsPageLoaded(true);
  }, [dispatch]);

  const systems = cinemas.data || [];
  const scheduleData = cinemaSchedules.data || [];

  // Tìm rạp cụ thể nếu có cinemaId
  const specificCinema = useMemo(() => {
    if (!cinemaId) return null;
    
    for (const system of scheduleData) {
      const foundCinema = system.lstCumRap?.find(cum => cum.maCumRap === cinemaId);
      if (foundCinema) {
        // Phân loại phim theo trạng thái
        const phimWithStatus = foundCinema.danhSachPhim?.map(phim => {
          const today = new Date();
          const ngayKhoiChieu = new Date(phim.ngayKhoiChieu);
          const isNowShowing = ngayKhoiChieu <= today;
          
          return {
            ...phim,
            trangThai: isNowShowing ? 'dang-chieu' : 'sap-chieu',
            trangThaiText: isNowShowing ? 'Đang chiếu' : 'Sắp chiếu'
          };
        });
        
        return { 
          ...foundCinema, 
          danhSachPhim: phimWithStatus,
          systemInfo: systems.find(s => s.maHeThongRap === system.maHeThongRap) 
        };
      }
    }
    return null;
  }, [cinemaId, scheduleData, systems]);

  // Memoize systemTabs để tránh re-render
  const systemTabs = useMemo(() => systems.map(sys => ({
    key: sys.maHeThongRap,
    label: (
      <div className="flex items-center gap-3 p-2 hover:scale-105 transition-transform duration-200">
        <img 
          src={sys.logo} 
          alt={sys.tenHeThongRap} 
          className="w-10 h-10 object-contain rounded-lg bg-white p-1 shadow-sm" 
          loading="lazy"
        />
        <div className="text-left">
          <div className="font-semibold text-sm">{sys.tenHeThongRap}</div>
          <div className="text-xs text-gray-500">
            {sys.lstCumRap?.length || 0} rạp
          </div>
        </div>
      </div>
    ),
  })), [systems]);

  const [activeSystem, setActiveSystem] = useState(systemTabs[0]?.key);
  
  useEffect(() => { 
    if(systemTabs.length && !activeSystem) setActiveSystem(systemTabs[0].key); 
  }, [systemTabs, activeSystem]);

  const activeSystemSchedules = useMemo(() => {
    return scheduleData.find(s => s.maHeThongRap === activeSystem) || null;
  }, [scheduleData, activeSystem]);

  const activeSystemInfo = useMemo(() => {
    return systems.find(s => s.maHeThongRap === activeSystem);
  }, [systems, activeSystem]);

  // Memoize functions để tránh re-render
  const handleBooking = useCallback((maLichChieu) => {
    console.log('handleBooking called with maLichChieu:', maLichChieu);
    console.log('Navigating to:', `/ticket-room/${maLichChieu}`);
    console.log('navigate function:', navigate);
    try {
      navigate(`/ticket-room/${maLichChieu}`);
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  const formatTime = useCallback((timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, []);

  // Loading state với skeleton để UX tốt hơn
  if (cinemas.loading && cinemaSchedules.loading && !cinemas.data && !cinemaSchedules.data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="py-16 flex items-center justify-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Thêm loading state mặc định khi component mới mount
  if (!isPageLoaded) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="py-16 flex items-center justify-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Nếu có cinemaId, hiển thị trang chi tiết rạp
  if (cinemaId && specificCinema) {
    console.log('Rendering CinemaDetail with cinemaId:', cinemaId);
    console.log('specificCinema:', specificCinema);
    console.log('handleBooking function:', handleBooking);
    
    return (
      <div className="container mx-auto py-8 px-4">
        <CinemaDetail
          cinema={specificCinema}
          theme={theme}
          handleBooking={handleBooking}
          navigate={navigate}
          formatTime={formatTime}
          formatDate={formatDate}
        />
      </div>
    );
  }

  // Nếu có cinemaId nhưng không tìm thấy rạp
  if (cinemaId && !specificCinema && !cinemas.loading && !cinemaSchedules.loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-16">
          <Empty 
            description="Không tìm thấy thông tin rạp này" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button 
            type="primary" 
            onClick={() => navigate('/cinemas')}
            className="mt-4"
          >
            Quay lại danh sách rạp
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header đơn giản hóa */}
      <div className="text-center mb-10">
        <Title level={1} className={`mb-4 ${theme==='dark' ? 'text-slate-100' : 'text-gray-900'}`}>
          Hệ Thống Rạp Chiếu Phim
        </Title>
        <Paragraph className={`text-lg ${theme==='dark' ? 'text-slate-300' : 'text-gray-600'}`}>
          Khám phá các rạp chiếu phim hiện đại với công nghệ tiên tiến và dịch vụ chất lượng cao
        </Paragraph>
      </div>

      {/* Tabs đơn giản hóa */}
      {systems.length > 0 ? (
        <div className="mb-8">
          <Tabs
            activeKey={activeSystem}
            onChange={setActiveSystem}
            items={systemTabs}
            tabBarGutter={16}
            tabBarStyle={{
              background: theme === 'dark' ? '#1e293b' : '#f8fafc',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}
          />
        </div>
      ) : cinemas.loading ? (
        <div className="mb-8">
          <div className="text-center py-8">
            <Spin size="large" />
            <div className="mt-4 text-gray-500">Đang tải danh sách hệ thống rạp...</div>
          </div>
        </div>
      ) : null}

      {/* Empty state */}
      {!activeSystemSchedules && !cinemas.loading && !cinemaSchedules.loading && (
        <div>
          <Empty description="Không có dữ liệu lịch chiếu" />
        </div>
      )}

      {/* Thông tin hệ thống rạp */}
      {activeSystemInfo ? (
        <div>
          <Card 
            className={`mb-8 ${theme==='dark' ? 'bg-slate-800/70 border-slate-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}
            bodyStyle={{ padding: '24px' }}
          >
            <Row gutter={[24, 16]} align="middle">
              <Col xs={24} md={8}>
                <div className="flex items-center gap-4">
                  <Avatar 
                    src={activeSystemInfo.logo} 
                    size={80} 
                    className="bg-white p-2 shadow-lg"
                  />
                  <div>
                    <Title level={3} className={`mb-2 ${theme==='dark' ? 'text-slate-100' : 'text-gray-900'}`}>
                      {activeSystemInfo.tenHeThongRap}
                    </Title>
                    <div className="flex items-center gap-4 text-sm">
                      <Tag color="blue" icon={<HomeOutlined />}>
                        {activeSystemInfo.lstCumRap?.length || 0} rạp
                      </Tag>
                      <Tag color="green" icon={<StarOutlined />}>
                        Hệ thống uy tín
                      </Tag>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={16}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {activeSystemInfo.lstCumRap?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Rạp chiếu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {activeSystemSchedules?.lstCumRap?.reduce((total, cum) => 
                        total + (cum.danhSachPhim?.length || 0), 0) || 0}
                    </div>
                    <div className="text-sm text-gray-600">Phim đang chiếu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {activeSystemSchedules?.lstCumRap?.reduce((total, cum) => 
                        total + (cum.danhSachPhim?.reduce((sum, phim) => 
                          sum + (phim.lstLichChieuTheoPhim?.length || 0), 0) || 0), 0) || 0}
                    </div>
                    <div className="text-sm text-gray-600">Suất chiếu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      <Rate disabled defaultValue={4.5} className="text-sm" />
                    </div>
                    <div className="text-sm text-gray-600">Đánh giá</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      ) : cinemaSchedules.loading ? (
        <div>
          <Card className="mb-8">
            <div className="text-center py-12">
              <Spin size="large" />
              <div className="mt-4 text-gray-500">Đang tải thông tin hệ thống rạp...</div>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Danh sách rạp với lazy loading */}
      {activeSystemSchedules ? (
        <div className="space-y-8">
          {activeSystemSchedules.lstCumRap?.map((cum, index) => (
            <div key={cum.maCumRap}>
              <Card
                className={`${theme==='dark' ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-gray-200'} shadow-lg transition-all duration-200 hover:shadow-xl`}
                bodyStyle={{ padding: '0' }}
              >
                {/* Header của rạp */}
                <div className={`p-6 ${theme==='dark' ? 'bg-slate-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={16}>
                      <Title level={4} className={`mb-2 ${theme==='dark' ? 'text-slate-100' : 'text-gray-900'}`}>
                        {cum.tenCumRap}
                      </Title>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Tag color="blue" icon={<HomeOutlined />}>
                          {cum.diaChi}
                        </Tag>
                        <Tag color="green" icon={<PhoneOutlined />}>
                          Liên hệ: 1900 xxxx
                        </Tag>
                        <Tag color="orange" icon={<SettingOutlined />}>
                          Có chỗ đậu xe
                        </Tag>
                        <Tag color="purple" icon={<ThunderboltOutlined />}>
                          WiFi miễn phí
                        </Tag>
                        <Tag color="cyan" icon={<HeartOutlined />}>
                          Quán cà phê
                        </Tag>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <ClockCircleOutlined />
                          Mở cửa: 8:00 - 23:00
                        </span>
                        <span className="flex items-center gap-1">
                          <StarOutlined />
                          Đánh giá: 4.5/5
                        </span>
                      </div>
                    </Col>
                    <Col xs={24} md={8} className="text-right">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {cum.danhSachPhim?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Phim đang chiếu</div>
                        <Button 
                          type="primary" 
                          size="large" 
                          className="mt-3 hover:scale-105 transition-transform duration-200"
                          onClick={() => navigate(`/cinema/${cum.maCumRap}`)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Danh sách phim với lazy loading */}
                <div className="p-6">
                  {cum.danhSachPhim?.length ? (
                    <div className="space-y-6">
                      <Suspense fallback={<Skeleton active paragraph={{ rows: 2 }} />}>
                        {cum.danhSachPhim.map((phim, phimIndex) => (
                          <MovieItem
                            key={phim.maPhim}
                            phim={phim}
                            phimIndex={phimIndex}
                            theme={theme}
                            handleBooking={handleBooking}
                            navigate={navigate}
                            formatTime={formatTime}
                            formatDate={formatDate}
                          />
                        ))}
                      </Suspense>
                    </div>
                  ) : (
                    <Empty 
                      description="Không có phim nào đang chiếu tại rạp này" 
                      image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    />
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : cinemaSchedules.loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Card className={`${theme==='dark' ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <div className="text-center py-16">
                  <Spin size="large" />
                  <div className="mt-4 text-gray-500">Đang tải thông tin rạp chiếu phim...</div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

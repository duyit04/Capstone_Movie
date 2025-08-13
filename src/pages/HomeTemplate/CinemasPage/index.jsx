import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCinemas, fetchCinemaSchedules } from '../HomePage/slice';
import { Collapse, Spin, Tabs, Tag, Empty, Timeline, Card, Skeleton, Button } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useTheme } from '../../../context/ThemeContext';

export default function CinemasPage() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { cinemas, cinemaSchedules } = useSelector(state => state.homeSlice);

  useEffect(() => {
    if (!cinemas.data && !cinemas.loading) dispatch(fetchCinemas());
    if (!cinemaSchedules.data && !cinemaSchedules.loading) dispatch(fetchCinemaSchedules());
  }, [dispatch, cinemas.data, cinemas.loading, cinemaSchedules.data, cinemaSchedules.loading]);

  const systems = cinemas.data || [];
  const scheduleData = cinemaSchedules.data || [];

  const systemTabs = systems.map(sys => ({
    key: sys.maHeThongRap,
    label: <div className="flex items-center gap-2"><img src={sys.logo} alt={sys.tenHeThongRap} className="w-8 h-8 object-contain rounded bg-white" /> <span>{sys.tenHeThongRap}</span></div>,
  }));

  const [activeSystem, setActiveSystem] = useState(systemTabs[0]?.key);
  useEffect(()=>{ if(systemTabs.length && !activeSystem) setActiveSystem(systemTabs[0].key); },[systemTabs, activeSystem]);

  const activeSystemSchedules = useMemo(()=>{
    return scheduleData.find(s => s.maHeThongRap === activeSystem) || null;
  }, [scheduleData, activeSystem]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className={`text-3xl font-bold mb-8 text-center ${theme==='dark' ? 'text-slate-100' : 'text-gray-900'}`}>Lịch chiếu rạp</h1>

      {!systems.length && (cinemas.loading || cinemaSchedules.loading) && (
        <div className="flex justify-center py-20"><Spin size="large" /></div>
      )}

      {systems.length > 0 && (
        <Tabs
          activeKey={activeSystem}
          onChange={setActiveSystem}
          items={systemTabs}
          tabBarGutter={16}
          className="mb-8"
        />
      )}

      {!activeSystemSchedules && !cinemas.loading && !cinemaSchedules.loading && (
        <Empty description="Không có dữ liệu lịch chiếu" />
      )}

      {activeSystemSchedules && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSystemSchedules.lstCumRap?.map(cum => (
            <Card
              key={cum.maCumRap}
              title={<div className="font-semibold text-base leading-tight">{cum.tenCumRap}</div>}
              className={theme==='dark' ? 'bg-slate-800/70 border-slate-700 text-slate-200' : ''}
              extra={<Tag color="blue" className="m-0">{cum.danhSachPhim?.length || 0} phim</Tag>}
              styles={{
                body: { maxHeight: 400, overflowY: 'auto' }
              }}
            >
              {cum.danhSachPhim?.length ? (
                <div className="space-y-4">
                  {cum.danhSachPhim.map(phim => (
                    <div key={phim.maPhim} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <div className="flex items-start gap-3 mb-2">
                        <img 
                          src={phim.hinhAnh} 
                          alt={phim.tenPhim} 
                          className="w-16 h-24 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/160x240?text=Movie";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">{phim.tenPhim}</h4>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div className="flex items-center gap-1">
                              <ClockCircleOutlined />
                              <span>{phim.thoiLuong} phút</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarOutlined />
                              <span>{new Date(phim.ngayKhoiChieu).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {phim.lstLichChieuTheoPhim?.length > 0 && (
                        <div className="ml-19">
                          <div className="text-xs font-medium text-gray-700 mb-2">Lịch chiếu:</div>
                          <div className="flex flex-wrap gap-2">
                            {phim.lstLichChieuTheoPhim.slice(0, 6).map(lich => (
                              <Button
                                key={lich.maLichChieu}
                                size="small"
                                type="primary"
                                ghost
                                className="text-xs h-7 px-2"
                                onClick={() => {
                                  // Navigate to booking page
                                  window.location.href = `/dat-ve/${phim.maPhim}`;
                                }}
                              >
                                {lich.ngayChieuGioChieu}
                              </Button>
                            ))}
                            {phim.lstLichChieuTheoPhim.length > 6 && (
                              <Button size="small" type="link" className="text-xs h-7 px-2">
                                +{phim.lstLichChieuTheoPhim.length - 6} nữa
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="Không có phim nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

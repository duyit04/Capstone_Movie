import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { Tabs } from "antd";

export default function MovieDetail() {
  const { id } = useParams();
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
  });

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setState({
          loading: true,
          data: null,
          error: null,
        });
        
        const result = await api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${id}`);
        
        // Get movie showtimes
        const showtimes = await api.get(`QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${id}`);
        
        setState({
          loading: false,
          data: {
            ...result.data.content,
            heThongRapChieu: showtimes.data.content.heThongRapChieu || [],
          },
          error: null,
        });
      } catch (err) {
        setState({
          loading: false,
          data: null,
          error: err,
        });
      }
    };
    
    fetchMovieDetail();
  }, [id]);

  const { data, loading, error } = state;

  if (loading) return <div className="container mx-auto py-10">Loading...</div>;
  if (error) return <div className="container mx-auto py-10">Error: {error.message}</div>;
  if (!data) return <div className="container mx-auto py-10">No data found</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-12 gap-8">
        {/* Movie Image and Info */}
        <div className="col-span-4">
          <img 
            src={data.hinhAnh} 
            alt={data.tenPhim} 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        
        <div className="col-span-8">
          <h1 className="text-3xl font-bold mb-4">{data.tenPhim}</h1>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="font-bold mr-2">Rating:</span>
              <div className="flex">
                {[...Array(Math.floor(data.danhGia / 2))].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2">({data.danhGia}/10)</span>
              </div>
            </div>
            
            <p className="mb-2"><span className="font-bold">Ngày khởi chiếu:</span> {new Date(data.ngayKhoiChieu).toLocaleDateString('vi-VN')}</p>
            
            <div className="mb-4">
              {data.hot && (
                <span className="inline-block bg-red-500 text-white px-2 py-1 rounded mr-2 text-sm">
                  HOT
                </span>
              )}
              {data.dangChieu && (
                <span className="inline-block bg-green-500 text-white px-2 py-1 rounded mr-2 text-sm">
                  ĐANG CHIẾU
                </span>
              )}
              {data.sapChieu && (
                <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded text-sm">
                  SẮP CHIẾU
                </span>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Mô tả</h2>
            <p className="text-gray-700">{data.moTa}</p>
          </div>
          
          {data.trailer && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Trailer</h2>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                onClick={() => window.open(data.trailer, '_blank')}
              >
                Xem Trailer
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Showtimes Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Lịch chiếu</h2>
        
        {data.heThongRapChieu && data.heThongRapChieu.length > 0 ? (
          <Tabs
            tabPosition="left"
            items={data.heThongRapChieu.map((heThongRap) => ({
              label: (
                <div className="flex items-center">
                  <img 
                    src={heThongRap.logo} 
                    alt={heThongRap.tenHeThongRap} 
                    className="w-10 h-10 mr-2"
                  />
                  <span>{heThongRap.tenHeThongRap}</span>
                </div>
              ),
              key: heThongRap.maHeThongRap,
              children: (
                <Tabs
                  tabPosition="left"
                  items={heThongRap.cumRapChieu.map((cumRap) => ({
                    label: (
                      <div className="text-left">
                        <h3 className="font-bold">{cumRap.tenCumRap}</h3>
                        <p className="text-xs">{cumRap.diaChi}</p>
                      </div>
                    ),
                    key: cumRap.maCumRap,
                    children: (
                      <div className="grid grid-cols-4 gap-4">
                        {cumRap.lichChieuPhim.map((lichChieu) => (
                          <button 
                            key={lichChieu.maLichChieu}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded"
                            onClick={() => window.location.href = `/dat-ve/${lichChieu.maLichChieu}`}
                          >
                            {new Date(lichChieu.ngayChieuGioChieu).toLocaleTimeString('vi-VN')}
                            <br />
                            <span className="text-xs">
                              {new Date(lichChieu.ngayChieuGioChieu).toLocaleDateString('vi-VN')}
                            </span>
                          </button>
                        ))}
                      </div>
                    ),
                  }))}
                />
              ),
            }))}
          />
        ) : (
          <p>Không có lịch chiếu</p>
        )}
      </div>
    </div>
  );
}

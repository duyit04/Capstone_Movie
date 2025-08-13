import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel, Tabs, Pagination } from "antd";
import { Link } from "react-router-dom";
import { fetchBanners, fetchMovies, fetchCinemas, fetchCinemaSchedules } from "./slice";
import "./styles.css";

export default function HomePage() {
  const dispatch = useDispatch();
  const { 
    banners: { data: banners, loading: bannersLoading },
    movies: { data: movies, loading: moviesLoading },
    cinemas: { data: cinemas, loading: cinemasLoading },
    cinemaSchedules: { data: cinemaSchedules, loading: schedulesLoading } 
  } = useSelector((state) => state.homeSlice);
  
  const [activeTab, setActiveTab] = useState("all"); // "all", "nowShowing", "comingSoon"
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Hiển thị 20 phim mỗi trang
  
  useEffect(() => {
    // Fetch all required data for the homepage
    dispatch(fetchBanners());
    dispatch(fetchMovies());
    dispatch(fetchCinemas());
    dispatch(fetchCinemaSchedules());
  }, [dispatch]);
  
  // Filter movies based on active tab
  const filteredMovies = movies?.filter((movie) => {
    if (activeTab === "all") return true;
    if (activeTab === "nowShowing") return movie.dangChieu;
    if (activeTab === "comingSoon") return movie.sapChieu;
    return true;
  });
  
  // Calculate pagination
  const totalMovies = filteredMovies?.length || 0;
  const totalPages = Math.ceil(totalMovies / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentMovies = filteredMovies?.slice(startIndex, endIndex) || [];
  
  // Reset to first page when changing tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="container mx-auto pb-10">
      {/* Banner Carousel */}
      <div className="mb-6">
        {bannersLoading ? (
          <div className="animate-pulse bg-gray-300 h-[350px] md:h-[450px] rounded-lg"></div>
        ) : banners ? (
          <div className="banner-container">
            <Carousel 
              autoplay 
              dots={true}
              dotPosition="bottom"
              effect="fade"
              autoplaySpeed={4000}
              className="banner-carousel"
            >
              {banners.map((banner) => (
                <div key={banner.maBanner} className="h-[350px] md:h-[450px] relative">
                  <img 
                    src={banner.hinhAnh} 
                    alt={`Banner ${banner.maBanner}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/1920x1080?text=Banner+Image";
                    }}
                  />
                  <div className="banner-content">
                    <h3 className="movie-title">{banner.maPhim ? `${banner.tenPhim || 'Phim Đặc Sắc'}` : 'Suất Chiếu Đặc Biệt'}</h3>
                    <p className="movie-info">
                      {banner.maPhim ? 'Đang chiếu tại rạp' : 'Khởi chiếu ngày 25.07'}
                    </p>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Không có dữ liệu banner</p>
          </div>
        )}
      </div>
      
      {/* Movies Section */}
      <div className="mt-8 mb-10">
        <h2 className="text-3xl font-bold mb-3 text-center">Phim chiếu rạp</h2>
        
        {/* Movie Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } rounded-l-lg border border-gray-200`}
              onClick={() => handleTabChange("all")}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "nowShowing"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } border-t border-b border-r border-gray-200`}
              onClick={() => handleTabChange("nowShowing")}
            >
              Đang chiếu
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "comingSoon"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } rounded-r-lg border-t border-b border-r border-gray-200`}
              onClick={() => handleTabChange("comingSoon")}
            >
              Sắp chiếu
            </button>
          </div>
        </div>
        
        {/* Movies Grid */}
        {moviesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-300 h-64 rounded-lg"></div>
            ))}
          </div>
        ) : currentMovies && currentMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentMovies.map((movie) => (
              <div key={movie.maPhim} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={movie.hinhAnh}
                  alt={movie.tenPhim}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                  }}
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 h-14 line-clamp-2">{movie.tenPhim}</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="ml-1 text-sm">{movie.danhGia}/10</span>
                    </div>
                    <Link
                      to={`/movie/${movie.maPhim}`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">Không có phim để hiển thị</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center">
            <div className="text-sm text-gray-500 mb-4">
              Trang {currentPage} của {totalPages}
            </div>
            <Pagination
              current={currentPage}
              total={totalMovies}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper={false}
              showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} phim`}
              className="custom-pagination"
              size="default"
            />
          </div>
        )}
      </div>
      
      {/* Cinema Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">Hệ thống rạp</h2>
        
        {cinemasLoading || schedulesLoading ? (
          <div className="animate-pulse bg-gray-300 h-96 rounded-lg"></div>
        ) : cinemaSchedules && cinemaSchedules.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <Tabs
              tabPosition="left"
              items={cinemaSchedules.map((cinema) => ({
                label: (
                  <div className="flex items-center">
                    <img 
                      src={cinema.logo} 
                      alt={cinema.tenHeThongRap} 
                      className="w-12 h-12 mr-2"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/48?text=Cinema";
                      }}
                    />
                    <span className="font-medium">{cinema.tenHeThongRap}</span>
                  </div>
                ),
                key: cinema.maHeThongRap,
                children: (
                  <Tabs
                    tabPosition="left"
                    style={{ height: 500 }}
                    items={cinema.lstCumRap.map((complex) => ({
                      label: (
                        <div className="text-left w-60">
                          <h3 className="font-bold truncate">{complex.tenCumRap}</h3>
                          <p className="text-xs text-gray-500 truncate">{complex.diaChi}</p>
                        </div>
                      ),
                      key: complex.maCumRap,
                      children: (
                        <div style={{ height: 500, overflow: 'auto' }}>
                          {complex.danhSachPhim.map((movie) => (
                            <div key={movie.maPhim} className="mb-4 pb-4 border-b">
                              <div className="flex mb-2">
                                <img 
                                  src={movie.hinhAnh} 
                                  alt={movie.tenPhim} 
                                  className="w-16 h-24 object-cover rounded mr-3"
                                  onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/64x96?text=Movie";
                                  }}
                                />
                                <div>
                                  <h4 className="font-bold">{movie.tenPhim}</h4>
                                  <p className="text-sm text-gray-600">120 phút</p>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {movie.lstLichChieuTheoPhim.slice(0, 8).map((showtime) => (
                                  <Link
                                    key={showtime.maLichChieu}
                                    to={`/dat-ve/${showtime.maLichChieu}`}
                                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded"
                                  >
                                    {new Date(showtime.ngayChieuGioChieu).toLocaleTimeString('vi-VN', { 
                                      hour: '2-digit', 
                                      minute: '2-digit'
                                    })}
                                  </Link>
                                ))}
                                
                                {movie.lstLichChieuTheoPhim.length > 8 && (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded">
                                    +{movie.lstLichChieuTheoPhim.length - 8} suất
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ),
                    }))}
                  />
                ),
              }))}
            />
          </div>
        ) : (
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Không có dữ liệu lịch chiếu</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel, Tabs, Pagination, Spin } from "antd";
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
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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
          <div className="h-[220px] md:h-[300px] rounded-lg flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : banners ? (
          <div className="banner-container full-bleed">
            <Carousel
              autoplay
              dots={false}
              infinite
              swipeToSlide
              slidesToShow={1}
              centerMode
              centerPadding="18%"
              autoplaySpeed={4000}
              className="banner-carousel"
              ref={carouselRef}
              beforeChange={(_, to) => setCurrentSlide(to)}
              responsive={[
                { breakpoint: 1280, settings: { centerPadding: "14%" } },
                { breakpoint: 1024, settings: { centerPadding: "10%" } },
                { breakpoint: 768, settings: { centerPadding: "6%" } },
                { breakpoint: 576, settings: { centerPadding: "0%" } }
              ]}
            >
              {banners.map((banner) => (
                <div key={banner.maBanner} className="group relative h-[260px] md:h-[360px] lg:h-[440px]">
                  <img
                    src={banner.hinhAnh}
                    alt={`Banner ${banner.maBanner}`}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/1920x1080?text=Banner+Image";
                    }}
                  />
                  <div className="banner-overlay"></div>
                  <div className="banner-inner">
                    <div className="banner-badges">
                      {banner.maPhim ? (
                        <span className="badge badge-primary">Đang chiếu</span>
                      ) : (
                        <span className="badge badge-secondary">Sự kiện</span>
                      )}
                    </div>
                    <div className="banner-buttons">
                      <Link
                        to={banner.maPhim ? `/movie/${banner.maPhim}` : '/list-movie'}
                        className="btn btn-primary"
                        aria-label="Xem chi tiết phim"
                      >
                        Xem chi tiết
                      </Link>
                      <Link
                        to="/list-movie"
                        className="btn btn-secondary"
                        aria-label="Đặt vé ngay"
                      >
                        Đặt vé
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
            <div className="banner-arrows">
              <button className="banner-arrow left" aria-label="Trước" onClick={() => carouselRef.current?.prev()}>
                
              </button>
              <button className="banner-arrow right" aria-label="Sau" onClick={() => carouselRef.current?.next()}>
                
              </button>
            </div>
            <div className="banner-thumbs">
              {banners.map((b, i) => (
                <button
                  key={b.maBanner || i}
                  className={`banner-thumb ${currentSlide === i ? 'active' : ''}`}
                  onClick={() => carouselRef.current?.goTo(i)}
                  aria-label={`Chuyển đến banner ${i + 1}`}
                >
                  <img
                    src={b.hinhAnh}
                    alt={`thumb-${i}`}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80x120?text=No+Img'; }}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-200 dark:bg-gray-800 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-300">Không có dữ liệu banner</p>
          </div>
        )}
      </div>

      {/* Movies Section */}
      <div className="mt-8 mb-10">
        <h2 className="text-3xl font-bold mb-3 text-center text-gray-900 dark:text-gray-100">Phim chiếu rạp</h2>

        {/* Movie Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {/* <button
              type="button"
              className={`px-4 py-2 text-base md:text-sm font-semibold ${
                activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black hover:text-blue-700 hover:bg-gray-100 dark:bg-surface dark:text-white dark:hover:text-blue-300 dark:hover:bg-[#2c2c2c]"
              } rounded-l-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface`}
              onClick={() => handleTabChange("all")}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-base md:text-sm font-semibold ${
                activeTab === "nowShowing"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black hover:text-blue-700 hover:bg-gray-100 dark:bg-surface dark:text-white dark:hover:text-blue-300 dark:hover:bg-[#2c2c2c]"
              } border-t border-b border-r border-gray-200 dark:border-gray-600focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface`}
              onClick={() => handleTabChange("nowShowing")}
            >
              Đang chiếu
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-base md:text-sm font-semibold ${
                activeTab === "comingSoon"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black hover:text-blue-700 hover:bg-gray-100 dark:bg-surface dark:text-white dark:hover:text-blue-300 dark:hover:bg-[#2c2c2c]"
              } rounded-r-lg border-t border-b border-r border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface`}
              onClick={() => handleTabChange("comingSoon")}
            >
              Sắp chiếu
            </button> */}
            <button
              type="button"
              className={`px-4 py-2 text-base md:text-sm font-semibold ${activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black dark:bg-surface dark:text-white"
                } rounded-l-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface`}
              onClick={() => handleTabChange("all")}
            >
              Tất cả
            </button>

            <button
              type="button"
              className={`px-4 py-2 text-base md:text-sm font-semibold ${activeTab === "nowShowing"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black dark:bg-surface dark:text-white"
                } border-t border-b border-r border-gray-200 dark:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface`}
              onClick={() => handleTabChange("nowShowing")}
            >
              Đang chiếu
            </button>

            <button
              type="button"
              className={`px-4 py-2 text-base md:text-sm font-semibold ${activeTab === "comingSoon"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black dark:bg-surface dark:text-white"
                } rounded-r-lg border-t border-b border-r border-gray-200 dark:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface`}
              onClick={() => handleTabChange("comingSoon")}
            >
              Sắp chiếu
            </button>


          </div>
        </div>

        {/* Movies Grid */}
        {moviesLoading ? (
          <div className="py-12 flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : currentMovies && currentMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentMovies.map((movie) => (
              <div key={movie.maPhim} className="gc-card group rounded-xl shadow-md overflow-hidden">
                <div className="gc-poster-wrap">
                  <img
                    src={movie.hinhAnh}
                    alt={movie.tenPhim}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                    }}
                  />
                  <div className="gc-rating">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span>{Number.isFinite(Number(movie.danhGia)) ? `${Number(movie.danhGia)}/10` : 'N/A'}</span>
                  </div>
                  <div className="gc-ribbon">
                    {movie.dangChieu ? 'Đang chiếu' : movie.sapChieu ? 'Sắp chiếu' : 'Phim'}
                  </div>
                  <div className="gc-overlay">
                    <div className="gc-actions">
                      <Link to={`/movie/${movie.maPhim}`} className="gc-btn gc-btn-primary">Mua vé</Link>
                      <Link to={`/movie/${movie.maPhim}`} className="gc-btn gc-btn-outline">Chi tiết</Link>
                    </div>
                  </div>
                </div>
                <div className="gc-meta">
                  <h3 className="gc-title">{movie.tenPhim}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-300">Không có phim để hiển thị</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
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
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Hệ thống rạp</h2>

        {cinemasLoading || schedulesLoading ? (
          <div className="h-96 rounded-lg flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : cinemaSchedules && cinemaSchedules.length > 0 ? (
          <div className="bg-white dark:bg-surface dark:text-gray-100 dark:border dark:border-gray-800 rounded-lg shadow-lg p-4">
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
                    <span className="font-medium text-gray-800 dark:text-gray-100">{cinema.tenHeThongRap}</span>
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
                          <h3 className="font-bold truncate text-gray-800 dark:text-gray-100">{complex.tenCumRap}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{complex.diaChi}</p>
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
                                    className="px-3 py-1 text-sm rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100"
                                  >
                                    {new Date(showtime.ngayChieuGioChieu).toLocaleTimeString('vi-VN', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </Link>
                                ))}

                                {movie.lstLichChieuTheoPhim.length > 8 && (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded dark:bg-gray-800 dark:text-gray-300">
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
          <div className="bg-gray-200 dark:bg-gray-800 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-300">Không có dữ liệu lịch chiếu</p>
          </div>
        )}
      </div>
    </div>
  );
}

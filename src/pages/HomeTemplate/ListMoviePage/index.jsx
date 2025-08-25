import { useEffect, useState } from "react";
import Movie from "./Movie";
import { useSelector,useDispatch} from "react-redux";
import {fetchListMovie} from "./slice";

export default function ListMoviePage() {
  const { data, loading, error } = useSelector((state) => state.listMovieSlice);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'nowShowing', 'comingSoon'
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    dispatch(fetchListMovie());
  }, [dispatch]);

  // Filter movies based on active tab
  useEffect(() => {
    if (!data) return;
    
    if (activeTab === "all") {
      setFilteredMovies(data);
    } else if (activeTab === "nowShowing") {
      // Chỉ hiển thị phim đang chiếu (ưu tiên dangChieu)
      setFilteredMovies(data.filter(movie => movie.dangChieu === true && movie.sapChieu !== true));
    } else if (activeTab === "comingSoon") {
      // Chỉ hiển thị phim sắp chiếu (không phải đang chiếu)
      setFilteredMovies(data.filter(movie => movie.sapChieu === true && movie.dangChieu !== true));
    }
  }, [activeTab, data]);

  if (loading) return (
    <div className="container mx-auto py-10 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Đang tải danh sách phim...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto py-10 text-center">
      <p className="text-red-600">Error: {error?.message || "Đã xảy ra lỗi khi tải danh sách phim"}</p>
      <button 
        onClick={() => dispatch(fetchListMovie())}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Thử lại
      </button>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Danh sách phim</h1>

      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button 
            className={`px-4 py-2 text-base md:text-sm font-semibold transition-colors ${activeTab === 'all' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} rounded-l-lg border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
            aria-pressed={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            Tất cả phim
          </button>
          <button 
            className={`px-4 py-2 text-base md:text-sm font-semibold transition-colors ${activeTab === 'nowShowing' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} border-t border-b border-r border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
            aria-pressed={activeTab === 'nowShowing'}
            onClick={() => setActiveTab('nowShowing')}
          >
            Phim đang chiếu
          </button>
          <button 
            className={`px-4 py-2 text-base md:text-sm font-semibold transition-colors ${activeTab === 'comingSoon' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} rounded-r-lg border-t border-b border-r border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
            aria-pressed={activeTab === 'comingSoon'}
            onClick={() => setActiveTab('comingSoon')}
          >
            Phim sắp chiếu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies && filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => <Movie key={movie.maPhim} movieData={movie} />)
        ) : (
          <p className="col-span-4 text-center text-gray-500">Không có phim nào trong danh mục này</p>
        )}
      </div>
    </div>
  );
}

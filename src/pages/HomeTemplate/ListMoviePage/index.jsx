import { useEffect } from "react";
import Movie from "./Movie";
import { useSelector,useDispatch} from "react-redux";
import {fetchListMovie} from "./slice";

export default function ListMoviePage() {
  const { data, loading, error } = useSelector((state) => state.listMovieSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchListMovie());
  }, [dispatch]);

  if (loading) return (
    <div className="container mx-auto py-10 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Đang tải danh sách phim...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto py-10 text-center">
      <p className="text-red-600">Error: {error.message}</p>
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
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Tất cả phim
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Phim đang chiếu
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Phim sắp chiếu
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data && data.length > 0 ? (
          data.map((movie) => <Movie key={movie.maPhim} movieData={movie} />)
        ) : (
          <p className="col-span-4 text-center text-gray-500">Không có phim nào</p>
        )}
      </div>
    </div>
  );
}

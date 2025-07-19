
import { Link } from "react-router-dom";

export default function Movie({ movieData }) {
    if (!movieData) return null;
    
    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <Link to={`/movie/${movieData.maPhim}`} className="relative block">
                <img 
                    className="rounded-t-lg w-full h-64 object-cover" 
                    src={movieData?.hinhAnh || "https://via.placeholder.com/300x450?text=No+Image"} 
                    alt={movieData?.tenPhim || "Movie"} 
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x450?text=Error+Loading+Image";
                    }}
                />
                {movieData.dangChieu && (
                    <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Đang chiếu
                    </span>
                )}
                {movieData.sapChieu && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Sắp chiếu
                    </span>
                )}
            </Link>
            <div className="p-5">
                <Link to={`/movie/${movieData.maPhim}`}>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 line-clamp-2 h-14">
                        {movieData?.tenPhim || "Movie Title"}
                    </h5>
                </Link>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-3 h-14">
                    {movieData?.moTa?.substring(0, 100) || "No description"}
                    {movieData?.moTa?.length > 100 ? "..." : ""}
                </p>
                
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="ml-1 text-sm">{movieData?.danhGia || "N/A"}/10</span>
                    </div>
                    
                    <Link 
                        to={`/movie/${movieData.maPhim}`}
                        className="px-3 py-1 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Chi tiết
                    </Link>
                </div>
            </div>
        </div>
    );
}

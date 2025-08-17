import { Link } from "react-router-dom";
import "../HomePage/styles.css";

export default function Movie({ movieData }) {
  if (!movieData) return null;

  return (
    <div className="gc-card group rounded-xl shadow-md overflow-hidden">
      <div className="gc-poster-wrap">
        <img
          src={movieData?.hinhAnh}
          alt={movieData?.tenPhim || "Movie"}
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
          <span>{Number.isFinite(Number(movieData?.danhGia)) ? `${Number(movieData?.danhGia)}/10` : 'N/A'}</span>
        </div>

        <div className="gc-ribbon">
          {movieData?.dangChieu ? 'Đang chiếu' : movieData?.sapChieu ? 'Sắp chiếu' : 'Phim'}
        </div>

        <div className="gc-overlay">
          <div className="gc-actions">
            <Link to={`/movie/${movieData.maPhim}`} className="gc-btn gc-btn-primary">Mua vé</Link>
            <Link to={`/movie/${movieData.maPhim}`} className="gc-btn gc-btn-outline">Chi tiết</Link>
          </div>
        </div>
      </div>

      <div className="gc-meta">
        <h3 className="gc-title">{movieData?.tenPhim || 'Movie Title'}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">
          {movieData?.moTa ? movieData.moTa : 'Không có mô tả'}
        </p>
      </div>
    </div>
  );
}

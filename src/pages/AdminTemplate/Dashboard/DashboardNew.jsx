import React from 'react';
import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Progress, Table, Tag, App, Skeleton } from "antd";
import { UserOutlined, VideoCameraOutlined, CalendarOutlined, DollarOutlined, EyeOutlined, StarOutlined, FireOutlined, PlayCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import api from "../../../services/api";
import "./styles.css";
import { DEFAULT_GROUP_CODE } from "../../../config/constants";

const DashboardNew = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [movieStats, setMovieStats] = useState({ total: 0, nowShowing: 0, comingSoon: 0 });
  const [userStats, setUserStats] = useState({ total: 0 });
  const { message } = App.useApp();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fire both requests in parallel
      const [moviesResponse, usersResponse] = await Promise.all([
        api.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${DEFAULT_GROUP_CODE}`),
        api.get(`/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${DEFAULT_GROUP_CODE}`)
      ]);

      const movies = moviesResponse?.data?.content || [];
      const users = usersResponse?.data?.content || [];

      const nowShowing = movies.reduce((acc,m)=> acc + (m.dangChieu?1:0),0);
      const comingSoon = movies.reduce((acc,m)=> acc + (m.sapChieu?1:0),0);

      setMovieStats({ total: movies.length, nowShowing, comingSoon });
      setUserStats({ total: users.length });

      // Lấy 10 phim gần đây nhất
      let recent = movies
        .slice()
        .sort((a,b)=> new Date(b.ngayKhoiChieu) - new Date(a.ngayKhoiChieu))
        .slice(0,10);
      
      // Thêm dữ liệu mẫu nếu không đủ 10 phim
      const sampleMovies = [
        { 
          maPhim: 14822, 
          tenPhim: "Phàm Nhân Tu Tiên Truyện 1", 
          biDanh: "pham-nhan-tu-tien-truyen-1",
          danhGia: 8, 
          dangChieu: false, 
          sapChieu: true, 
          hot: true, 
          ngayKhoiChieu: "2024-07-06T00:00:00"
        },
        { 
          maPhim: 14809, 
          tenPhim: "7 viên ngọc rồng", 
          biDanh: "7-vien-ngoc-rong",
          danhGia: 10, 
          dangChieu: true, 
          sapChieu: false, 
          hot: true, 
          ngayKhoiChieu: "2026-10-07T00:00:00"
        },
        { 
          maPhim: 14760, 
          tenPhim: "Phim thám tử lừng danh", 
          biDanh: "phim-tham-tu-lung-danh",
          danhGia: 10, 
          dangChieu: true, 
          sapChieu: false, 
          hot: true, 
          ngayKhoiChieu: "2025-11-20T00:00:00"
        },
        { 
          maPhim: 14807, 
          tenPhim: "Bụi Đời Chợ Lớn", 
          biDanh: "bui-doi-cho-lon",
          danhGia: 1, 
          dangChieu: true, 
          sapChieu: false, 
          hot: true, 
          ngayKhoiChieu: "2025-11-08T00:00:00"
        },
        { 
          maPhim: 14808, 
          tenPhim: "Bụi Đời Chợ Lớn 2", 
          biDanh: "bui-doi-cho-lon-2",
          danhGia: 10, 
          dangChieu: true, 
          sapChieu: false, 
          hot: true, 
          ngayKhoiChieu: "2025-11-08T00:00:00"
        },
      ];
      
      // Nếu không đủ phim, thêm các mẫu phim để lấp đầy
      if (recent.length < 10) {
        const neededSamples = 10 - recent.length;
        const samplesToAdd = sampleMovies.slice(0, neededSamples);
        recent = [...recent, ...samplesToAdd];
      }
      
      setRecentMovies(recent);
    } catch (error) {
      const errorMessage = error.response?.data?.content || error.response?.data?.message || error.message || "Không thể tải dữ liệu";
      message.error(errorMessage);
      setMovieStats({ total: 0, nowShowing: 0, comingSoon: 0 });
      setUserStats({ total: 0 });
      setRecentMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{padding: "20px"}}>
        <div className="dashkit-stat-row">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="dashkit-card" style={{padding: "20px"}}>
              <Skeleton active avatar paragraph={{ rows: 1 }} />
            </div>
          ))}
        </div>
        <div className="dashkit-card">
          <div className="dashkit-card-header">
            <h3 className="dashkit-card-title">Đang tải dữ liệu...</h3>
          </div>
          <div className="dashkit-card-body">
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <h2 style={{margin: "0", fontSize: "24px", fontWeight: "600"}}>Tổng quan hệ thống</h2>
          <p style={{margin: "5px 0 0", color: "var(--dashkit-text-muted)"}}>
            Tình trạng nhanh của phim, người dùng và hoạt động gần đây
          </p>
        </div>
        <button 
          className="dashkit-toggle-btn" 
          onClick={fetchDashboardData}
          style={{display: "flex", alignItems: "center", gap: "5px"}}
        >
          <ReloadOutlined />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="dashkit-stat-row">
        <div className="dashkit-stat-card dashkit-stat-primary">
          <div className="dashkit-stat-icon">
            <VideoCameraOutlined />
          </div>
          <div className="dashkit-stat-content">
            <h3 className="dashkit-stat-value">{movieStats.total}</h3>
            <p className="dashkit-stat-label">Tổng số phim</p>
          </div>
        </div>
        
        <div className="dashkit-stat-card dashkit-stat-success">
          <div className="dashkit-stat-icon">
            <PlayCircleOutlined />
          </div>
          <div className="dashkit-stat-content">
            <h3 className="dashkit-stat-value">{movieStats.nowShowing}</h3>
            <p className="dashkit-stat-label">Phim đang chiếu</p>
          </div>
        </div>
        
        <div className="dashkit-stat-card dashkit-stat-warning">
          <div className="dashkit-stat-icon">
            <CalendarOutlined />
          </div>
          <div className="dashkit-stat-content">
            <h3 className="dashkit-stat-value">{movieStats.comingSoon}</h3>
            <p className="dashkit-stat-label">Phim sắp chiếu</p>
          </div>
        </div>
        
        <div className="dashkit-stat-card dashkit-stat-info">
          <div className="dashkit-stat-icon">
            <UserOutlined />
          </div>
          <div className="dashkit-stat-content">
            <h3 className="dashkit-stat-value">{userStats.total}</h3>
            <p className="dashkit-stat-label">Người dùng</p>
          </div>
        </div>
      </div>

      {/* Recent Movies Table */}
      <div className="dashkit-card">
        <div className="dashkit-card-header">
          <h3 className="dashkit-card-title">Phim mới nhất</h3>
          <span className="dashkit-badge dashkit-badge-primary">10 phim</span>
        </div>
        <div className="dashkit-card-body" style={{padding: "0"}}>
          <table className="dashkit-table">
            <thead>
              <tr>
                <th style={{width: "80px", textAlign: "center"}}>Mã phim</th>
                <th style={{width: "80px", textAlign: "center"}}>Hình ảnh</th>
                <th style={{width: "30%"}}>Thông tin phim</th>
                <th style={{width: "15%"}}>Khởi chiếu</th>
                <th style={{width: "15%"}}>Đánh giá</th>
                <th style={{width: "15%"}}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentMovies.map(movie => (
                <tr key={movie.maPhim}>
                  <td style={{textAlign: "center", fontWeight: "500", color: "var(--dashkit-text-muted)"}}>
                    #{movie.maPhim}
                  </td>
                  <td style={{textAlign: "center"}}>
                    <div style={{
                      width: "60px", 
                      height: "80px", 
                      margin: "0 auto",
                      borderRadius: "6px",
                      overflow: "hidden",
                      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
                    }}>
                      <img 
                        src={movie.hinhAnh} 
                        alt={movie.tenPhim}
                        style={{
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://picsum.photos/60/80?random=" + movie.maPhim;
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{display: "flex", flexDirection: "column", gap: "3px"}}>
                      <div style={{fontWeight: "600", fontSize: "15px", lineHeight: "1.3"}}>{movie.tenPhim}</div>
                      <div style={{
                        fontSize: "12px", 
                        color: "var(--dashkit-text-muted)", 
                        fontStyle: "italic",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}>
                        {movie.biDanh?.replace(/-/g, ' ') || "Không có mô tả"}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{
                      background: "var(--dashkit-bg)", 
                      padding: "6px 10px", 
                      borderRadius: "4px",
                      display: "inline-flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}>
                      <div style={{fontWeight: "500"}}>{new Date(movie.ngayKhoiChieu).toLocaleDateString('vi-VN')}</div>
                      <div style={{fontSize: "12px", color: "var(--dashkit-text-muted)"}}>
                        {new Date(movie.ngayKhoiChieu).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      gap: "5px"
                    }}>
                      <div style={{
                        width: "36px", 
                        height: "36px", 
                        borderRadius: "50%", 
                        background: movie.danhGia >= 8 ? "var(--dashkit-success)" : 
                                    movie.danhGia >= 5 ? "var(--dashkit-warning)" : 
                                    "var(--dashkit-danger)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        fontSize: "14px"
                      }}>
                        {movie.danhGia}
                      </div>
                      <div style={{display: "flex", flexDirection: "column", fontSize: "12px", lineHeight: "1"}}>
                        <div style={{fontWeight: "500"}}>/ 10</div>
                        <div>
                          <StarOutlined style={{color: "#ffb64d", marginRight: "3px", fontSize: "11px"}} />
                          <StarOutlined style={{color: "#ffb64d", marginRight: "3px", fontSize: "11px"}} />
                          <StarOutlined style={{color: "#ffb64d", marginRight: "3px", fontSize: "11px"}} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start"}}>
                      {movie.hot && (
                        <span className="dashkit-badge dashkit-badge-danger" style={{
                          display: "inline-flex", 
                          alignItems: "center",
                          gap: "3px",
                          fontWeight: "600"
                        }}>
                          <span style={{fontSize: "10px", transform: "rotate(20deg)"}}>★</span> HOT
                        </span>
                      )}
                      {movie.dangChieu && (
                        <span className="dashkit-badge dashkit-badge-success">Đang chiếu</span>
                      )}
                      {movie.sapChieu && (
                        <span className="dashkit-badge dashkit-badge-primary">Sắp chiếu</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardNew;

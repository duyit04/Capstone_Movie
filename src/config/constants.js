// Các hằng số chung của dự án
export const APP_CONSTANTS = {
  // Mã nhóm mặc định cho API
  DEFAULT_GROUP_CODE: "GP00",
  
  // Các endpoint API chung
  API_ENDPOINTS: {
    MOVIES: "QuanLyPhim/LayDanhSachPhim",
    USERS: "QuanLyNguoiDung/LayDanhSachNguoiDung",
    CINEMAS: "QuanLyRap/LayThongTinLichChieuHeThongRap"
  }
};

// Export trực tiếp để dễ sử dụng
export const DEFAULT_GROUP_CODE = APP_CONSTANTS.DEFAULT_GROUP_CODE;
export const API_ENDPOINTS = APP_CONSTANTS.API_ENDPOINTS;

// Utility functions để quản lý xác thực người dùng

/**
 * Lưu thông tin đăng nhập vào localStorage
 * @param {Object} userInfo - Thông tin người dùng
 */
export const saveUserAuth = (userInfo) => {
  try {
    // Lưu thông tin người dùng vào cả 2 bộ key để đảm bảo tương thích
    localStorage.setItem('USER_INFO', JSON.stringify(userInfo));
    localStorage.setItem('ACCESS_TOKEN', userInfo.accessToken);
    localStorage.setItem('USER_LOGIN', JSON.stringify(userInfo));
    localStorage.setItem('USER_LOGIN_TOKEN', userInfo.accessToken);
    
    // Dispatch event để thông báo thay đổi trạng thái đăng nhập
    window.dispatchEvent(new Event('userLoginChange'));
    window.dispatchEvent(new CustomEvent("authChange", { detail: { type: 'login' } }));
  } catch (error) {
    console.error('Lỗi khi lưu thông tin đăng nhập:', error);
  }
};

/**
 * Lấy thông tin người dùng từ localStorage
 * @returns {Object|null} Thông tin người dùng hoặc null nếu không có
 */
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem("USER_INFO") || localStorage.getItem("USER_LOGIN");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    return null;
  }
};

/**
 * Lấy access token từ localStorage
 * @returns {string|null} Access token hoặc null nếu không có
 */
export const getAccessToken = () => {
  try {
    return localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("USER_LOGIN_TOKEN");
  } catch (error) {
    console.error('Lỗi khi lấy access token:', error);
    return null;
  }
};

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 * @returns {boolean} true nếu đã đăng nhập, false nếu chưa
 */
export const isAuthenticated = () => {
  const userInfo = getUserInfo();
  const accessToken = getAccessToken();
  return !!(userInfo && accessToken);
};

/**
 * Kiểm tra xem người dùng có phải là admin không
 * @returns {boolean} true nếu là admin, false nếu không
 */
export const isAdmin = () => {
  const userInfo = getUserInfo();
  return userInfo && userInfo.maLoaiNguoiDung === "QuanTri";
};

/**
 * Xóa tất cả thông tin đăng nhập khỏi localStorage
 */
export const clearUserAuth = () => {
  try {
    localStorage.removeItem("USER_INFO");
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER_LOGIN");
    localStorage.removeItem("USER_LOGIN_TOKEN");
    
    // Dispatch event để thông báo thay đổi trạng thái đăng xuất
    window.dispatchEvent(new Event('userLoginChange'));
    window.dispatchEvent(new Event("authChange"));
  } catch (error) {
    console.error('Lỗi khi xóa thông tin đăng nhập:', error);
  }
};

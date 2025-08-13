import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Input, Avatar, Dropdown, Badge, Drawer, Menu, Switch, Tooltip as AntdTooltip, Divider, message } from "antd";
import { 
  UserOutlined, 
  BellOutlined, 
  MenuOutlined, 
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,
  CrownOutlined,
  CalendarOutlined,
  BookOutlined,
  HeartOutlined
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";
import LoginModal from "../LoginModal";
import RegisterModal from "../RegisterModal";
import movieLogo from "../../assets/movie.png";
import "./styles.css";

// Search component đã được thay thế bằng Input component

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Lấy thông tin người dùng từ localStorage
  const getUserInfo = () => {
    const userInfo = localStorage.getItem("USER_INFO") || localStorage.getItem("USER_LOGIN");
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error("Error parsing user info:", error);
        return null;
      }
    }
    return null;
  };

  const userInfo = getUserInfo();

  useEffect(() => {
    const handleAuthChange = () => {
      const updatedUserInfo = localStorage.getItem("USER_INFO");
      if (updatedUserInfo) {
        // setUserInfo(JSON.parse(updatedUserInfo)); // This line was removed as per the new_code
      } else {
        // setUserInfo(null); // This line was removed as per the new_code
      }
    };

    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    // Xóa tất cả thông tin xác thực
    localStorage.removeItem("USER_INFO");
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER_LOGIN");
    localStorage.removeItem("USER_LOGIN_TOKEN");
    
    // Dispatch event để thông báo đăng xuất
    window.dispatchEvent(new Event("authChange"));
    
    message.success("Đăng xuất thành công!");
    navigate("/");
  };

  const handleSearch = (value) => {
  if (!value.trim()) return;
  navigate(`/search?q=${encodeURIComponent(value.trim())}`);
  setSearchValue("");
  setShowMobileSearch(false);
  };

  const userMenuItems = [
    {
      key: "profile-header",
      type: "group",
      label: (
        <div className="user-profile-header">
          <div className="flex items-center space-x-3">
            <Avatar
              src={userInfo?.avatar}
              icon={<UserOutlined />}
              size={48}
              className="mobile-user-avatar"
            />
            <div>
              <p className="text-cinema-primary font-semibold text-lg">
                {userInfo?.hoTen || userInfo?.taiKhoan}
              </p>
              <p className="text-cinema-secondary text-sm">
                {userInfo?.email || userInfo?.taiKhoan}
              </p>
              <span className="role-badge">
                {userInfo?.maLoaiNguoiDung === 'QuanTri' ? 'Quản trị viên' : 'Thành viên'}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "bookings",
      icon: <BookOutlined />,
      label: "Lịch sử đặt vé",
      onClick: () => navigate("/bookings"),
    },
    {
      key: "favorites",
      icon: <HeartOutlined />,
      label: "Phim yêu thích",
      onClick: () => navigate("/favorites"),
    },
    {
      key: "calendar",
      icon: <CalendarOutlined />,
      label: "Lịch chiếu",
      onClick: () => navigate("/schedule"),
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: () => navigate("/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  const mobileMenuItems = [
    {
      key: "home",
      label: "Trang chủ",
      onClick: () => {
        navigate("/");
        setIsMobileMenuOpen(false);
      },
      className: location.pathname === "/" ? "mobile-nav-item active" : "mobile-nav-item",
    },
    {
      key: "movies",
      label: "Phim",
      onClick: () => {
        navigate("/list-movie");
        setIsMobileMenuOpen(false);
      },
      className: location.pathname === "/list-movie" ? "mobile-nav-item active" : "mobile-nav-item",
    },
    {
      key: "cinemas",
      label: "Rạp phim",
      onClick: () => {
        navigate("/cinemas");
        setIsMobileMenuOpen(false);
      },
      className: location.pathname === "/cinemas" ? "mobile-nav-item active" : "mobile-nav-item",
    },
    {
      key: "news",
      label: "Tin tức",
      onClick: () => {
        navigate("/news");
        setIsMobileMenuOpen(false);
      },
      className: location.pathname === "/news" ? "mobile-nav-item active" : "mobile-nav-item",
    },
    {
      key: "about",
      label: "Giới thiệu",
      onClick: () => {
        navigate("/about");
        setIsMobileMenuOpen(false);
      },
      className: location.pathname === "/about" ? "mobile-nav-item active" : "mobile-nav-item",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <header className={`header-container ${scrolled ? "scrolled" : ""}`}>
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between header-inner-height">
          {/* Left Section: Logo */}
          <motion.div className="flex-shrink-0 logo-container" variants={itemVariants}>
            <Link to="/" className="flex items-center space-x-3">
              <div className="logo-icon w-10 h-10 lg:w-12 lg:h-12">
                <img src={movieLogo} alt="CyberMovie Logo" className="w-full h-full object-contain" />
              </div>
              <div className="logo-text">
                <h1>CyberMovie</h1>
              </div>
            </Link>
          </motion.div>

          {/* Center Section: Navigation */}
          <motion.nav className="hidden lg:flex items-center justify-start flex-shrink-0 mr-6" variants={itemVariants}>
            <div className="flex space-x-1">
              <Link
                to="/"
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
              >
                Trang chủ
              </Link>
              <Link
                to="/movies"
                className={`nav-link ${location.pathname === "/movies" ? "active" : ""}`}
              >
                Phim
              </Link>
              <Link
                to="/cinemas"
                className={`nav-link ${location.pathname === "/cinemas" ? "active" : ""}`}
              >
                Rạp phim
              </Link>
              <Link
                to="/news"
                className={`nav-link ${location.pathname === "/news" ? "active" : ""}`}
              >
                Tin tức
              </Link>
              <Link
                to="/about"
                className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
              >
                Giới thiệu
              </Link>
            </div>
          </motion.nav>

          {/* Search Bar - Desktop */}
          <motion.div className="hidden lg:block search-container mx-4" variants={itemVariants}>
            <div className="search-input-wrapper">
              <Input
                placeholder="Tìm kiếm phim, diễn viên..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={(e) => handleSearch(e.target.value)}
                size="large"
                className="header-search-input"
                aria-label="Tìm kiếm"
                prefix={<SearchOutlined />}
              />
            </div>
          </motion.div>

          {/* Right Actions */}
          <motion.div 
            className="flex items-center justify-end right-actions-container"
            variants={itemVariants}
          >
            {/* Mobile search toggle */}
            <div className="action-item lg:hidden">
              <Button
                type="text"
                icon={<SearchOutlined />}
                className={`action-button ${showMobileSearch ? "active" : ""}`}
                aria-label="Mở tìm kiếm"
                onClick={() => setShowMobileSearch(v => !v)}
              />
            </div>
            
            <div className="action-item">
              <AntdTooltip title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}>
                <Switch
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  checkedChildren="🌙"
                  unCheckedChildren="☀️"
                  className="theme-toggle-switch"
                />
              </AntdTooltip>
            </div>

            {userInfo ? (
              <div className="user-profile-container ml-4">
                <Dropdown
                  menu={{ 
                    items: userMenuItems,
                    className: "user-profile-dropdown"
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                  overlayClassName="user-dropdown-overlay"
                >
                  <div className="user-profile-display">
                    <Avatar
                      src={userInfo.avatar}
                      icon={<UserOutlined />}
                      className="user-avatar"
                    />
                    <div className="user-profile-info hidden md:block">
                      <p className="user-profile-name">
                        {userInfo.hoTen || userInfo.taiKhoan}
                      </p>
                      <p className="user-profile-role">
                        {userInfo.maLoaiNguoiDung === 'QuanTri' ? 'Quản trị viên' : 'Thành viên'}
                      </p>
                    </div>
                    {userInfo.maLoaiNguoiDung === 'QuanTri' && (
                      <CrownOutlined className="text-warning-500 text-sm ml-1" />
                    )}
                  </div>
                </Dropdown>
              </div>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-3 ml-4">
                <Button
                  type="text"
                  onClick={() => setLoginOpen(true)}
                  className="auth-login-btn"
                >
                  Đăng nhập
                </Button>
                <Button
                  className="auth-register-btn"
                  onClick={() => setRegisterOpen(true)}
                >
                  Đăng ký
                </Button>
              </div>
            )}

            <div className="action-item ml-2 sm:ml-3">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setIsMobileMenuOpen(true)}
                className="mobile-menu-button"
                aria-label="Mở menu"
              />
            </div>
          </motion.div>
        </div>
        {/* Mobile Search Bar (collapsible) */}
        <div className={`lg:hidden mobile-search-wrapper ${showMobileSearch ? "open" : ""}`}>
          <div className="mobile-search-container">
            <Input
              placeholder="Tìm kiếm phim..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={(e) => handleSearch(e.target.value)}
              size="middle"
              className="header-search-input"
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        className="mobile-menu-drawer"
        styles={{
          body: { padding: 0 }
        }}
      >
        <div className="p-4">
          {userInfo && (
            <div className="mobile-user-profile">
              <div className="text-center">
                <Avatar
                  src={userInfo.avatar}
                  icon={<UserOutlined />}
                  className="mobile-user-avatar"
                />
                <h3 className="text-cinema-primary font-semibold text-lg mt-3">
                  {userInfo.hoTen || userInfo.taiKhoan}
                </h3>
                <p className="text-cinema-secondary text-sm mb-2">
                  {userInfo.email || userInfo.taiKhoan}
                </p>
                <span className="mobile-user-role-badge">
                  {userInfo.maLoaiNguoiDung === 'QuanTri' ? 'Quản trị viên' : 'Thành viên'}
                </span>
              </div>
            </div>
          )}

          <Menu
            mode="vertical"
            items={mobileMenuItems}
            className="border-0 bg-transparent"
          />

          {userInfo && (
            <>
              <Divider />
              <div className="space-y-2">
                <Button
                  block
                  icon={<UserOutlined />}
                  className="mobile-nav-item text-left"
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Hồ sơ cá nhân
                </Button>
                <Button
                  block
                  icon={<BookOutlined />}
                  className="mobile-nav-item text-left"
                  onClick={() => {
                    navigate("/bookings");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Lịch sử đặt vé
                </Button>
                <Button
                  block
                  icon={<LogoutOutlined />}
                  danger
                  className="mobile-nav-item text-left"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>

      {/* Login Modal */}
      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </header>
  );
} 
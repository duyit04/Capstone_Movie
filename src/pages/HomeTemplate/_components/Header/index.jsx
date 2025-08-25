import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Drawer, Avatar, Dropdown, Space, Switch } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import logo from "../../../../assets/movie.png";
import { getUserInfo, clearUserAuth } from "../../../../lib/auth";

const { Header: AntHeader } = Layout;

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const checkUserLogin = () => {
      const userInfo = getUserInfo();
      setUser(userInfo);
    };

    // Kiểm tra lần đầu
    checkUserLogin();

    // Lắng nghe event khi có thay đổi đăng nhập
    const handleUserLoginChange = () => {
      checkUserLogin();
    };

    window.addEventListener('userLoginChange', handleUserLoginChange);

    // Cleanup event listener
    return () => {
      window.removeEventListener('userLoginChange', handleUserLoginChange);
    };
  }, []);

  // Init theme by stored preference or OS setting, and apply html.dark
  useEffect(() => {
    try {
      const stored = localStorage.getItem('THEME');
      const root = document.documentElement;
      if (stored === 'dark' || stored === 'light') {
        const dark = stored === 'dark';
        setIsDark(dark);
        if (dark) root.classList.add('dark'); else root.classList.remove('dark');
        return;
      }
      const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      const dark = !!mql?.matches;
      setIsDark(dark);
      if (dark) root.classList.add('dark'); else root.classList.remove('dark');
    } catch (_) {}
  }, []);

  const handleLogout = () => {
    // Xóa tất cả thông tin xác thực
    clearUserAuth();
    setUser(null);
    
    navigate("/login");
  };

  const toggleTheme = (checked) => {
    setIsDark(checked);
    const root = document.documentElement;
    if (checked) {
      root.classList.add('dark');
      localStorage.setItem('THEME', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('THEME', 'light');
    }
  };

  const userMenuItems = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "2",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader style={{ background: "#032055", padding: "0 20px", position: "sticky", top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
        <div className="logo">
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="Movie Logo"
              style={{ height: 40, marginRight: 10 }}
            />
            <span style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold" }}>
              MOVIE
            </span>
          </Link>
        </div>
        {/* Menu trên desktop */}
        <div className="menu-desktop" style={{ display: "flex" }}>
          <Menu
            mode="horizontal"
            style={{ background: "transparent", borderBottom: "none" }}
            selectedKeys={[window.location.pathname]}
            disabledOverflow
            items={[
              { key: "/", label: <NavLink to="/" style={{ color: "#fff" }}>Trang chủ</NavLink> },
              { key: "/about", label: <NavLink to="/about" style={{ color: "#fff" }}>Giới thiệu</NavLink> },
              { key: "/list-movie", label: <NavLink to="/list-movie" style={{ color: "#fff" }}>Phim</NavLink> },
              { key: "/cinemas", label: <NavLink to="/cinemas" style={{ color: "#fff" }}>Rạp</NavLink> },
              { key: "/news", label: <NavLink to="/news" style={{ color: "#fff" }}>Tin tức</NavLink> },
            ]}
          />
        </div>

        {/* Menu trên mobile */}
        <div className="menu-mobile" style={{ display: "flex", alignItems: "center" }}>
          <Button
            icon={<MenuOutlined />}
            type="text"
            style={{ color: "#fff", fontSize: "18px" }}
            onClick={() => setMobileMenuOpen(true)}
          />
          
          <Drawer
            title="MOVIE"
            placement="right"
            onClose={() => setMobileMenuOpen(false)}
            open={mobileMenuOpen}
          >
            <Menu
              mode="vertical"
              selectedKeys={[window.location.pathname]}
              items={[
                { key: "/", label: <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link> },
                { key: "/list-movie", label: <Link to="/list-movie" onClick={() => setMobileMenuOpen(false)}>Phim</Link> },
                { key: "/cinemas", label: <Link to="/cinemas" onClick={() => setMobileMenuOpen(false)}>Rạp</Link> },
                { key: "/news", label: <Link to="/news" onClick={() => setMobileMenuOpen(false)}>Tin tức</Link> },
                { key: "/about", label: <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Giới thiệu</Link> },
                ...(!user ? [
                  { key: "/login", label: <Link to="/login" onClick={() => setMobileMenuOpen(false)}><LoginOutlined /> Đăng nhập</Link> },
                  { key: "/register", label: <Link to="/register" onClick={() => setMobileMenuOpen(false)}><UserAddOutlined /> Đăng ký</Link> },
                ] : [
                  { key: "/profile", label: <Link to="/profile" onClick={() => setMobileMenuOpen(false)}><UserOutlined /> Thông tin cá nhân</Link> },
                ])
              ]}
            />
          </Drawer>
        </div>

        {/* Authentication buttons + Theme switch */}
        <div className="auth-buttons" style={{ display: "flex", alignItems: "center" }}>
          <Space size="middle">
            <Switch
              checked={isDark}
              onChange={toggleTheme}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
            {!user ? (
              <>
                <Button 
                  type="primary" 
                  ghost 
                  icon={<LoginOutlined />} 
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Button>
                <Button 
                  type="primary" 
                  icon={<UserAddOutlined />} 
                  onClick={() => navigate("/register")}
                >
                  Đăng ký
                </Button>
              </>
            ) : (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <a onClick={e => e.preventDefault()}>
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <span style={{ color: "#fff" }}>{user.hoTen}</span>
                  </Space>
                </a>
              </Dropdown>
            )}
          </Space>
        </div>
      </div>
    </AntHeader>
  );
}

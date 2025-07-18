import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Drawer, Avatar, Dropdown, Space } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Header: AntHeader } = Layout;

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const userInfo = localStorage.getItem("USER_INFO");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("USER_INFO");
    localStorage.removeItem("ACCESS_TOKEN");
    setUser(null);
    navigate("/login");
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
              src="/src/assets/react.svg"
              alt="Cyber Movie Logo"
              style={{ height: 40, marginRight: 10 }}
            />
            <span style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold" }}>
              CYBER MOVIE
            </span>
          </Link>
        </div>
        {/* Menu trên desktop */}
        <div className="menu-desktop" style={{ display: "flex" }}>
          <Menu
            mode="horizontal"
            style={{ background: "transparent", borderBottom: "none" }}
            selectedKeys={[window.location.pathname]}
          >
            <Menu.Item key="/">
              <NavLink to="/" style={{ color: "#fff" }}>Trang chủ</NavLink>
            </Menu.Item>
            <Menu.Item key="/list-movie">
              <NavLink to="/list-movie" style={{ color: "#fff" }}>Phim</NavLink>
            </Menu.Item>
            <Menu.Item key="/news">
              <NavLink to="/news" style={{ color: "#fff" }}>Tin tức</NavLink>
            </Menu.Item>
            <Menu.Item key="/about">
              <NavLink to="/about" style={{ color: "#fff" }}>Giới thiệu</NavLink>
            </Menu.Item>
          </Menu>
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
            title="CYBER MOVIE"
            placement="right"
            onClose={() => setMobileMenuOpen(false)}
            open={mobileMenuOpen}
          >
            <Menu mode="vertical" selectedKeys={[window.location.pathname]}>
              <Menu.Item key="/">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link>
              </Menu.Item>
              <Menu.Item key="/list-movie">
                <Link to="/list-movie" onClick={() => setMobileMenuOpen(false)}>Phim</Link>
              </Menu.Item>
              <Menu.Item key="/news">
                <Link to="/news" onClick={() => setMobileMenuOpen(false)}>Tin tức</Link>
              </Menu.Item>
              <Menu.Item key="/about">
                <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Giới thiệu</Link>
              </Menu.Item>
              {!user && (
                <>
                  <Menu.Item key="/login">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <LoginOutlined /> Đăng nhập
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/register">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <UserAddOutlined /> Đăng ký
                    </Link>
                  </Menu.Item>
                </>
              )}
              {user && (
                <Menu.Item key="/profile">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <UserOutlined /> Thông tin cá nhân
                  </Link>
                </Menu.Item>
              )}
            </Menu>
          </Drawer>
        </div>

        {/* Authentication buttons */}
        <div className="auth-buttons" style={{ display: "flex", alignItems: "center" }}>
          {!user ? (
            <Space>
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
            </Space>
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
        </div>
      </div>
    </AntHeader>
  );
}

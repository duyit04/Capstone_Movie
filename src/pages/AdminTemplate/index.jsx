import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  Layout, 
  Menu, 
  Button, 
  theme, 
  Avatar, 
  Dropdown, 
  Space,
  message 
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  TeamOutlined,
  DashboardOutlined,
  LogoutOutlined,
  DownOutlined
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

export default function AdminTemplate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lấy giá trị theme Ant Design
  let colorBgContainer = '#ffffff';
  let borderRadiusLG = '8px';
  
  try {
    const { token = {} } = theme.useToken() || {};
    colorBgContainer = token.colorBgContainer || '#ffffff';
    borderRadiusLG = token.borderRadiusLG || '8px';
  } catch (err) {
    console.error("Theme token error:", err);
    // Sử dụng giá trị mặc định
  }

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập và là admin chưa
    const userInfo = localStorage.getItem("USER_INFO");
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
        
        // Kiểm tra nếu không phải là admin, chuyển về trang chủ
        if (parsedUser.maLoaiNguoiDung !== "QuanTri") {
          message.error("Bạn không có quyền truy cập trang quản trị!");
          navigate("/");
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
        message.error("Thông tin đăng nhập không hợp lệ");
        navigate("/admin/login");
      }
    } else {
      navigate("/admin/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("USER_INFO");
    localStorage.removeItem("ACCESS_TOKEN");
    navigate("/login");
  };

  const userMenu = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="demo-logo-vertical" style={{ height: 64, padding: 16, textAlign: "center" }}>
          <h2 style={{ display: collapsed ? "none" : "block", margin: 0, color: "#1890ff" }}>
            Movie Admin
          </h2>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultSelectedKeys={['/admin']}
          items={[
            {
              key: '/admin',
              icon: <DashboardOutlined />,
              label: <NavLink to="/admin">Dashboard</NavLink>,
            },
            {
              key: '/admin/films',
              icon: <VideoCameraOutlined />,
              label: <NavLink to="/admin/films">Quản lý Phim</NavLink>,
            },
            {
              key: '/admin/add-user',
              icon: <TeamOutlined />,
              label: <NavLink to="/admin/add-user">Quản lý Người dùng</NavLink>,
            },
            {
              key: '/admin/showtimes',
              icon: <CalendarOutlined />,
              label: <NavLink to="/admin/showtimes">Lịch chiếu</NavLink>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div>
              {user && (
                <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                      <span style={{ marginLeft: 8 }}>{user.hoTen || "Admin"}</span>
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              )}
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

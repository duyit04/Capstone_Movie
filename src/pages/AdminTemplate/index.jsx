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
import movieLogo from "../../assets/movie.png";

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
    // Kiểm tra xác thực thực tế từ localStorage
    const checkAuth = () => {
      const userInfo = localStorage.getItem("USER_INFO");
      const accessToken = localStorage.getItem("ACCESS_TOKEN");
      
      if (!userInfo || !accessToken) {
        message.error("Vui lòng đăng nhập để truy cập trang quản trị!");
        navigate("/");
        return;
      }
      
      try {
        const userData = JSON.parse(userInfo);
        
        // Kiểm tra quyền admin
        if (userData.maLoaiNguoiDung !== "QuanTri") {
          message.error("Bạn không có quyền truy cập trang quản trị!");
          navigate("/");
          return;
        }
        
        // Thiết lập user state
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing user info:", error);
        message.error("Thông tin người dùng không hợp lệ!");
        navigate("/");
      }
    };

    // Kiểm tra lần đầu
    checkAuth();

    // Lắng nghe event khi có thay đổi đăng nhập
    const handleUserLoginChange = () => {
      checkAuth();
    };

    window.addEventListener('userLoginChange', handleUserLoginChange);

    // Cleanup event listener
    return () => {
      window.removeEventListener('userLoginChange', handleUserLoginChange);
    };
  }, [navigate]);

  const handleLogout = () => {
    // Xóa tất cả thông tin xác thực
    localStorage.removeItem("USER_INFO");
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER_LOGIN");
    localStorage.removeItem("USER_LOGIN_TOKEN");
    
    // Thông báo cho header biết về thay đổi đăng xuất
    window.dispatchEvent(new Event('userLoginChange'));
    
    message.success("Đăng xuất thành công! Bạn đã được chuyển về trang chủ.");
    navigate("/"); // Chuyển về trang chủ của người dùng
  };

  const userMenu = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate("/admin/profile"),
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

  // Nếu không có user, không hiển thị gì
  if (!user) {
    return null;
  }

  return (
         <Layout style={{ minHeight: "100vh" }}>
              <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed} 
                theme="dark" 
                width={280}
                style={{
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  zIndex: 1000,
                  overflow: 'auto'
                }}
              >
         <div className="demo-logo-vertical" style={{ 
           height: collapsed ? 80 : 100, 
           padding: collapsed ? "16px 12px" : "24px 28px", 
           textAlign: "center",
           borderBottom: "1px solid #434343",
           background: "#001529"
         }}>
           <div style={{
             display: "flex",
             flexDirection: collapsed ? "column" : "row",
             alignItems: "center",
             justifyContent: "center",
             gap: collapsed ? "6px" : "16px"
           }}>
             <img 
               src={movieLogo} 
               alt="Movie Logo" 
               style={{ 
                 width: collapsed ? 44 : 52, 
                 height: collapsed ? 44 : 52, 
                 objectFit: "contain",
                 borderRadius: "14px",
                 boxShadow: "0 6px 16px rgba(255, 255, 255, 0.15)",
                 transition: "all 0.3s ease"
               }} 
             />
                          <h2 style={{ 
                display: collapsed ? "none" : "block", 
                margin: 0, 
                color: "#ffffff", 
                fontSize: "22px", 
                fontWeight: "700",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                letterSpacing: "0.8px"
              }}>
                Movie
              </h2>
           </div>
         </div>
         <Menu
           theme="dark"
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
       <div style={{ width: collapsed ? 80 : 280, flexShrink: 0 }} />
       <Layout style={{ marginLeft: 0 }}>
                  <Header 
                    style={{ 
                      padding: 0, 
                      background: "#001529", 
                      borderBottom: "1px solid #434343", 
                      height: 80,
                      position: 'fixed',
                      top: 0,
                      right: 0,
                      left: collapsed ? 80 : 280,
                      zIndex: 999,
                      transition: 'all 0.2s ease'
                    }}
                  >
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 20, height: '100%' }}>
             <Button
               type="text"
               icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
               onClick={() => setCollapsed(!collapsed)}
               style={{
                 fontSize: '18px',
                 width: 80,
                 height: 80,
                 color: '#ffffff'
               }}
             />
             <div>
               {user && (
                 <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                   <a onClick={(e) => e.preventDefault()}>
                     <Space>
                       <Avatar size={48} style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                       <span style={{ marginLeft: 12, color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>{user.hoTen || "Admin"}</span>
                       <DownOutlined style={{ color: '#ffffff', fontSize: '16px' }} />
                     </Space>
                   </a>
                 </Dropdown>
               )}
             </div>
           </div>
         </Header>
                 <Content
           style={{
             margin: '104px 16px 24px 16px',
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

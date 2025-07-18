import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Layout, BackTop } from "antd";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import "./styles.css";

const { Content } = Layout;

export default function HomeTemplate() {
  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout className="home-layout">
      <Header />
      <Content className="site-content">
        <div className="main-content">
          <Outlet />
        </div>
      </Content>
      <Footer />
      <BackTop />
    </Layout>
  );
}

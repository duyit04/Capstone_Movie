import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Layout, FloatButton } from "antd";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import "./styles.css";

const { Content } = Layout;

export default function HomeTemplate() {
  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, []);

  // Auto-apply dark mode by stored preference or OS preference
  useEffect(() => {
    const root = document.documentElement;
    const apply = (isDark) => {
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    };
    try {
      const stored = localStorage.getItem('THEME');
      if (stored === 'dark' || stored === 'light') {
        apply(stored === 'dark');
        return; // respect user choice; do not subscribe to OS changes
      }
      const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      apply(!!mql?.matches);
      const handler = (e) => apply(e.matches);
      if (mql?.addEventListener) mql.addEventListener('change', handler);
      else if (mql?.addListener) mql.addListener(handler);
      return () => {
        if (mql?.removeEventListener) mql.removeEventListener('change', handler);
        else if (mql?.removeListener) mql.removeListener(handler);
      };
    } catch (_) {}
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
      <FloatButton.BackTop />
    </Layout>
  );
}

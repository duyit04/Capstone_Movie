import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined, PlayCircleOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import "./MobileNav.css";

export default function MobileNav() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Hide on scroll down, show on scroll up
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav 
          className="mobile-bottom-nav"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
        >
          <NavItem 
            to="/" 
            icon={<HomeOutlined />} 
            label="Trang chủ" 
            isActive={location.pathname === "/"} 
          />
          
          <NavItem 
            to="/list-movie" 
            icon={<PlayCircleOutlined />} 
            label="Phim" 
            isActive={location.pathname === "/list-movie"} 
          />
          
          <NavItem 
            to="/news" 
            icon={<BellOutlined />} 
            label="Tin tức" 
            isActive={location.pathname === "/news"} 
          />
          
          <NavItem 
            to="/profile" 
            icon={<UserOutlined />} 
            label="Tài khoản" 
            isActive={location.pathname === "/profile"} 
          />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function NavItem({ to, icon, label, isActive }) {
  return (
    <Link to={to} className={`mobile-nav-item ${isActive ? "active" : ""}`}>
      <motion.div
        whileTap={{ scale: 0.85 }}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {icon}
        <span>{label}</span>
        {isActive && (
          <motion.div 
            className="nav-indicator"
            layoutId="nav-indicator"
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30 
            }}
          />
        )}
      </motion.div>
    </Link>
  );
}

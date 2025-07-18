import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Typography, Space, Divider, Image, Button } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  TwitterOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import api from "../../../../services/api";

const { Title, Text, Paragraph } = Typography;

export default function Footer() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/QuanLyRap/LayThongTinHeThongRap");
      setCinemas(response.data.content);
    } catch (error) {
      console.error("Error fetching cinemas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ backgroundColor: "#032055", color: "#fff", padding: "40px 0 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <Title level={3} style={{ color: "#fff", marginBottom: 20 }}>CYBER MOVIE</Title>
            <Paragraph style={{ color: "#ccc" }}>
              Cyber Movie là hệ thống đặt vé xem phim trực tuyến hàng đầu, cung cấp trải nghiệm đặt vé dễ dàng, nhanh chóng và tiện lợi nhất cho khách hàng.
            </Paragraph>
            <Space size="large">
              <Button type="text" icon={<FacebookOutlined style={{ fontSize: 24, color: "#1877F2" }} />} />
              <Button type="text" icon={<InstagramOutlined style={{ fontSize: 24, color: "#E4405F" }} />} />
              <Button type="text" icon={<YoutubeOutlined style={{ fontSize: 24, color: "#FF0000" }} />} />
              <Button type="text" icon={<TwitterOutlined style={{ fontSize: 24, color: "#1DA1F2" }} />} />
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8}>
            <Title level={4} style={{ color: "#fff", marginBottom: 20 }}>HỆ THỐNG RẠP</Title>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {cinemas.map((cinema) => (
                <div key={cinema.maHeThongRap} style={{ marginBottom: 10 }}>
                  <Image
                    src={cinema.logo}
                    alt={cinema.tenHeThongRap}
                    width={40}
                    height={40}
                    preview={false}
                    style={{ borderRadius: 4, background: "#fff", padding: 4 }}
                  />
                </div>
              ))}
            </div>
            <Divider style={{ borderColor: "rgba(255,255,255,0.1)", margin: "20px 0" }} />
            <Title level={4} style={{ color: "#fff", marginBottom: 20 }}>LIÊN KẾT</Title>
            <Row gutter={[0, 10]}>
              <Col span={12}>
                <Link to="/" style={{ color: "#ccc" }}>Trang chủ</Link>
              </Col>
              <Col span={12}>
                <Link to="/list-movie" style={{ color: "#ccc" }}>Phim</Link>
              </Col>
              <Col span={12}>
                <Link to="/news" style={{ color: "#ccc" }}>Tin tức</Link>
              </Col>
              <Col span={12}>
                <Link to="/about" style={{ color: "#ccc" }}>Giới thiệu</Link>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8}>
            <Title level={4} style={{ color: "#fff", marginBottom: 20 }}>LIÊN HỆ</Title>
            <Space direction="vertical" size="middle">
              <Space>
                <HomeOutlined style={{ color: "#1890ff" }} />
                <Text style={{ color: "#ccc" }}>112 Cao Thắng, Quận 3, TP.HCM</Text>
              </Space>
              <Space>
                <PhoneOutlined style={{ color: "#1890ff" }} />
                <Text style={{ color: "#ccc" }}>Hotline: 1900 1234</Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: "#1890ff" }} />
                <Text style={{ color: "#ccc" }}>support@cybermovie.vn</Text>
              </Space>
            </Space>
          </Col>
        </Row>
        
        <Divider style={{ borderColor: "rgba(255,255,255,0.1)", margin: "30px 0 20px" }} />
        
        <div style={{ textAlign: "center" }}>
          <Text style={{ color: "#ccc" }}>
            &copy; {new Date().getFullYear()} Cyber Movie. Tất cả các quyền được bảo lưu.
          </Text>
        </div>
      </div>
    </footer>
  );
}

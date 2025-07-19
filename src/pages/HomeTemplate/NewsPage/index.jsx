import { useState, useEffect } from "react";
import { Row, Col, Card, Spin, Pagination } from "antd";
import { CalendarOutlined, FireOutlined, LikeOutlined, CommentOutlined } from "@ant-design/icons";
import "./styles.css";

export default function NewsPage() {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Dữ liệu tin tức mẫu
  const newsData = [
    {
      id: 1,
      title: "Avengers 5 tiết lộ tên chính thức và dàn diễn viên mới",
      date: "19/07/2025",
      author: "Minh Đức",
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1000",
      summary: "Marvel Studios xác nhận tên chính thức cho Avengers 5 là 'The New Avengers' với dàn diễn viên mới sẽ tham gia vào vũ trụ điện ảnh Marvel. Phim dự kiến khởi chiếu vào năm 2026.",
      hot: true,
      likes: 1456,
      comments: 235,
      category: "Tin điện ảnh"
    },
    {
      id: 2,
      title: "Christopher Nolan công bố dự án phim khoa học viễn tưởng mới",
      date: "15/07/2025",
      author: "Thanh Hà",
      image: "https://images.unsplash.com/photo-1611890798517-07b0fcb4a811?q=80&w=1000", 
      summary: "Sau thành công vang dội của Oppenheimer, đạo diễn Christopher Nolan đã xác nhận dự án tiếp theo của ông sẽ là một bộ phim khoa học viễn tưởng quy mô lớn với kinh phí hơn 300 triệu đô.",
      hot: true,
      likes: 987,
      comments: 143,
      category: "Đạo diễn & Nhà sản xuất"
    },
    {
      id: 3,
      title: "CGV Việt Nam mở rộng hệ thống rạp chiếu trên toàn quốc",
      date: "10/07/2025",
      author: "Minh Anh",
      image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=1000",
      summary: "CGV Việt Nam thông báo kế hoạch mở rộng thêm 20 cụm rạp mới tại các tỉnh thành trên cả nước trong năm 2025-2026, nâng tổng số cụm rạp lên hơn 100 địa điểm.",
      hot: false,
      likes: 567,
      comments: 78,
      category: "Rạp chiếu & Phát hành"
    },
    {
      id: 4,
      title: "Disney xác nhận phần tiếp theo của 'Inside Out 2'",
      date: "08/07/2025",
      author: "Hải Nam",
      image: "https://images.unsplash.com/photo-1608889825271-9696283ab804?q=80&w=1000",
      summary: "Sau thành công vang dội của Inside Out 2 với doanh thu hơn 1 tỷ USD toàn cầu, Disney và Pixar đã xác nhận sẽ sản xuất phần tiếp theo, dự kiến ra mắt vào năm 2027.",
      hot: true,
      likes: 1245,
      comments: 186,
      category: "Phim hoạt hình"
    },
    {
      id: 5,
      title: "Liên hoan phim Cannes 2025 công bố danh sách ban giám khảo",
      date: "05/07/2025",
      author: "Quỳnh Chi",
      image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000",
      summary: "Liên hoan phim Cannes lần thứ 78 vừa công bố danh sách ban giám khảo với chủ tịch là đạo diễn từng đoạt giải Oscar. Sự kiện điện ảnh danh giá này sẽ diễn ra từ ngày 13 đến 24/5/2025.",
      hot: false,
      likes: 432,
      comments: 56,
      category: "Liên hoan phim"
    },
    {
      id: 6,
      title: "Dự án phim Việt Nam được đề cử tại Liên hoan phim Quốc tế Berlin",
      date: "02/07/2025",
      author: "Ngọc Trâm",
      image: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=1000",
      summary: "Một dự án phim độc lập của Việt Nam đã lọt vào danh sách đề cử chính thức tại Liên hoan phim Quốc tế Berlin 2025. Đây là lần hiếm hoi điện ảnh Việt có mặt trong sự kiện quốc tế danh giá này.",
      hot: true,
      likes: 876,
      comments: 132,
      category: "Điện ảnh Việt Nam"
    },
    {
      id: 7,
      title: "Công nghệ chiếu phim mới được áp dụng tại các rạp chiếu Việt Nam",
      date: "28/06/2025",
      author: "Văn Hùng",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000",
      summary: "Các hệ thống rạp chiếu lớn tại Việt Nam bắt đầu áp dụng công nghệ chiếu phim hiện đại IMAX với Laser và màn hình LED Cinema, mang đến trải nghiệm xem phim chất lượng cao hơn cho khán giả.",
      hot: false,
      likes: 543,
      comments: 67,
      category: "Công nghệ điện ảnh"
    },
    {
      id: 8,
      title: "Nữ đạo diễn trẻ Việt Nam thắng giải tại Liên hoan phim Châu Á",
      date: "25/06/2025",
      author: "Thảo Nguyên",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000",
      summary: "Nữ đạo diễn trẻ người Việt đã giành giải Đạo diễn xuất sắc nhất tại Liên hoan phim Châu Á 2025 với tác phẩm đầu tay của mình, đánh dấu bước tiến quan trọng cho điện ảnh Việt trên trường quốc tế.",
      hot: true,
      likes: 965,
      comments: 143,
      category: "Điện ảnh Việt Nam"
    }
  ];

  // Xử lý phân trang
  const pageSize = 6;
  const totalItems = newsData.length;
  const currentItems = newsData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Effect mô phỏng tải dữ liệu
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <div className="news-container">
      <div className="banner">
        <div className="banner-content">
          <h1>Tin tức điện ảnh</h1>
          <p>Cập nhật những tin tức mới nhất về điện ảnh trong nước và quốc tế</p>
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">
          <FireOutlined /> Tin nổi bật
        </h2>
        
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {newsData.filter(item => item.hot).slice(0, 3).map(news => (
                <Col key={news.id} xs={24} md={8}>
                  <Card 
                    hoverable 
                    className="news-card hot-news"
                    cover={<img 
                      alt={news.title} 
                      src={news.image} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x200?text=Movie+News";
                      }}
                    />}
                  >
                    <div className="card-badge">Hot</div>
                    <div className="card-category">{news.category}</div>
                    <h3>{news.title}</h3>
                    <div className="card-meta">
                      <span><CalendarOutlined /> {news.date}</span>
                      <span>{news.author}</span>
                    </div>
                    <p>{news.summary}</p>
                    <div className="card-actions">
                      <span><LikeOutlined /> {news.likes}</span>
                      <span><CommentOutlined /> {news.comments}</span>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <h2 className="section-title mt-4">Tin mới nhất</h2>
            <Row gutter={[24, 24]}>
              {currentItems.map(news => (
                <Col key={news.id} xs={24} sm={12} lg={8}>
                  <Card 
                    hoverable 
                    className="news-card"
                    cover={<img 
                      alt={news.title} 
                      src={news.image} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x200?text=Movie+News";
                      }}
                    />}
                  >
                    <div className="card-category">{news.category}</div>
                    <h3>{news.title}</h3>
                    <div className="card-meta">
                      <span><CalendarOutlined /> {news.date}</span>
                      <span>{news.author}</span>
                    </div>
                    <p>{news.summary}</p>
                    <div className="card-actions">
                      <span><LikeOutlined /> {news.likes}</span>
                      <span><CommentOutlined /> {news.comments}</span>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="pagination-container">
              <Pagination 
                current={currentPage}
                total={totalItems}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

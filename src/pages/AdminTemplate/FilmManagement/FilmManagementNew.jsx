import { useState, useEffect } from "react";
import { Table, Button, Input, Space, Popconfirm, App, Modal, Form, Select, Tag, Tooltip, Progress, Card, Row, Col, Statistic, Typography } from "antd";
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined, DownloadOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./styles.css";

const { Search } = Input;
const { Title } = Typography;

const FilmManagementNew = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const response = await api.get("/QuanLyPhim/LayDanhSachPhim");
      setFilms(response.data.content || []);
    } catch (error) {
      const errorMessage = error.response?.data?.content || error.response?.data?.message || "Không thể tải danh sách phim";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (maPhim) => {
    try {
      await api.delete(`/QuanLyPhim/XoaPhim?MaPhim=${maPhim}`);
      message.success("Xóa phim thành công");
      fetchFilms();
    } catch (error) {
      const errorMessage = error.response?.data?.content || error.response?.data?.message || "Không thể xóa phim";
      message.error(errorMessage);
    }
  };

  const columns = [
    {
      title: "Mã phim",
      dataIndex: "maPhim",
      key: "maPhim",
      width: 120,
      render: (text) => (
        <span style={{ 
          fontWeight: '600', 
          color: '#1890ff',
          fontSize: '14px',
          fontFamily: 'monospace',
          backgroundColor: '#f0f8ff',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          #{text}
        </span>
      )
    },
    {
      title: "Tên phim",
      dataIndex: "tenPhim",
      key: "tenPhim",
      render: (text) => (
        <span style={{ 
          fontWeight: '600', 
          color: '#1f1f1f',
          fontSize: '15px'
        }}>
          {text}
        </span>
      )
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      width: 120,
      render: (hinhAnh, record) => (
        <div style={{ textAlign: 'center' }}>
          <img 
            src={hinhAnh} 
            alt={record.tenPhim} 
            style={{ 
              width: 80, 
              height: 120, 
              objectFit: 'cover',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '3px solid #f0f0f0',
              transition: 'all 0.3s ease'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/80x120/cccccc/666666?text=No+Image';
            }}
          />
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/film/edit/${record.maPhim}`)}
            style={{
              borderRadius: '8px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa phim này?"
            onConfirm={() => handleDelete(record.maPhim)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
              style={{
                borderRadius: '8px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(255, 77, 79, 0.3)'
              }}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredFilms = films.filter((film) =>
    film.tenPhim?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="film-management-container">
      <div className="film-management-header">
        <Title level={2} style={{ 
          color: '#1f1f1f', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <VideoCameraOutlined style={{ color: '#1890ff', fontSize: '32px' }} />
          Quản lý phim
        </Title>
        <div className="film-stats">
          <span className="stat-item">
            <strong>{films.length}</strong> phim
          </span>
          <span className="stat-item">
            <strong>{filteredFilms.length}</strong> kết quả
          </span>
        </div>
      </div>

      <Card className="film-management-card">
        <Row gutter={[24, 16]} className="search-section">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm phim..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
              className="film-search"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/film/add")}
              size="large"
              className="add-film-btn"
            >
              Thêm phim mới
            </Button>
          </Col>
        </Row>
        
        <div className="film-table-container">
          <Table
            columns={columns}
            dataSource={filteredFilms}
            loading={loading}
            rowKey="maPhim"
            className="film-table"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phim`,
            }}
            style={{
              borderRadius: '16px',
              overflow: 'hidden'
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default FilmManagementNew;

import { Table, Button, Input, Space, Popconfirm, App, Modal, Form, Select, Tag, Tooltip, Progress } from "antd";
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined, DownloadOutlined, UserAddOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../../services/api";
import "./enhanced-table.css";

const { Search } = Input;
const { Option } = Select;

export default function AddUserPageNew() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [userTypes, setUserTypes] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [pwdStrength, setPwdStrength] = useState(0);

  // derived counts
  const totalAdmins = users.filter(u => u.maLoaiNguoiDung === 'QuanTri').length;
  const totalCustomers = users.filter(u => u.maLoaiNguoiDung !== 'QuanTri').length;

  useEffect(() => {
    fetchUsers();
    fetchUserTypes();
  }, []);

  const fetchUsers = async (keyword = "", role = roleFilter) => {
    try {
      setLoading(true);
      const url = keyword
        ? `/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01&tuKhoa=${keyword}`
        : "/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01";
      const response = await api.get(url);
      let list = response.data.content;
      if (role) list = list.filter(u => u.maLoaiNguoiDung === role);
      setUsers(list);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTypes = async () => {
    try {
      const response = await api.get("/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung");
      setUserTypes(response.data.content);
    } catch (error) {
      console.error("Lỗi khi tải danh sách loại người dùng:", error);
    }
  };

  const handleSearch = () => { fetchUsers(searchText, roleFilter); };

  // simple debounce for search input
  useEffect(()=> {
    const t = setTimeout(()=> { if (searchText || searchText==='') handleSearch(); }, 450); 
    return ()=> clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, roleFilter]);

  const handleAddUser = () => {
    setEditingUser(null);
    setTimeout(() => {
      form.setFieldsValue({
        taiKhoan: '',
        hoTen: '',
        email: '',
        soDt: '',
        maLoaiNguoiDung: userTypes.length > 0 ? userTypes[0].maLoaiNguoiDung : '',
        matKhau: '',
      });
    }, 100);
    setPwdStrength(0);
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    // Đặt các giá trị mặc định trong form sau khi modal hiển thị
    setTimeout(() => {
      form.setFieldsValue({
        taiKhoan: user.taiKhoan,
        hoTen: user.hoTen,
        email: user.email,
        soDt: user.soDt,
        maLoaiNguoiDung: user.maLoaiNguoiDung,
        matKhau: "", // Để trống, chỉ nhập khi muốn đổi
      });
    }, 100);
    setPwdStrength(0);
    setModalVisible(true);
  };

  const handleDeleteUser = async (taiKhoan) => {
    try {
      await api.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`);
      message.success("Xóa người dùng thành công");
      fetchUsers(searchText);
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      message.error("Không thể xóa người dùng");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // Nếu không nhập mật khẩu mới thì bỏ field này đi
        const payload = { ...values, maNhom: "GP01" };
        if (!payload.matKhau) delete payload.matKhau;
        await api.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", payload);
        message.success("Cập nhật người dùng thành công");
      } else {
        // Thêm mới
        await api.post("/QuanLyNguoiDung/ThemNguoiDung", {
          ...values,
          maNhom: "GP01",
        });
        message.success("Thêm người dùng thành công");
      }
      setModalVisible(false);
      fetchUsers(searchText);
    } catch (error) {
      console.error("Lỗi khi lưu thông tin người dùng:", error);
      message.error("Không thể lưu thông tin người dùng");
    }
  };

  const exportCSV = () => {
    if(!users.length) { 
      message.info('Không có dữ liệu để xuất'); 
      return; 
    }
    const header = ['TaiKhoan','HoTen','Email','SoDt','Loai'];
    const rows = users.map(u => [u.taiKhoan,u.hoTen,u.email,u.soDt,u.maLoaiNguoiDung].map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','));
    const blob = new Blob([header.join(',')+'\n'+rows.join('\n')], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'users.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const calcStrength = (val='') => {
    let score=0; 
    if(val.length>=6) score+=30; 
    if(/[A-Z]/.test(val)) score+=20; 
    if(/[0-9]/.test(val)) score+=20; 
    if(/[^A-Za-z0-9]/.test(val)) score+=30; 
    if(score>100) score=100; 
    setPwdStrength(score); 
  };

  const columns = [
    {
      title: "Tài khoản",
      dataIndex: "taiKhoan",
      key: "taiKhoan",
      width: 150,
      sorter: (a, b) => a.taiKhoan.localeCompare(b.taiKhoan),
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      key: "hoTen",
      width: 200,
      sorter: (a, b) => a.hoTen.localeCompare(b.hoTen),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "soDt",
      key: "soDt",
      width: 150,
    },
    {
      title: "Loại người dùng",
      dataIndex: "maLoaiNguoiDung",
      key: "maLoaiNguoiDung",
      width: 150,
      render: (type) => (
        <span className={`dashkit-badge ${type === 'QuanTri' ? 'dashkit-badge-primary' : 'dashkit-badge-success'}`}>
          {type === 'QuanTri' ? 'Quản trị' : 'Khách hàng'}
        </span>
      )
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            size="small"
            style={{ background: "var(--dashkit-secondary)", borderColor: "var(--dashkit-secondary)", color: "white" }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record.taiKhoan)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div style={{padding: "20px"}}>
        <div className="dashkit-stat-row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dashkit-card" style={{padding: "20px"}}>
              <div style={{borderBottom: 'none'}}>
                <Space>
                  <Progress type="circle" percent={0} size={40} />
                  <div>
                    <h4 style={{margin: 0}}>Đang tải dữ liệu...</h4>
                    <span style={{fontSize: '12px'}}>Vui lòng đợi</span>
                  </div>
                </Space>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <h2 style={{margin: "0", fontSize: "24px", fontWeight: "600"}}>Quản lý Người dùng</h2>
          <p style={{margin: "5px 0 0", color: "var(--dashkit-text-muted)"}}>
            Quản trị tài khoản & phân quyền
          </p>
        </div>
        <Button
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddUser}
          style={{background: "var(--dashkit-primary)", borderColor: "var(--dashkit-primary)"}}
        >
          Thêm người dùng
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="dashkit-stat-row">
        <div className="dashkit-stat-card dashkit-stat-info">
          <div className="dashkit-stat-icon">
            <UnorderedListOutlined />
          </div>
          <div className="dashkit-stat-content">
            <h3 className="dashkit-stat-value">{users.length}</h3>
            <p className="dashkit-stat-label">Tổng người dùng</p>
          </div>
        </div>
        
        <div className="dashkit-stat-card dashkit-stat-primary">
          <div className="dashkit-stat-icon">
            <UsergroupAddOutlined />
          </div>
          <div className="dashkit-stat-content">
            <h3 className="dashkit-stat-value">{totalAdmins}</h3>
            <p className="dashkit-stat-label">Quản trị viên</p>
          </div>
        </div>
        
        <div className="dashkit-stat-card dashkit-stat-success">
          <div className="dashkit-stat-icon">
            <UserOutlined />
          </div>
          <div className="dashkit-stat-content">
            <h3 className="dashkit-stat-value">{totalCustomers}</h3>
            <p className="dashkit-stat-label">Khách hàng</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Card */}
      <div className="dashkit-card" style={{marginBottom: "24px"}}>
        <div className="dashkit-card-body">
          <div style={{display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center"}}>
            <div style={{flex: "1", minWidth: "250px", maxWidth: "400px"}}>
              <Input
                placeholder="Tìm kiếm tài khoản / họ tên"
                prefix={<SearchOutlined style={{color: "var(--dashkit-text-muted)"}} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{width: "100%"}}
              />
            </div>
            <Select
              placeholder="Lọc loại người dùng"
              value={roleFilter || undefined}
              onChange={(v) => setRoleFilter(v || '')}
              allowClear
              style={{width: "200px"}}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="QuanTri">
                <Space>
                  <UsergroupAddOutlined style={{color: "var(--dashkit-primary)"}} />
                  Quản trị viên
                </Space>
              </Option>
              <Option value="KhachHang">
                <Space>
                  <UserOutlined style={{color: "var(--dashkit-success)"}} />
                  Khách hàng
                </Space>
              </Option>
            </Select>
            <div style={{display: "flex", gap: "8px"}}>
              <Tooltip title="Làm mới dữ liệu">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchUsers(searchText, roleFilter)}
                />
              </Tooltip>
              <Tooltip title="Xuất danh sách CSV">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={exportCSV}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="dashkit-card">
        <div className="dashkit-card-header">
          <h3 className="dashkit-card-title">Danh sách người dùng</h3>
          <span className="dashkit-badge dashkit-badge-primary">{users.length} người dùng</span>
        </div>
        <div className="dashkit-card-body" style={{padding: "0"}}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="taiKhoan"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total) => `Tổng cộng ${total} người dùng`,
            }}
            style={{margin: "0"}}
            className="dashkit-table"
            scroll={{ x: 900 }}
          />
        </div>
      </div>

      {/* User Modal */}
      <Modal
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        open={modalVisible}
        onOk={handleModalOk}
        destroyOnClose={true}
        onCancel={() => {
          setModalVisible(false);
          setPwdStrength(0);
        }}
        okText={editingUser ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        okButtonProps={{
          style: { background: "var(--dashkit-primary)", borderColor: "var(--dashkit-primary)" },
        }}
      >
        <Form 
          form={form} 
          layout="vertical" 
          preserve={false}
        >
          <Form.Item
            name="taiKhoan"
            label="Tài khoản"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
          >
            <Input disabled={editingUser} />
          </Form.Item>

          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            rules={
              editingUser
                ? []
                : [{ required: true, message: "Vui lòng nhập mật khẩu!" }]
            }
          >
            <Input.Password 
              placeholder={editingUser ? "Để trống nếu không đổi" : ""} 
              onChange={(e) => calcStrength(e.target.value)}
            />
          </Form.Item>
          
          {pwdStrength > 0 && (
            <div style={{marginTop: "-15px", marginBottom: "15px"}}>
              <Progress 
                percent={pwdStrength} 
                showInfo={false} 
                strokeColor={
                  pwdStrength < 40 ? 'var(--dashkit-danger)' : 
                  pwdStrength < 70 ? 'var(--dashkit-warning)' : 
                  'var(--dashkit-success)'
                } 
                size="small" 
              />
              <div style={{fontSize: "11px", color: "var(--dashkit-text-muted)", textAlign: "right"}}>
                {pwdStrength < 40 ? 'Yếu' : pwdStrength < 70 ? 'Trung bình' : 'Mạnh'}
              </div>
            </div>
          )}

          <Form.Item
            name="hoTen"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="soDt"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="maLoaiNguoiDung"
            label="Loại người dùng"
            rules={[{ required: true, message: "Vui lòng chọn loại người dùng!" }]}
          >
            <Select>
              {userTypes.map((type) => (
                <Option key={type.maLoaiNguoiDung} value={type.maLoaiNguoiDung}>
                  {type.tenLoai}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

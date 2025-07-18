import { useState, useEffect } from "react";
import { Table, Button, Input, Space, Popconfirm, message, Modal, Form, Select } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../../services/api";

const { Option } = Select;

export default function AddUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [userTypes, setUserTypes] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchUserTypes();
  }, []);

  const fetchUsers = async (keyword = "") => {
    try {
      setLoading(true);
      const url = keyword 
        ? `/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01&tuKhoa=${keyword}`
        : "/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01";

      const response = await api.get(url);
      setUsers(response.data.content);
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

  const handleSearch = () => {
    fetchUsers(searchText);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      taiKhoan: user.taiKhoan,
      hoTen: user.hoTen,
      email: user.email,
      soDt: user.soDt,
      maLoaiNguoiDung: user.maLoaiNguoiDung,
      matKhau: "********", // Mật khẩu không được gửi từ API, sử dụng placeholder
    });
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
        // Cập nhật người dùng
        await api.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", {
          ...values,
          maNhom: "GP01",
        });
        message.success("Cập nhật người dùng thành công");
      } else {
        // Thêm người dùng mới
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

  const columns = [
    {
      title: "Tài khoản",
      dataIndex: "taiKhoan",
      key: "taiKhoan",
      width: 150,
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      key: "hoTen",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      render: (type) => (type === "QuanTri" ? "Quản trị" : "Khách hàng"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record.taiKhoan)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Quản lý Người dùng</h1>
      
      <div style={{ marginBottom: 16, display: "flex" }}>
        <Space>
          <Input
            placeholder="Tìm kiếm theo tài khoản hoặc họ tên"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
          style={{ marginLeft: "auto" }}
        >
          Thêm người dùng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="taiKhoan"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText={editingUser ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
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
            rules={[{ required: !editingUser, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

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
              {userTypes.map(type => (
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

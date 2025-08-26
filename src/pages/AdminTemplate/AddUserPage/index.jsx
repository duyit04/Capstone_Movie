import { useState, useEffect } from "react";
import { Table, Button, Input, Space, Popconfirm, message, Modal, Form, Select, notification } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../../../services/api";
import { DEFAULT_GROUP_CODE } from "../../../config/constants";

const { Option } = Select;

export default function AddUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [userTypes, setUserTypes] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Thiết lập notification cho toàn bộ component
  const [notificationApi, contextHolder] = notification.useNotification();

  // Hàm xử lý lỗi chung
  const handleError = (error, action = "thực hiện hành động") => {
    // Đóng tất cả loading message
    message.destroy();
    
    if (error.response) {
      // Lỗi từ server
      const status = error.response.status;
      const errorData = error.response.data;
      // Cố gắng lấy message lỗi từ nhiều định dạng response khác nhau
      const errorMessage = 
        errorData?.content || 
        errorData?.message || 
        errorData?.error || 
        (typeof errorData === 'string' ? errorData : 'Lỗi không xác định');
      
      console.log('📊 Chi tiết lỗi server:', {
        status: status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Hiển thị thông báo lỗi dạng notification
      notificationApi.error({
        message: `Lỗi ${status}: Không thể ${action}`,
        description: errorMessage,
        placement: 'topRight',
        duration: 10,
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      });
      
      // Hiển thị modal thông báo lỗi chi tiết
      Modal.error({
        title: `Không thể ${action}`,
        content: (
          <div>
            <p><strong>Mã lỗi:</strong> {status}</p>
            <p><strong>Chi tiết:</strong> {errorMessage}</p>
            {status === 409 && <p><strong>Lưu ý:</strong> Tài khoản hoặc email có thể đã tồn tại trong hệ thống.</p>}
            {status === 500 && <p><strong>Lưu ý:</strong> Có lỗi xảy ra ở máy chủ. Vui lòng thử lại sau.</p>}
          </div>
        ),
      });
      
      // Hiển thị thông báo dạng message
      if (status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else if (status === 403) {
        message.error("Bạn không có quyền thực hiện thao tác này!");
      } else if (status === 400) {
        message.error(errorMessage);
      } else if (status === 409) {
        message.error("Tài khoản đã tồn tại hoặc email đã được sử dụng!");
      } else if (status === 500) {
        message.error(errorMessage);
      } else {
        message.error(errorMessage);
      }
    } else if (error.request) {
      // Lỗi network
      console.log('🌐 Lỗi network:', error.request);
      
      // Hiển thị thông báo lỗi kết nối dạng notification
      notificationApi.error({
        message: 'Lỗi kết nối',
        description: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.',
        placement: 'topRight',
        duration: 10,
        icon: <WarningOutlined style={{ color: '#faad14' }} />
      });
      
      // Hiển thị modal thông báo lỗi kết nối
      Modal.error({
        title: 'Lỗi kết nối mạng',
        content: (
          <div>
            <p>Không thể kết nối đến máy chủ.</p>
            <p>Vui lòng kiểm tra:</p>
            <ul>
              <li>Kết nối internet của bạn</li>
              <li>Tường lửa hoặc proxy</li>
              <li>Máy chủ có thể đang bảo trì</li>
            </ul>
          </div>
        ),
      });
      
      message.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!");
    } else {
      // Lỗi khác
      console.log('❓ Lỗi không xác định:', error.message);
      
      // Hiển thị thông báo lỗi không xác định dạng notification
      notificationApi.error({
        message: 'Lỗi không xác định',
        description: error.message || 'Đã xảy ra lỗi không xác định khi xử lý yêu cầu.',
        placement: 'topRight',
        duration: 10,
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      });
      
      // Hiển thị modal thông báo lỗi không xác định
      Modal.error({
        title: 'Lỗi không xác định',
        content: (
          <div>
            <p>Đã xảy ra lỗi không xác định: {error.message || 'Không có thông tin chi tiết.'}</p>
            <p>Vui lòng thử lại sau hoặc liên hệ quản trị viên nếu lỗi vẫn tiếp tục.</p>
          </div>
        ),
      });
      
      message.error(error.message || "Lỗi không xác định");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserTypes();
    
    // Thêm event listener để lắng nghe khi quay lại từ trang khác
    const handleFocus = () => {
      console.log('🔄 Trang được focus lại, refresh danh sách người dùng...');
      fetchUsers();
    };
    
    // Thêm event listener để lắng nghe khi quay lại từ trang khác
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Trang được hiển thị lại, refresh danh sách người dùng...');
        fetchUsers();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchUsers = async (keyword = "") => {
    try {
      setLoading(true);
      const url = keyword 
        ? `/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${DEFAULT_GROUP_CODE}&tuKhoa=${keyword}`
        : `/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${DEFAULT_GROUP_CODE}`;

      console.log('🔄 Gọi API lấy danh sách người dùng:', url);
      const response = await api.get(url);
      
      console.log('✅ API lấy danh sách người dùng thành công:', response.data);
      
      // Kiểm tra cấu trúc dữ liệu trả về
      if (response.data && response.data.content) {
        console.log('📊 Cấu trúc dữ liệu người dùng đầu tiên:', response.data.content[0]);
        console.log('🔍 Các trường có sẵn:', Object.keys(response.data.content[0] || {}));
        
        // Kiểm tra trường soDt/soDT (API có thể trả về cả hai)
        const usersWithSdt = response.data.content.filter(user => user.soDt || user.soDT);
        const usersWithoutSdt = response.data.content.filter(user => !user.soDt && !user.soDT);
        
        console.log('📱 Người dùng có số điện thoại:', usersWithSdt.length);
        console.log('❌ Người dùng không có số điện thoại:', usersWithoutSdt.length);
        
        if (usersWithoutSdt.length > 0) {
          console.log('⚠️ Người dùng thiếu số điện thoại:', usersWithoutSdt.map(u => ({ taiKhoan: u.taiKhoan, hoTen: u.hoTen })));
        }
        
        // Chuẩn hóa dữ liệu để có trường soDt nhất quán
        const normalizedUsers = response.data.content.map(user => ({
          ...user,
          soDt: user.soDt || user.soDT || '' // Ưu tiên soDt, nếu không có thì dùng soDT
        }));
        
        // Sắp xếp người dùng mới nhất lên đầu (ưu tiên người dùng mới thêm)
        const sortedUsers = normalizedUsers.sort((a, b) => {
          // Ưu tiên 1: Sắp xếp theo thời gian tạo (người dùng mới nhất lên đầu)
          // Sử dụng taiKhoan để ước tính thứ tự thời gian
          if (a.taiKhoan && b.taiKhoan) {
            // Thử so sánh theo số nếu taiKhoan có dạng số
            const aNum = parseInt(a.taiKhoan);
            const bNum = parseInt(b.taiKhoan);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
              // Nếu cả hai đều là số, sắp xếp theo thứ tự giảm dần (số lớn hơn = mới hơn)
              return bNum - aNum;
            } else {
              // Nếu không phải số, sắp xếp theo thứ tự alphabet ngược (Z->A)
              // Giả định tài khoản mới hơn có thứ tự alphabet cao hơn
              return b.taiKhoan.localeCompare(a.taiKhoan);
            }
          }
          
          // Ưu tiên 2: Nếu taiKhoan bằng nhau hoặc không có, sắp xếp theo hoTen
          if (a.hoTen && b.hoTen) {
            return a.hoTen.localeCompare(b.hoTen);
          }
          
          return 0;
        });
        
        // Debug log để kiểm tra thứ tự sắp xếp
        console.log('📋 Danh sách người dùng sau khi sắp xếp (người dùng mới nhất lên đầu):', 
          sortedUsers.slice(0, 5).map(u => ({ 
            taiKhoan: u.taiKhoan, 
            hoTen: u.hoTen,
            email: u.email,
            order: 'Mới nhất' // Đánh dấu người dùng mới nhất
          }))
        );
        
        // Log thông tin về logic sắp xếp
        console.log('🔄 Logic sắp xếp: Người dùng mới nhất sẽ hiển thị ở đầu danh sách');
        console.log('📊 Tổng số người dùng:', sortedUsers.length);
        console.log('🥇 Người dùng đầu tiên (mới nhất):', sortedUsers[0]?.taiKhoan);
        console.log('🥈 Người dùng thứ hai:', sortedUsers[1]?.taiKhoan);
        
        setUsers(sortedUsers);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách người dùng:", error);
      
      // Sử dụng hàm xử lý lỗi chung
      handleError(error, "tải danh sách người dùng");
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
      handleError(error, "tải danh sách loại người dùng");
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      message.info('Vui lòng nhập từ khóa tìm kiếm!');
      return;
    }
    
    message.loading({
      content: `Đang tìm kiếm người dùng với từ khóa "${searchText}"...`,
      duration: 0,
      key: 'searchUsers'
    });
    
    fetchUsers(searchText).then(() => {
      message.destroy('searchUsers');
      const resultCount = users.filter(user => 
        user.taiKhoan.toLowerCase().includes(searchText.toLowerCase()) ||
        user.hoTen.toLowerCase().includes(searchText.toLowerCase())
      ).length;
      
      if (resultCount > 0) {
        message.success({
          content: `🔍 Tìm thấy ${resultCount} người dùng với từ khóa "${searchText}"`,
          duration: 3,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
        });
        notificationApi.success({
          message: 'Tìm kiếm thành công',
          description: `Tìm thấy ${resultCount} người dùng phù hợp với từ khóa "${searchText}".`,
          placement: 'topRight',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          duration: 5
        });
      } else {
        message.warning({
          content: `🔍 Không tìm thấy người dùng nào với từ khóa "${searchText}"`,
          duration: 3,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
        });
        notificationApi.warning({
          message: 'Không tìm thấy kết quả',
          description: `Không có người dùng nào phù hợp với từ khóa "${searchText}".`,
          placement: 'topRight',
          icon: <WarningOutlined style={{ color: '#faad14' }} />,
          duration: 5
        });
      }
    }).catch((error) => {
      message.destroy('searchUsers');
      message.error('Không thể thực hiện tìm kiếm!');
      console.error('❌ Lỗi khi tìm kiếm:', error);
    });
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
      soDt: user.soDt || user.soDT || '', // Xử lý cả hai trường
      maLoaiNguoiDung: user.maLoaiNguoiDung,
      matKhau: "********", // Mật khẩu không được gửi từ API, sử dụng placeholder
    });
    setModalVisible(true);
  };

  const handleDeleteUser = async (taiKhoan) => {
    // Khai báo biến ở phạm vi function để có thể sử dụng trong catch
    let userToDelete = null;
    let userFullName = taiKhoan;
    
    try {
      console.log('🔄 Bắt đầu xóa người dùng:', taiKhoan);
      
      // Kiểm tra quyền admin
      const currentUser = localStorage.getItem("USER_INFO") || localStorage.getItem("USER_LOGIN");
      if (!currentUser) {
        message.error("Không tìm thấy thông tin đăng nhập!");
        console.log('❌ Không tìm thấy thông tin đăng nhập');
        return;
      }
      
      const currentUserInfo = JSON.parse(currentUser);
      console.log('👤 Người dùng hiện tại:', currentUserInfo);
      
             // Kiểm tra quyền admin - sử dụng đúng mã "QuanTri"
       if (currentUserInfo.maLoaiNguoiDung !== "QuanTri") {
         message.error("Bạn không có quyền xóa người dùng!");
         console.log('❌ Không có quyền admin, maLoaiNguoiDung:', currentUserInfo.maLoaiNguoiDung);
         return;
       }
      
      // Kiểm tra xem có phải người dùng đang đăng nhập không
      if (currentUserInfo.taiKhoan === taiKhoan) {
        message.error("Không thể xóa tài khoản đang đăng nhập!");
        console.log('❌ Không thể xóa tài khoản đang đăng nhập');
        return;
      }
      
      // Tìm thông tin người dùng trước khi xóa để hiển thị họ tên
      userToDelete = users.find(user => user.taiKhoan === taiKhoan);
      userFullName = userToDelete ? userToDelete.hoTen : taiKhoan;
      
      console.log('🎯 Người dùng cần xóa:', {
        taiKhoan: taiKhoan,
        hoTen: userFullName,
        email: userToDelete?.email,
        soDt: userToDelete?.soDt || userToDelete?.soDT,
        maLoaiNguoiDung: userToDelete?.maLoaiNguoiDung,
        coTonTai: !!userToDelete,
        danhSachUsers: users.map(u => ({ taiKhoan: u.taiKhoan, hoTen: u.hoTen }))
      });
      
      if (!userToDelete) {
        message.error("Không tìm thấy thông tin người dùng để xóa!");
        console.log('❌ Không tìm thấy thông tin người dùng');
        return;
      }
      
             // Kiểm tra xem có phải admin không - sử dụng đúng mã "QuanTri"
       if (userToDelete.maLoaiNguoiDung === "QuanTri") {
         message.warning("Cẩn thận! Bạn đang xóa một tài khoản quản trị!");
         console.log('⚠️ Cảnh báo: Đang xóa tài khoản quản trị, maLoaiNguoiDung:', userToDelete.maLoaiNguoiDung);
       }
      
      // Kiểm tra token xác thực
      const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("accessToken");
      if (!token) {
        message.error("Không tìm thấy token xác thực!");
        console.log('❌ Không tìm thấy token xác thực');
        return;
      }
      
      console.log('🔑 Token xác thực:', token.substring(0, 20) + '...');
      
      // Hiển thị loading
      message.loading({
        content: `Đang xóa người dùng "${userFullName}"...`,
        duration: 0,
        key: 'deleteUser'
      });
      
      console.log('🚀 Gọi API xóa người dùng...');
      console.log('📡 API URL:', `/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`);
      console.log('🔑 Headers:', { Authorization: `Bearer ${token}` });
      
      const response = await api.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`);
      
      console.log('✅ API xóa thành công:', response);
      
      // Đóng loading
      message.destroy('deleteUser');
      
             // Hiển thị message thông báo xóa thành công đẹp mắt
       message.success({
         content: `🗑️ Người dùng "${userFullName}" (${taiKhoan}) đã được xóa thành công!`,
         duration: 4,
         style: {
           marginTop: '20vh',
           fontSize: '16px',
           fontWeight: 'bold',
         },
         icon: <span style={{ fontSize: '20px' }}>✅</span>,
       });
       
       // Hiển thị notification
       notificationApi.success({
         message: 'Xóa người dùng thành công! 🗑️',
         description: `Người dùng "${userFullName}" (${taiKhoan}) đã được xóa khỏi hệ thống.`,
         placement: 'topRight',
         icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
         duration: 8
       });
      
             // Hiển thị modal thông báo xóa thành công
       setTimeout(() => {
         Modal.success({
           title: 'Xóa người dùng thành công! 🗑️',
           content: (
             <div>
               <p>Người dùng <strong>"{userFullName}"</strong> đã được xóa khỏi hệ thống thành công!</p>
               <div className="mt-4 p-3 bg-red-50 rounded">
                 <p><strong>Thông tin người dùng đã xóa:</strong></p>
                 <ul className="list-disc list-inside mt-2">
                   <li><strong>Tài khoản:</strong> {taiKhoan}</li>
                   <li><strong>Họ tên:</strong> {userFullName}</li>
                   <li><strong>Email:</strong> {userToDelete?.email || 'Không có'}</li>
                   <li><strong>Số điện thoại:</strong> {userToDelete?.soDt || userToDelete?.soDT || 'Không có'}</li>
                   <li><strong>Loại người dùng:</strong> {userToDelete?.maLoaiNguoiDung === 'QuanTri' ? 'Quản trị' : 'Khách hàng'}</li>
                 </ul>
               </div>
               <p className="mt-3 text-orange-600">⚠️ Hành động này không thể hoàn tác!</p>
             </div>
           ),
         });
       }, 300);
       
       // Hiển thị thông tin chi tiết về người dùng đã xóa
       console.log('🗑️ Người dùng đã được xóa thành công:', {
         taiKhoan: taiKhoan,
         hoTen: userFullName,
         email: userToDelete?.email,
         soDt: userToDelete?.soDt || userToDelete?.soDT,
         maLoaiNguoiDung: userToDelete?.maLoaiNguoiDung,
         response: response.data
       });
       
       // Refresh danh sách người dùng
       console.log('🔄 Refresh danh sách người dùng...');
       fetchUsers(searchText);
      
    } catch (error) {
      console.error("❌ Lỗi khi xóa người dùng:", error);
      
      // Đóng loading nếu có
      message.destroy('deleteUser');
      
      // Thêm thông tin về người dùng đang cố gắng xóa
      console.log('🎯 Thông tin người dùng đang xóa:', {
        taiKhoan: taiKhoan,
        userToDelete: userToDelete,
        userFullName: userFullName
      });
      
      // Sử dụng hàm xử lý lỗi chung
      handleError(error, `xóa người dùng "${userFullName}"`);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Hiển thị loading
      const loadingMessage = message.loading({
        content: editingUser ? 'Đang cập nhật người dùng...' : 'Đang thêm người dùng...',
        duration: 0,
        key: 'userAction'
      });
      
      if (editingUser) {
        // Cập nhật người dùng
        console.log('🔄 Bắt đầu cập nhật người dùng:', editingUser.taiKhoan);
        
        // Chuẩn bị dữ liệu cập nhật - KHÔNG gửi mật khẩu placeholder
        const updateData = {
          taiKhoan: values.taiKhoan,
          hoTen: values.hoTen,
          email: values.email,
          soDt: values.soDt,
          maLoaiNguoiDung: values.maLoaiNguoiDung,
          maNhom: DEFAULT_GROUP_CODE,
        };
        
        // Chỉ gửi mật khẩu nếu người dùng thực sự thay đổi (không phải placeholder)
        if (values.matKhau && values.matKhau !== "********") {
          updateData.matKhau = values.matKhau;
          console.log('🔐 Mật khẩu sẽ được cập nhật');
        } else {
          console.log('🔐 Không cập nhật mật khẩu (giữ nguyên)');
        }
        
        console.log('📤 Dữ liệu cập nhật sẽ gửi:', updateData);
        console.log('📡 API URL:', "/QuanLyNguoiDung/CapNhatThongTinNguoiDung");
        
        const response = await api.post("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", updateData);
        
        console.log('✅ API cập nhật thành công:', response.data);
        
        // Đóng loading và hiển thị thành công
        message.destroy('userAction');
        
                 // Hiển thị message thông báo cập nhật thành công đẹp mắt
         message.success({
           content: `✅ Thông tin người dùng "${values.hoTen}" đã được cập nhật thành công!`,
           duration: 4,
           style: {
             marginTop: '20vh',
             fontSize: '16px',
             fontWeight: 'bold',
           },
           icon: <span style={{ fontSize: '20px' }}>🔄</span>,
         });
         
         // Hiển thị notification
         notificationApi.success({
           message: 'Cập nhật người dùng thành công! ✅',
           description: `Thông tin người dùng "${values.hoTen}" (${values.taiKhoan}) đã được cập nhật.`,
           placement: 'topRight',
           icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
           duration: 8
         });
         
         // Hiển thị modal thông báo chi tiết
         setTimeout(() => {
           Modal.success({
             title: 'Cập nhật người dùng thành công! ✅',
             content: (
               <div>
                 <p>Thông tin người dùng <strong>"{values.hoTen}"</strong> đã được cập nhật thành công!</p>
                 <div className="mt-4 p-3 bg-blue-50 rounded">
                   <p><strong>Thông tin đã cập nhật:</strong></p>
                   <ul className="list-disc list-inside mt-2">
                     <li><strong>Tài khoản:</strong> {values.taiKhoan}</li>
                     <li><strong>Họ tên:</strong> {values.hoTen}</li>
                     <li><strong>Email:</strong> {values.email}</li>
                     <li><strong>Số điện thoại:</strong> {values.soDt}</li>
                     <li><strong>Loại người dùng:</strong> {values.maLoaiNguoiDung === 'QuanTri' ? 'Quản trị' : 'Khách hàng'}</li>
                   </ul>
                 </div>
                 <p className="mt-3 text-green-600">Thay đổi đã được lưu vào hệ thống!</p>
               </div>
             ),
           });
         }, 300);
        
        console.log('✅ Cập nhật người dùng thành công:', {
          taiKhoan: values.taiKhoan,
          hoTen: values.hoTen,
          email: values.email,
          soDt: values.soDt,
          maLoaiNguoiDung: values.maLoaiNguoiDung,
          response: response.data
        });
      } else {
        // Thêm người dùng mới
        console.log('🔄 Bắt đầu thêm người dùng mới');
        
        const newUserData = {
          ...values,
          maNhom: DEFAULT_GROUP_CODE,
        };
        
        console.log('📤 Dữ liệu thêm mới sẽ gửi:', newUserData);
        console.log('📡 API URL:', "/QuanLyNguoiDung/ThemNguoiDung");
        
        const response = await api.post("/QuanLyNguoiDung/ThemNguoiDung", newUserData);
        
        console.log('✅ API thêm mới thành công:', response.data);
        
        // Đóng loading và hiển thị thông báo thành công
        message.destroy('userAction');
        
                 // Hiển thị message thông báo thành công đẹp mắt
         message.success({
           content: `🎉 Người dùng "${values.hoTen}" đã được thêm thành công!`,
           duration: 4,
           style: {
             marginTop: '20vh',
             fontSize: '16px',
             fontWeight: 'bold',
           },
           icon: <span style={{ fontSize: '20px' }}>✅</span>,
         });
         
         // Hiển thị notification (góc màn hình)
         notificationApi.success({
           message: 'Thêm người dùng thành công! 🎉',
           description: `Người dùng "${values.hoTen}" (${values.taiKhoan}) đã được thêm vào hệ thống.`,
           placement: 'topRight',
           icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
           duration: 8
         });
         
         // Hiển thị modal thông báo chi tiết
         setTimeout(() => {
           Modal.success({
             title: 'Thêm người dùng thành công! 🎉',
             content: (
               <div>
                 <p>Người dùng <strong>"{values.hoTen}"</strong> đã được thêm vào hệ thống thành công!</p>
                 <div className="mt-4 p-3 bg-green-50 rounded">
                   <p><strong>Thông tin người dùng đã tạo:</strong></p>
                   <ul className="list-disc list-inside mt-2">
                     <li><strong>Tài khoản:</strong> {values.taiKhoan}</li>
                     <li><strong>Họ tên:</strong> {values.hoTen}</li>
                     <li><strong>Email:</strong> {values.email}</li>
                     <li><strong>Số điện thoại:</strong> {values.soDt}</li>
                     <li><strong>Loại người dùng:</strong> {values.maLoaiNguoiDung === 'QuanTri' ? 'Quản trị' : 'Khách hàng'}</li>
                   </ul>
                 </div>
                 <p className="mt-3 text-blue-600">
                   <strong>🎯 Người dùng mới sẽ hiển thị ở đầu danh sách!</strong>
                 </p>
                 <p className="mt-2 text-gray-600 text-sm">
                   Danh sách được sắp xếp theo thứ tự: Mới nhất → Cũ nhất
                 </p>
               </div>
             ),
           });
         }, 300);
        
        console.log('👤 Thêm người dùng thành công:', {
          taiKhoan: values.taiKhoan,
          hoTen: values.hoTen,
          email: values.email,
          soDt: values.soDt,
          maLoaiNguoiDung: values.maLoaiNguoiDung,
          response: response.data
        });
      }
      
      setModalVisible(false);
      form.resetFields();
      
      // Tự động cập nhật danh sách người dùng
      fetchUsers(searchText);
      
      // Hiển thị thông báo toàn màn hình nếu thêm mới
      if (!editingUser) {
        message.info("Trang sẽ tự động làm mới sau 2 giây để hiển thị người dùng mới ở đầu danh sách");
        setTimeout(() => {
          // Tự động làm mới trang sau khi thêm người dùng mới
          console.log('🔄 Tự động refresh để hiển thị người dùng mới ở đầu danh sách');
          fetchUsers("");
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Lỗi khi lưu thông tin người dùng:", error);
      
      // Đóng loading nếu có
      message.destroy('userAction');
      
      // Lấy thông tin từ form để debug
      const formValues = form.getFieldsValue();
      console.log('� Giá trị form khi xảy ra lỗi:', formValues);
      
      // Sử dụng hàm xử lý lỗi chung
      handleError(error, editingUser ? 
        `cập nhật người dùng "${formValues.hoTen}"` : 
        `thêm người dùng "${formValues.hoTen}"`);
    }
  };

  const columns = [
    {
      title: (
        <div style={{ 
          fontWeight: '600', 
          color: '#1f2937',
          fontSize: '14px',
          padding: '8px 0'
        }}>
          Tài khoản
        </div>
      ),
      dataIndex: "taiKhoan",
      key: "taiKhoan",
      width: 180,
      render: (text) => (
        <div style={{
          fontWeight: '500',
          color: '#374151',
          fontSize: '13px',
          padding: '4px 8px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          display: 'inline-block',
          minWidth: '80px',
          textAlign: 'center'
        }}>
          {text}
        </div>
      ),
    },
    {
      title: (
        <div style={{ 
          fontWeight: '600', 
          color: '#1f2937',
          fontSize: '14px',
          padding: '8px 0'
        }}>
          Họ tên
        </div>
      ),
      dataIndex: "hoTen",
      key: "hoTen",
      width: 220,
      render: (text) => (
        <div style={{
          fontWeight: '500',
          color: '#111827',
          fontSize: '14px',
          padding: '4px 0'
        }}>
          {text}
        </div>
      ),
    },
    {
      title: (
        <div style={{ 
          fontWeight: '600', 
          color: '#1f2937',
          fontSize: '14px',
          padding: '8px 0'
        }}>
          Email
        </div>
      ),
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (text) => (
        <div style={{
          color: '#059669',
          fontSize: '13px',
          padding: '4px 0',
          wordBreak: 'break-word'
        }}>
          {text}
        </div>
      ),
    },
    {
      title: (
        <div style={{ 
          fontWeight: '600', 
          color: '#1f2937',
          fontSize: '14px',
          padding: '8px 0'
        }}>
          Số điện thoại
        </div>
      ),
      dataIndex: "soDt",
      key: "soDt",
      width: 180,
      render: (soDt, record) => {
        // Xử lý cả hai trường soDt và soDT
        const phoneNumber = soDt || record.soDT;
        if (!phoneNumber || phoneNumber === '') {
          return (
            <span style={{ 
              color: '#9ca3af', 
              fontStyle: 'italic',
              fontSize: '12px',
              padding: '4px 8px',
              backgroundColor: '#f9fafb',
              borderRadius: '4px',
              border: '1px dashed #d1d5db'
            }}>
              Chưa có
            </span>
          );
        }
        return (
          <div style={{
            color: '#374151',
            fontSize: '13px',
            padding: '4px 8px',
            backgroundColor: '#f0f9ff',
            borderRadius: '6px',
            border: '1px solid #e0f2fe'
          }}>
            {phoneNumber}
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ 
          fontWeight: '600', 
          color: '#1f2937',
          fontSize: '14px',
          padding: '8px 0'
        }}>
          Loại người dùng
        </div>
      ),
      dataIndex: "maLoaiNguoiDung",
      key: "maLoaiNguoiDung",
      width: 160,
      render: (type) => {
        const isAdmin = type === "QuanTri";
        return (
          <div style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            textAlign: 'center',
            backgroundColor: isAdmin ? '#fef3c7' : '#dbeafe',
            color: isAdmin ? '#92400e' : '#1e40af',
            border: `1px solid ${isAdmin ? '#fbbf24' : '#60a5fa'}`,
            minWidth: '80px'
          }}>
            {isAdmin ? "Quản trị" : "Khách hàng"}
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ 
          fontWeight: '600', 
          color: '#1f2937',
          fontSize: '14px',
          padding: '8px 0',
          textAlign: 'center'
        }}>
          Thao tác
        </div>
      ),
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            size="small"
            style={{
              borderRadius: '6px',
              height: '32px',
              padding: '0 12px',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record.taiKhoan)}
            okText="Xóa"
            cancelText="Hủy"
            placement="top"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
              style={{
                borderRadius: '6px',
                height: '32px',
                padding: '0 12px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {contextHolder} {/* Đặt contextHolder để hiển thị notification */}
      <div style={{ 
        marginBottom: 24, 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          marginBottom: '16px', 
          color: '#1f2937',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          👥 Quản lý Người dùng
        </h1>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '16px', 
          alignItems: 'center',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#fef3c7',
            borderRadius: '20px',
            border: '1px solid #fbbf24'
          }}>
            📍 <strong style={{ color: '#92400e' }}>Người dùng mới nhất sẽ hiển thị ở đầu danh sách</strong>
          </div>
          <div style={{ 
            padding: '8px 16px',
            backgroundColor: '#dbeafe',
            borderRadius: '20px',
            border: '1px solid #60a5fa',
            color: '#1e40af',
            fontWeight: '500'
          }}>
            👥 Tổng: <strong>{users.length}</strong> người dùng
          </div>
          {lastUpdated && (
            <div style={{ 
              padding: '8px 16px',
              backgroundColor: '#dcfce7',
              borderRadius: '20px',
              border: '1px solid #4ade80',
              color: '#166534',
              fontWeight: '500'
            }}>
              ⏰ Cập nhật lúc: <strong>{lastUpdated.toLocaleTimeString('vi-VN')}</strong>
            </div>
          )}
                     <div style={{ 
             padding: '8px 16px',
             backgroundColor: '#f3e8ff',
             borderRadius: '20px',
             border: '1px solid #a78bfa',
             color: '#7c3aed',
             fontWeight: '500'
           }}>
             🔄 Sắp xếp: Mới nhất → Cũ nhất
           </div>
        </div>
      </div>
      
      <div style={{ 
        marginBottom: 24, 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '16px', 
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px', 
            alignItems: 'center'
          }}>
            <Input
              placeholder="🔍 Tìm kiếm theo tài khoản hoặc họ tên..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ 
                width: 350,
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '8px 16px',
                fontSize: '14px'
              }}
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            />
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={handleSearch}
              style={{
                borderRadius: '8px',
                height: '40px',
                padding: '0 20px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: '#3b82f6',
                border: 'none',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
              }}
            >
              Tìm kiếm
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                console.log('🔄 Manual refresh danh sách người dùng...');
                message.loading({
                  content: 'Đang refresh danh sách người dùng...',
                  duration: 0,
                  key: 'refreshUsers'
                });
                fetchUsers().then(() => {
                  message.destroy('refreshUsers');
                  message.success({
                    content: '🔄 Đã refresh danh sách người dùng thành công!',
                    duration: 3,
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold',
                    },
                  });
                  notificationApi.success({
                    message: 'Refresh thành công',
                    description: `Danh sách người dùng đã được cập nhật. Tổng: ${users.length} người dùng.`,
                    placement: 'topRight',
                    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                    duration: 5
                  });
                }).catch((error) => {
                  message.destroy('refreshUsers');
                  message.error('Không thể refresh danh sách người dùng!');
                  console.error('❌ Lỗi khi refresh:', error);
                });
              }}
              title="Refresh danh sách người dùng"
              style={{
                borderRadius: '8px',
                height: '40px',
                padding: '0 20px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid #d1d5db',
                color: '#374151',
                backgroundColor: 'white'
              }}
            >
              🔄 Refresh
            </Button>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
            style={{ 
              borderRadius: '8px',
              height: '40px',
              padding: '0 24px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: '#10b981',
              border: 'none',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
            }}
          >
            ➕ Thêm người dùng
          </Button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="taiKhoan"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
            size: 'default'
          }}
          className="user-management-table"
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
          }
          scroll={{ x: 1200 }}
          style={{
            margin: 0
          }}
          tableLayout="fixed"
        />
      </div>

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

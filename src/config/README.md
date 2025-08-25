# Cấu hình Constants

## Mô tả
File `constants.js` chứa các hằng số chung được sử dụng trong toàn bộ dự án.

## Các hằng số hiện có

### DEFAULT_GROUP_CODE
- **Giá trị**: "GP01"
- **Mô tả**: Mã nhóm mặc định được sử dụng cho tất cả các API call
- **Sử dụng**: Thay thế cho việc hardcode "GP01" trong code

### API_ENDPOINTS
- **MOVIES**: "QuanLyPhim/LayDanhSachPhim"
- **USERS**: "QuanLyNguoiDung/LayDanhSachNguoiDung"  
- **CINEMAS**: "QuanLyRap/LayThongTinLichChieuHeThongRap"

## Cách sử dụng

### Import
```javascript
import { DEFAULT_GROUP_CODE, API_ENDPOINTS } from "../../config/constants";
```

### Sử dụng trong API call
```javascript
// Thay vì:
const response = await api.get("/QuanLyPhim/LayDanhSachPhim?maNhom=GP01");

// Sử dụng:
const response = await api.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${DEFAULT_GROUP_CODE}`);
```

### Sử dụng trong form data
```javascript
// Thay vì:
formData.append("maNhom", "GP01");

// Sử dụng:
formData.append("maNhom", DEFAULT_GROUP_CODE);
```

## Lợi ích
1. **Dễ bảo trì**: Chỉ cần thay đổi giá trị ở một nơi
2. **Tránh lỗi typo**: Không còn lo lắng về việc gõ sai "GP01"
3. **Tính nhất quán**: Đảm bảo tất cả các nơi sử dụng cùng một giá trị
4. **Dễ dàng thay đổi**: Khi cần đổi mã nhóm, chỉ cần sửa file constants

## Cập nhật
Khi cần thay đổi mã nhóm hoặc thêm constants mới, chỉ cần chỉnh sửa file `src/config/constants.js`.

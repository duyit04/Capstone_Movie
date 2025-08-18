import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { bookTickets, getTicketRoomInfo } from "./slice";
import { Row, Col, Button, Typography, Divider, message, Tag, Modal, Spin, Tooltip } from 'antd';
import './styles.css';

const { Title, Text } = Typography;

// Constants
const SEAT_TYPES = {
  VIP: {
    color: '#f1c40f',
    name: 'Vé VIP'
  },
  THUONG: {
    color: '#3498db',
    name: 'Vé thường'
  },
  DANG_CHON: {
    color: '#2ecc71',
    name: 'Đang chọn'
  },
  DA_DAT: {
    color: '#e74c3c',
    name: 'Đã đặt'
  }
};

export default function TicketRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ticketRoom, loading, error } = useSelector((state) => state.ticketRoomSlice);
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    dispatch(getTicketRoomInfo(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  const handleSeatClick = (seat) => {
    // Không cho chọn ghế đã đặt
    if (seat.daDat) return;

    // Kiểm tra xem ghế đã được chọn chưa
    const isSelected = selectedSeats.findIndex(item => item.maGhe === seat.maGhe) !== -1;

    if (isSelected) {
      // Nếu đã chọn thì bỏ chọn
      setSelectedSeats(selectedSeats.filter(item => item.maGhe !== seat.maGhe));
    } else {
      // Nếu chưa chọn thì thêm vào
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + seat.giaVe, 0);
  }, [selectedSeats]);

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 ghế");
      return;
    }

    // Kiểm tra đăng nhập
    const userInfo = JSON.parse(localStorage.getItem("USER_INFO") || "{}");
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    
    if (!userInfo || !accessToken || !userInfo.taiKhoan) {
      message.warning("Vui lòng đăng nhập để đặt vé");
      navigate("/login");
      return;
    }
    
    const danhSachVe = selectedSeats.map((seat) => ({
      maGhe: seat.maGhe,
      giaVe: seat.giaVe,
    }));
    
    dispatch(bookTickets({ 
      maLichChieu: id,
      danhSachVe 
    })).then(() => {
      setShowSuccessModal(true);
      setSelectedSeats([]);
      // Refresh ticket room data after booking
      dispatch(getTicketRoomInfo(id));
    }).catch(err => {
      message.error("Đặt vé thất bại: " + err.message);
    });
  };

  const renderSeats = () => {
    if (!ticketRoom || !ticketRoom.danhSachGhe) return null;

    const rows = {};
    
    // Nhóm ghế theo hàng
    ticketRoom.danhSachGhe.forEach(seat => {
      const rowChar = seat.tenGhe[0]; // Lấy ký tự đầu tiên làm hàng (A, B, C, ...)
      if (!rows[rowChar]) {
        rows[rowChar] = [];
      }
      rows[rowChar].push(seat);
    });

    return Object.keys(rows).sort().map(rowChar => (
      <div key={rowChar} className="seat-row">
        <div className="row-name">{rowChar}</div>
        <div className="row-seats">
          {rows[rowChar].map(seat => {
            // Xác định trạng thái ghế
            let seatStatus = '';
            let seatType = seat.loaiGhe === 'Vip' ? SEAT_TYPES.VIP : SEAT_TYPES.THUONG;
            
            if (seat.daDat) {
              seatStatus = 'booked';
              seatType = SEAT_TYPES.DA_DAT;
            } else if (selectedSeats.findIndex(item => item.maGhe === seat.maGhe) !== -1) {
              seatStatus = 'selected';
              seatType = SEAT_TYPES.DANG_CHON;
            }

            return (
              <Tooltip 
                key={seat.maGhe} 
                title={`${seat.tenGhe} - ${seat.loaiGhe} - ${seat.giaVe.toLocaleString('vi-VN')}đ`}
              >
                <button
                  className={`seat ${seatStatus} ${seat.loaiGhe.toLowerCase()}`}
                  style={{
                    backgroundColor: seatStatus === 'selected' 
                      ? SEAT_TYPES.DANG_CHON.color 
                      : seat.daDat 
                        ? SEAT_TYPES.DA_DAT.color 
                        : seat.loaiGhe === 'Vip' 
                          ? SEAT_TYPES.VIP.color 
                          : SEAT_TYPES.THUONG.color
                  }}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.daDat}
                >
                  {seat.daDat ? 'X' : seat.tenGhe.substring(1)} {/* Hiển thị số ghế (bỏ chữ cái đầu) */}
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Lỗi: {error.message || "Không thể tải thông tin phòng vé"}</Title>
        <Button type="primary" onClick={() => navigate('/')}>Quay lại trang chủ</Button>
      </div>
    );
  }

  if (!ticketRoom) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Không tìm thấy thông tin lịch chiếu!</Title>
        <Button type="primary" onClick={() => navigate('/')}>Quay lại trang chủ</Button>
      </div>
    );
  }

  const { thongTinPhim } = ticketRoom;

  return (
    <div className="ticket-room-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="screen-container">
            <div className="screen">SCREEN</div>
            <div className="screen-shadow"></div>
          </div>

          <div className="seats-container">
            {renderSeats()}
          </div>

          <div className="seat-legend">
            <div className="legend-item">
              <div className="legend-box" style={{ backgroundColor: SEAT_TYPES.THUONG.color }}></div>
              <span>Ghế thường</span>
            </div>
            <div className="legend-item">
              <div className="legend-box" style={{ backgroundColor: SEAT_TYPES.VIP.color }}></div>
              <span>Ghế VIP</span>
            </div>
            <div className="legend-item">
              <div className="legend-box" style={{ backgroundColor: SEAT_TYPES.DANG_CHON.color }}></div>
              <span>Đang chọn</span>
            </div>
            <div className="legend-item">
              <div className="legend-box" style={{ backgroundColor: SEAT_TYPES.DA_DAT.color }}></div>
              <span>Đã đặt</span>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="ticket-info">
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
              {totalPrice.toLocaleString('vi-VN')}đ
            </Title>

            <Divider />

            <div className="movie-info">
              <Title level={4}>{thongTinPhim.tenPhim}</Title>
              <div>
                <Text strong>Rạp: </Text>
                <Text>{thongTinPhim.tenCumRap} - {thongTinPhim.tenRap}</Text>
              </div>
              <div>
                <Text strong>Địa chỉ: </Text>
                <Text>{thongTinPhim.diaChi}</Text>
              </div>
              <div>
                <Text strong>Ngày chiếu: </Text>
                <Text>{thongTinPhim.ngayChieu} - {thongTinPhim.gioChieu}</Text>
              </div>
            </div>

            <Divider />

            <div className="seats-info">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Ghế: </Text>
                <div>
                  {selectedSeats.length > 0 ? (
                    <div className="selected-seats">
                      {selectedSeats.map(seat => (
                        <Tag key={seat.maGhe} color={seat.loaiGhe === 'Vip' ? 'gold' : 'blue'}>
                          {seat.tenGhe}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <Text type="secondary">Chưa chọn ghế</Text>
                  )}
                </div>
              </div>
            </div>

            <Divider />

            <Button 
              type="primary" 
              size="large" 
              block 
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
            >
              ĐẶT VÉ
            </Button>
          </div>
        </Col>
      </Row>

      <Modal
        title="Đặt vé thành công"
        open={showSuccessModal}
        onOk={() => setShowSuccessModal(false)}
        onCancel={() => setShowSuccessModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowSuccessModal(false)}>
            Đóng
          </Button>,
        ]}
      >
        <p>Bạn đã đặt vé thành công!</p>
        <p>Vui lòng kiểm tra email để nhận thông tin vé.</p>
      </Modal>
    </div>
  );
}

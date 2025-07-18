import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { bookTickets, getTicketRoomInfo } from "./slice";
import { Button, Modal } from "antd";

export default function TicketRoom() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { ticketRoom, loading, error } = useSelector((state) => state.ticketRoomSlice);
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    dispatch(getTicketRoomInfo(id));
  }, [dispatch, id]);

  const handleSeatClick = (seat) => {
    if (seat.daDat) return; // Don't allow selecting already booked seats
    
    // Check if seat is already selected
    const isSeatSelected = selectedSeats.findIndex(
      (selectedSeat) => selectedSeat.maGhe === seat.maGhe
    );
    
    if (isSeatSelected !== -1) {
      // Remove seat if already selected
      const updatedSeats = [...selectedSeats];
      updatedSeats.splice(isSeatSelected, 1);
      setSelectedSeats(updatedSeats);
    } else {
      // Add seat to selection
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.giaVe, 0);
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;
    
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
    });
  };

  const isSeatSelected = (seat) => {
    return selectedSeats.findIndex(
      (selectedSeat) => selectedSeat.maGhe === seat.maGhe
    ) !== -1;
  };

  if (loading) return <div className="container mx-auto py-10 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto py-10 text-center">Error: {error.message}</div>;
  if (!ticketRoom) return <div className="container mx-auto py-10 text-center">No data found</div>;

  const { thongTinPhim, danhSachGhe } = ticketRoom;

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Seat Selection */}
        <div className="col-span-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Đặt vé xem phim</h1>
          
          {/* Screen */}
          <div className="mb-8">
            <div className="h-2 bg-black"></div>
            <div className="h-16 bg-gray-300 flex items-center justify-center text-xl font-bold">
              Màn hình
            </div>
          </div>
          
          {/* Seats */}
          <div className="grid grid-cols-16 gap-2 mb-8">
            {danhSachGhe.map((seat) => (
              <button
                key={seat.maGhe}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.daDat}
                className={`p-2 rounded text-center ${
                  seat.daDat
                    ? "bg-gray-500 cursor-not-allowed"
                    : isSeatSelected(seat)
                    ? "bg-green-600 text-white"
                    : seat.loaiGhe === "Vip"
                    ? "bg-orange-400 hover:bg-orange-500"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {seat.tenGhe}
              </button>
            ))}
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-200 rounded mr-2"></div>
              <span>Ghế thường</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-orange-400 rounded mr-2"></div>
              <span>Ghế VIP</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-600 rounded mr-2"></div>
              <span>Ghế đang chọn</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-500 rounded mr-2"></div>
              <span>Ghế đã đặt</span>
            </div>
          </div>
        </div>
        
        {/* Right: Booking Info */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-4 text-red-600">{thongTinPhim.tenPhim}</h2>
            
            <div className="mb-4">
              <p className="mb-2"><span className="font-bold">Cụm rạp:</span> {thongTinPhim.tenCumRap}</p>
              <p className="mb-2"><span className="font-bold">Địa chỉ:</span> {thongTinPhim.diaChi}</p>
              <p className="mb-2"><span className="font-bold">Rạp:</span> {thongTinPhim.tenRap}</p>
              <p className="mb-2">
                <span className="font-bold">Suất chiếu:</span> {thongTinPhim.gioChieu} - {thongTinPhim.ngayChieu}
              </p>
            </div>
            
            <hr className="my-4" />
            
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Ghế đã chọn:</h3>
              {selectedSeats.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {selectedSeats.map((seat) => (
                    <span 
                      key={seat.maGhe}
                      className={`inline-block px-2 py-1 rounded text-center ${
                        seat.loaiGhe === "Vip" ? "bg-orange-400" : "bg-gray-200"
                      }`}
                    >
                      {seat.tenGhe}
                    </span>
                  ))}
                </div>
              ) : (
                <p>Chưa chọn ghế</p>
              )}
            </div>
            
            <hr className="my-4" />
            
            <div className="mb-6">
              <p className="text-xl font-bold flex justify-between">
                <span>Tổng tiền:</span>
                <span>{calculateTotal().toLocaleString('vi-VN')} VND</span>
              </p>
            </div>
            
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              className={`w-full py-3 rounded-lg font-bold ${
                selectedSeats.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              ĐẶT VÉ
            </button>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
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

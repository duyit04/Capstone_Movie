import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useTheme } from '../../context/ThemeContext';

export default function BookingDialog({ movieId, movieName, posterUrl }) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const { theme } = useTheme();
  
  // Tạo dữ liệu mẫu cho demo
  const dates = [
    new Date(Date.now() + 24 * 60 * 60 * 1000),
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  ];
  
  const cinemas = [
    { id: "cgv-aeon", name: "CGV Aeon Mall" },
    { id: "cgv-vivocity", name: "CGV Vivocity" },
    { id: "lotte-nam-sai-gon", name: "Lotte Nam Sài Gòn" },
    { id: "bhd-pham-hung", name: "BHD Phạm Hùng" },
  ];
  
  const showtimes = [
    "10:30", "12:45", "15:20", "17:40", "20:15", "22:30"
  ];
  
  const handleShowtimeSelect = (time) => {
    // Xác nhận đặt vé
    navigate(`/ticket-room/${movieId}`, {
      state: {
        movieName,
        cinema: selectedCinema,
        date: selectedDate,
        time
      }
    });
    setIsDialogOpen(false);
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Reset cinema selection khi chọn ngày mới
    setSelectedCinema(null);
  };
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };
  
  return (
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
    <Button 
      className="w-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 rounded-full"
        >
          Đặt Vé
        </Button>
      </DialogTrigger>
    <DialogContent className={`sm:max-w-md rounded-2xl ${theme==='dark' ? 'bg-slate-800/80 backdrop-blur border border-slate-700' : ''}`}>
        <DialogHeader>
      <DialogTitle className="text-xl font-bold">Đặt vé xem phim</DialogTitle>
          <DialogDescription asChild>
            <div className="flex items-center gap-3 mt-2">
              <img 
                src={posterUrl} 
                alt={movieName}
                className="w-12 h-16 object-cover rounded-md"
              />
              <div>
        <p className={`font-medium text-base ${theme==='dark' ? 'text-slate-100' : ''}`}>{movieName}</p>
        <p className={`text-sm ${theme==='dark' ? 'text-slate-400' : 'text-gray-500'}`}>Chọn lịch chiếu phù hợp</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Date Selection */}
          <div className="mb-4">
            <h3 className={`text-sm font-medium mb-2 ${theme==='dark' ? 'text-slate-200' : ''}`}>Ngày chiếu:</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dates.map((date, index) => (
                <motion.button
                  key={index}
                  className={`px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    selectedDate === date 
                      ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-600 border border-orange-400/40' 
                      : theme==='dark' ? 'bg-slate-700/60 hover:bg-slate-600/60 text-slate-200' : 'bg-gray-100 hover:bg-gray-200'
                  } ${theme==='dark' ? 'focus-visible:ring-blue-500/60 focus-visible:ring-offset-slate-800' : 'focus-visible:ring-blue-500/40 focus-visible:ring-offset-white'}`}
                  onClick={() => handleDateSelect(date)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={selectedDate === date}
                >
                  {formatDate(date)}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Cinema Selection */}
          {selectedDate && (
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={`text-sm font-medium mb-2 ${theme==='dark' ? 'text-slate-200' : ''}`}>Rạp chiếu:</h3>
              <div className="grid grid-cols-2 gap-2">
                {cinemas.map((cinema) => (
                  <button
                    key={cinema.id}
                    className={`px-3 py-2 rounded-md text-sm text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      selectedCinema?.id === cinema.id 
                        ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-600 border border-orange-400/40' 
                        : theme==='dark' ? 'bg-slate-700/60 hover:bg-slate-600/60 text-slate-200' : 'bg-gray-100 hover:bg-gray-200'
                    } ${theme==='dark' ? 'focus-visible:ring-blue-500/60 focus-visible:ring-offset-slate-800' : 'focus-visible:ring-blue-500/40 focus-visible:ring-offset-white'}`}
                    onClick={() => setSelectedCinema(cinema)}
                    aria-pressed={selectedCinema?.id === cinema.id}
                  >
                    {cinema.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Showtime Selection */}
          {selectedCinema && (
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={`text-sm font-medium mb-2 ${theme==='dark' ? 'text-slate-200' : ''}`}>Giờ chiếu:</h3>
              <div className="grid grid-cols-3 gap-2">
                {showtimes.map((time) => (
                  <motion.button
                    key={time}
                    className={`px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme==='dark' ? 'bg-slate-700/60 hover:bg-orange-600/30 text-slate-200 hover:text-orange-300' : 'bg-gray-100 hover:bg-orange-100 hover:text-orange-700'} ${theme==='dark' ? 'focus-visible:ring-blue-500/60 focus-visible:ring-offset-slate-800' : 'focus-visible:ring-blue-500/40 focus-visible:ring-offset-white'}`}
                    onClick={() => handleShowtimeSelect(time)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Chọn suất ${time}`}
                  >
                    {time}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="rounded-full"
          >
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

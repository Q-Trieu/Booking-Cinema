import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import axiosInstance from "../../api/axios";
import BackToTop from "../../components/UI/BackToTop";

interface Movie {
  _id: string;
  title: string;
  poster: string;
  release_date: string;
  duration?: number;
}

interface Showtime {
  id: string;
  time: string;
  date: string;
}

interface Seat {
  id: string;
  name: string;
  price: number;
  status: "available" | "booked" | "selected";
  type: "standard" | "vip" | "couple";
}

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [availableShowtimes, setAvailableShowtimes] = useState<Showtime[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);

  // Dữ liệu mẫu khi API không hoạt động
  const sampleMovie: Movie = {
    _id: id || "1",
    title: "[RE-RUN 39K] EXHUMA: QUẬT MỘ TRÙNG MA",
    poster: "https://i.imgur.com/FHOtPWc.jpg",
    release_date: "2024-03-24",
    duration: 133
  };

  const sampleShowtimes: Showtime[] = [
    { id: "1", time: "13:30", date: "2024-04-04" },
    { id: "2", time: "15:45", date: "2024-04-04" },
    { id: "3", time: "18:00", date: "2024-04-04" },
    { id: "4", time: "20:15", date: "2024-04-04" },
    { id: "5", time: "22:30", date: "2024-04-04" },
    { id: "6", time: "14:00", date: "2024-04-05" },
    { id: "7", time: "17:30", date: "2024-04-05" },
    { id: "8", time: "20:00", date: "2024-04-05" }
  ];

  // Tạo danh sách ghế mẫu
  const generateSampleSeats = (): Seat[] => {
    const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;
    const seatsList: Seat[] = [];

    seatRows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        const isVip = row >= 'D' && row <= 'F' && i >= 3 && i <= 8;
        const isCouple = row === 'H';
        
        // Một số ghế ngẫu nhiên đã được đặt
        const randomBooked = Math.random() < 0.2;
        
        seatsList.push({
          id: seatId,
          name: seatId,
          price: isVip ? 130000 : isCouple ? 150000 : 100000,
          status: randomBooked ? "booked" : "available",
          type: isVip ? "vip" : isCouple ? "couple" : "standard"
        });
      }
    });

    return seatsList;
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        // Thay đường dẫn API phù hợp
        const response = await axiosInstance.get(`/api/movie/${id}`);
        setMovie(response.data);
        
        // Trong thực tế: Lấy suất chiếu từ API
        // const showtimesResponse = await axiosInstance.get(`/api/showtimes/movie/${id}`);
        // setAvailableShowtimes(showtimesResponse.data);
        
        setAvailableShowtimes(sampleShowtimes);
        setLoading(false);
      } catch (err) {
        console.error("Không thể lấy thông tin phim:", err);
        // Sử dụng dữ liệu mẫu khi không kết nối được API
        setMovie(sampleMovie);
        setAvailableShowtimes(sampleShowtimes);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    // Tạo danh sách ghế khi chọn suất chiếu
    if (selectedShowtime) {
      setSeats(generateSampleSeats());
    }
  }, [selectedShowtime]);

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setCurrentStep(2); // Chuyển sang bước chọn ghế
  };

  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === "booked") return;

    const seatExists = selectedSeats.find(s => s.id === seat.id);
    let updatedSeats;

    if (seatExists) {
      // Nếu ghế đã được chọn, bỏ chọn nó
      updatedSeats = selectedSeats.filter(s => s.id !== seat.id);
    } else {
      // Nếu ghế chưa được chọn, thêm vào danh sách
      updatedSeats = [...selectedSeats, seat];
    }

    setSelectedSeats(updatedSeats);

    // Cập nhật trạng thái ghế trong danh sách tất cả ghế
    const updatedAllSeats = seats.map(s => {
      if (s.id === seat.id) {
        return {
          ...s,
          status: seatExists ? "available" : "selected"
        };
      }
      return s;
    });

    setSeats(updatedAllSeats);
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế");
      return;
    }
    setCurrentStep(3); // Chuyển sang bước thanh toán
  };

  const handleCompleteBooking = () => {
    // Trong thực tế: Gửi thông tin đặt vé lên server
    // Giả lập đặt vé thành công
    alert("Đặt vé thành công!");
    navigate("/payment");
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#633B48]">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </main>
        <Footer />
        <BackToTop />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col bg-[#633B48]">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 text-center text-white">
          <h2 className="text-2xl">Không thể tải thông tin phim</h2>
          <Link to="/" className="mt-4 inline-block bg-[#e71a0f] text-white py-2 px-6 rounded-full hover:bg-red-700">
            Quay lại trang chủ
          </Link>
        </main>
        <Footer />
        <BackToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#633B48]">
      <Header />
      
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {/* Thanh tiến trình */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-white mb-2">
            <div className={`text-center ${currentStep >= 1 ? 'font-bold' : ''}`}>
              1. Chọn suất chiếu
            </div>
            <div className={`text-center ${currentStep >= 2 ? 'font-bold' : ''}`}>
              2. Chọn ghế
            </div>
            <div className={`text-center ${currentStep >= 3 ? 'font-bold' : ''}`}>
              3. Thanh toán
            </div>
          </div>
          <div className="h-2 bg-white bg-opacity-20 rounded-full">
            <div 
              className="h-full bg-[#e71a0f] rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Thông tin phim */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-full md:w-48 rounded-lg object-cover"
            />
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>
              {movie.duration && (
                <p className="mb-2">Thời lượng: {movie.duration} phút</p>
              )}
              <p>Ngày khởi chiếu: {new Date(movie.release_date).toLocaleDateString('vi-VN')}</p>
              
              {selectedShowtime && (
                <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg">
                  <p className="font-semibold">Suất chiếu đã chọn:</p>
                  <p>{formatDate(selectedShowtime.date)} - {selectedShowtime.time}</p>
                </div>
              )}
              
              {currentStep >= 2 && selectedSeats.length > 0 && (
                <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg">
                  <p className="font-semibold">Ghế đã chọn:</p>
                  <p>{selectedSeats.map(seat => seat.name).join(', ')}</p>
                  <p className="mt-2">Tổng tiền: {formatCurrency(calculateTotal())}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bước 1: Chọn suất chiếu */}
        {currentStep === 1 && (
          <div className="bg-white bg-opacity-10 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-6 text-white">Chọn suất chiếu</h2>
            
            {/* Nhóm suất chiếu theo ngày */}
            {Array.from(new Set(availableShowtimes.map(s => s.date))).map(date => (
              <div key={date} className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-white">{formatDate(date)}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {availableShowtimes
                    .filter(showtime => showtime.date === date)
                    .map(showtime => (
                      <button
                        key={showtime.id}
                        onClick={() => handleShowtimeSelect(showtime)}
                        className="bg-white bg-opacity-20 text-white py-3 px-4 rounded-lg hover:bg-[#e71a0f] transition-all duration-300"
                      >
                        {showtime.time}
                      </button>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Bước 2: Chọn ghế */}
        {currentStep === 2 && (
          <div className="bg-white bg-opacity-10 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-6 text-white">Chọn ghế</h2>
            
            {/* Màn hình */}
            <div className="relative w-full mb-10">
              <div className="h-5 bg-gradient-to-b from-white to-transparent opacity-50 rounded-t-3xl mx-auto w-3/4"></div>
              <div className="text-center text-white text-sm mt-2">Màn hình</div>
            </div>
            
            {/* Chú thích */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-md mr-2"></div>
                <span className="text-white text-sm">Ghế trống</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[#e71a0f] rounded-md mr-2"></div>
                <span className="text-white text-sm">Ghế đã chọn</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-500 rounded-md mr-2"></div>
                <span className="text-white text-sm">Ghế đã bán</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[#FFD700] bg-opacity-50 rounded-md mr-2"></div>
                <span className="text-white text-sm">Ghế VIP</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[#FF69B4] bg-opacity-50 rounded-md mr-2"></div>
                <span className="text-white text-sm">Ghế đôi</span>
              </div>
            </div>
            
            {/* Sơ đồ ghế */}
            <div className="grid grid-cols-10 gap-2 mb-8 max-w-4xl mx-auto">
              {seats.map(seat => (
                <button
                  key={seat.id}
                  onClick={() => handleSeatSelect(seat)}
                  disabled={seat.status === "booked"}
                  className={`
                    w-full h-10 rounded-md flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${seat.status === "booked" ? 'bg-gray-500 cursor-not-allowed' : ''}
                    ${seat.status === "selected" ? 'bg-[#e71a0f] text-white' : ''}
                    ${seat.status === "available" && seat.type === "standard" ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-40' : ''}
                    ${seat.status === "available" && seat.type === "vip" ? 'bg-[#FFD700] bg-opacity-50 text-white hover:bg-opacity-70' : ''}
                    ${seat.status === "available" && seat.type === "couple" ? 'bg-[#FF69B4] bg-opacity-50 text-white hover:bg-opacity-70' : ''}
                  `}
                >
                  {seat.name}
                </button>
              ))}
            </div>
            
            {/* Thông tin giá */}
            <div className="bg-white bg-opacity-5 p-4 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-3 text-white">Giá vé</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between">
                  <span className="text-white">Ghế thường:</span>
                  <span className="text-white font-semibold">{formatCurrency(100000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Ghế VIP:</span>
                  <span className="text-white font-semibold">{formatCurrency(130000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Ghế đôi:</span>
                  <span className="text-white font-semibold">{formatCurrency(150000)}</span>
                </div>
              </div>
            </div>
            
            {/* Tổng tiền và nút tiếp tục */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-white mb-4 sm:mb-0">
                <p>Đã chọn: <span className="font-semibold">{selectedSeats.length} ghế</span></p>
                <p className="text-xl font-bold">Tổng tiền: {formatCurrency(calculateTotal())}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCurrentStep(1)} 
                  className="bg-white bg-opacity-20 text-white py-2 px-6 rounded-full hover:bg-opacity-30 transition-all duration-300"
                >
                  Quay lại
                </button>
                <button 
                  onClick={handleProceedToPayment} 
                  className="bg-[#e71a0f] text-white py-2 px-6 rounded-full hover:bg-red-700 hover:scale-105 transition-all duration-300"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Bước 3: Thanh toán */}
        {currentStep === 3 && (
          <div className="bg-white bg-opacity-10 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-6 text-white">Thanh toán</h2>
            
            {/* Thông tin vé */}
            <div className="bg-white bg-opacity-5 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3 text-white">Chi tiết đặt vé</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-300">Phim:</p>
                  <p className="text-white font-semibold">{movie.title}</p>
                </div>
                <div>
                  <p className="text-gray-300">Suất chiếu:</p>
                  <p className="text-white font-semibold">
                    {formatDate(selectedShowtime?.date || '')} - {selectedShowtime?.time}
                  </p>
                </div>
                <div>
                  <p className="text-gray-300">Ghế:</p>
                  <p className="text-white font-semibold">{selectedSeats.map(seat => seat.name).join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-300">Số lượng:</p>
                  <p className="text-white font-semibold">{selectedSeats.length} ghế</p>
                </div>
              </div>
              <div className="border-t border-white border-opacity-20 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Tổng tiền:</span>
                  <span className="text-white text-xl font-bold">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
            
            {/* Phương thức thanh toán */}
            <div className="bg-white bg-opacity-5 p-4 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-3 text-white">Phương thức thanh toán</h3>
              <div className="space-y-4">
                <div className="flex items-center bg-white bg-opacity-10 p-3 rounded-lg cursor-pointer">
                  <input type="radio" id="momo" name="payment" className="mr-3" defaultChecked />
                  <label htmlFor="momo" className="text-white cursor-pointer flex items-center">
                    <div className="w-8 h-8 bg-[#d82d8b] rounded-md flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-xs">MoMo</span>
                    </div>
                    Ví MoMo
                  </label>
                </div>
                <div className="flex items-center bg-white bg-opacity-10 p-3 rounded-lg cursor-pointer">
                  <input type="radio" id="vnpay" name="payment" className="mr-3" />
                  <label htmlFor="vnpay" className="text-white cursor-pointer flex items-center">
                    <div className="w-8 h-8 bg-[#0066ff] rounded-md flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-xs">VN</span>
                    </div>
                    VnPay
                  </label>
                </div>
                <div className="flex items-center bg-white bg-opacity-10 p-3 rounded-lg cursor-pointer">
                  <input type="radio" id="credit" name="payment" className="mr-3" />
                  <label htmlFor="credit" className="text-white cursor-pointer flex items-center">
                    <div className="w-8 h-8 bg-[#ff9900] rounded-md flex items-center justify-center mr-2">
                      <span className="text-white text-sm">💳</span>
                    </div>
                    Thẻ tín dụng / Ghi nợ
                  </label>
                </div>
              </div>
            </div>
            
            {/* Nút hoàn tất đặt vé */}
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-white mb-4 sm:mb-0">
                <p className="text-xl font-bold">Tổng thanh toán: {formatCurrency(calculateTotal())}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCurrentStep(2)} 
                  className="bg-white bg-opacity-20 text-white py-2 px-6 rounded-full hover:bg-opacity-30 transition-all duration-300"
                >
                  Quay lại
                </button>
                <button 
                  onClick={handleCompleteBooking} 
                  className="bg-[#e71a0f] text-white py-2 px-6 rounded-full hover:bg-red-700 hover:scale-105 transition-all duration-300"
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Booking; 
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Steps, Button, Spin, Table, Modal, message } from "antd";
import Header from "../../components/header";
import Footer from "../../components/footer";
import axiosInstance from "../../utils/AxiosInstance";

const { Step } = Steps;

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
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [availableShowtimes, setAvailableShowtimes] = useState<Showtime[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/movie/${id}`);
        setMovie(response.data);
        setAvailableShowtimes(response.data.showtimes || []);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        message.error("Không thể tải thông tin phim.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    if (selectedShowtime) {
      const fetchSeats = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/api/seats/${selectedShowtime.id}`);
          setSeats(response.data);
        } catch (err) {
          console.error("Error fetching seats:", err);
          message.error("Không thể tải thông tin ghế.");
        } finally {
          setLoading(false);
        }
      };

      fetchSeats();
    }
  }, [selectedShowtime]);

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setCurrentStep(1);
  };

  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === "booked") return;

    const updatedSeats = selectedSeats.some((s) => s.id === seat.id)
      ? selectedSeats.filter((s) => s.id !== seat.id)
      : [...selectedSeats, seat];

    setSelectedSeats(updatedSeats);

    setSeats((prevSeats) =>
      prevSeats.map((s) =>
        s.id === seat.id
          ? { ...s, status: updatedSeats.some((sel) => sel.id === s.id) ? "selected" : "available" }
          : s
      )
    );
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      message.warning("Vui lòng chọn ít nhất một ghế.");
      return;
    }
    setCurrentStep(2);
  };

  const handleCompleteBooking = async () => {
    try {
      setLoading(true);
      await axiosInstance.post("/api/booking", {
        movieId: movie?._id,
        showtimeId: selectedShowtime?.id,
        seats: selectedSeats.map((seat) => seat.id),
      });
      message.success("Đặt vé thành công!");
      navigate("/payment");
    } catch (err) {
      console.error("Error completing booking:", err);
      message.error("Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => selectedSeats.reduce((total, seat) => total + seat.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#633B48]">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 flex justify-center items-center">
          <Spin size="large" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col bg-[#633B48]">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 text-center text-white">
          <h2 className="text-2xl">Không thể tải thông tin phim</h2>
          <Button type="primary" onClick={() => navigate("/")}>
            Quay lại trang chủ
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const seatColumns = [
    {
      title: "Ghế",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        switch (type) {
          case "vip":
            return "VIP";
          case "couple":
            return "Couple";
          default:
            return "Standard";
        }
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status === "booked" ? (
          <span style={{ color: "red" }}>Đã đặt</span>
        ) : status === "selected" ? (
          <span style={{ color: "green" }}>Đã chọn</span>
        ) : (
          <span style={{ color: "blue" }}>Còn trống</span>
        ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#633B48]">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Steps current={currentStep} className="mb-8">
          <Step title="Chọn suất chiếu" />
          <Step title="Chọn ghế" />
          <Step title="Thanh toán" />
        </Steps>

        {currentStep === 0 && (
          <div>
            <h2 className="text-2xl text-white mb-4">Chọn suất chiếu</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableShowtimes.map((showtime) => (
                <Button
                  key={showtime.id}
                  type="primary"
                  onClick={() => handleShowtimeSelect(showtime)}
                >
                  {`${showtime.date} - ${showtime.time}`}
                </Button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl text-white mb-4">Chọn ghế</h2>
            <Table
              dataSource={seats}
              columns={seatColumns}
              rowKey="id"
              pagination={false}
              onRow={(record) => ({
                onClick: () => handleSeatSelect(record),
              })}
            />
            <div className="mt-4 flex justify-between">
              <Button onClick={() => setCurrentStep(0)}>Quay lại</Button>
              <Button type="primary" onClick={handleProceedToPayment}>
                Tiếp tục
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl text-white mb-4">Xác nhận thanh toán</h2>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-lg font-bold">Phim: {movie.title}</h3>
              <p>Suất chiếu: {selectedShowtime?.date} - {selectedShowtime?.time}</p>
              <p>Tổng tiền: {calculateTotal().toLocaleString()} VND</p>
            </div>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => setCurrentStep(1)}>Quay lại</Button>
              <Button type="primary" onClick={handleCompleteBooking}>
                Thanh toán
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
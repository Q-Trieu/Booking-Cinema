import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import BackToTop from "../../components/UI/BackToTop";

interface Theater {
  id: string;
  name: string;
  address: string;
  image: string;
  facilities: string[];
}

const Theaters: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const theatersPerPage = 6;

  useEffect(() => {
    // Giả định dữ liệu rạp
    const sampleTheaters: Theater[] = [
      {
        id: "1",
        name: "My Cinema Quận 1",
        address: "123 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
        image: "https://i.imgur.com/7oHGh0J.jpg",
        facilities: ["IMAX", "4DX", "Dolby Atmos", "VIP Lounge"]
      },
      {
        id: "2",
        name: "My Cinema Quận 7",
        address: "456 Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh",
        image: "https://i.imgur.com/LWYRcMY.jpg",
        facilities: ["SCREENX", "Dolby Atmos", "Rạp đôi"]
      },
      {
        id: "3",
        name: "My Cinema Thủ Đức",
        address: "789 Xa lộ Hà Nội, TP. Thủ Đức, TP. Hồ Chí Minh",
        image: "https://i.imgur.com/D23JyQ1.jpg",
        facilities: ["RealD 3D", "Ghế Premium", "Phòng trò chơi"]
      },
      {
        id: "4",
        name: "My Cinema Hà Nội",
        address: "101 Cầu Giấy, Quận Cầu Giấy, Hà Nội",
        image: "https://i.imgur.com/F5KyIJ0.jpg",
        facilities: ["IMAX", "Dolby Atmos", "Sảnh VIP"]
      },
      {
        id: "5",
        name: "My Cinema Đà Nẵng",
        address: "202 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng",
        image: "https://i.imgur.com/0Q7XnPD.jpg",
        facilities: ["4DX", "RealD 3D", "Lounge Bar"]
      },
      {
        id: "6",
        name: "My Cinema Cần Thơ",
        address: "303 Nguyễn Văn Cừ, Quận Ninh Kiều, Cần Thơ",
        image: "https://i.imgur.com/X8OcMXS.jpg",
        facilities: ["RealD 3D", "Phòng chiếu Premium", "Cafe"]
      },
      {
        id: "7",
        name: "My Cinema Nha Trang",
        address: "404 Trần Phú, TP. Nha Trang, Khánh Hòa",
        image: "https://i.imgur.com/TgWGxRU.jpg",
        facilities: ["Dolby Atmos", "Ghế Couple", "Khu ẩm thực"]
      },
      {
        id: "8",
        name: "My Cinema Vũng Tàu",
        address: "505 Lê Hồng Phong, TP. Vũng Tàu, Bà Rịa-Vũng Tàu",
        image: "https://i.imgur.com/pzLJbS5.jpg",
        facilities: ["SCREENX", "Dolby Atmos", "Self-service kiosk"]
      },
      {
        id: "9",
        name: "My Cinema Hải Phòng",
        address: "606 Lê Thánh Tông, Quận Ngô Quyền, Hải Phòng",
        image: "https://i.imgur.com/FqWHRRb.jpg",
        facilities: ["4DX", "Khu vui chơi trẻ em", "Buffet popcorn"]
      },
    ];

    setTimeout(() => {
      setTheaters(sampleTheaters);
      setLoading(false);
    }, 800); // Giả lập thời gian tải
  }, []);

  // Tính toán phân trang
  const indexOfLastTheater = currentPage * theatersPerPage;
  const indexOfFirstTheater = indexOfLastTheater - theatersPerPage;
  const currentTheaters = theaters.slice(indexOfFirstTheater, indexOfLastTheater);
  const totalPages = Math.ceil(theaters.length / theatersPerPage);

  // Xử lý chuyển trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    }
  };

  const paginationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.3, duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#633B48]">
      <Header />
      
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Hệ Thống Rạp Chiếu Phim</h1>
          <p className="text-center text-gray-300 max-w-3xl mx-auto">
            Khám phá hệ thống rạp chiếu phim hiện đại với công nghệ âm thanh và hình ảnh tuyệt vời. 
            Chọn rạp gần bạn nhất để có trải nghiệm xem phim tốt nhất.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-bounce w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
          </div>
        ) : (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentTheaters.map((theater) => (
                <motion.div 
                  key={theater.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="bg-white bg-opacity-10 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={theater.image} 
                      alt={theater.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h2 className="text-xl font-bold text-white">{theater.name}</h2>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-300 mb-3">
                      <svg className="w-5 h-5 inline-block mr-2 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {theater.address}
                    </p>
                    
                    <div className="mb-3">
                      <h3 className="text-white font-semibold mb-2">Tiện ích:</h3>
                      <div className="flex flex-wrap gap-2">
                        {theater.facilities.map((facility, index) => (
                          <span key={index} className="px-2 py-1 bg-[#e71a0f] bg-opacity-60 text-white text-xs rounded-full">
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full mt-2 bg-[#e71a0f] text-white py-2 rounded-lg transition-all duration-300 hover:bg-red-700 hover:shadow-lg focus:outline-none">
                      Xem Lịch Chiếu
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Phân trang */}
            {theaters.length > theatersPerPage && (
              <motion.div 
                className="flex justify-center mt-10"
                variants={paginationVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-lg">
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className={`px-4 py-2 transition-colors duration-300 focus:outline-none ${
                      currentPage === 1 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-white hover:bg-[#e71a0f]'
                    }`}
                    aria-label="Trang trước"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 transition-colors duration-300 focus:outline-none ${
                        currentPage === number
                          ? 'bg-[#e71a0f] text-white'
                          : 'text-white hover:bg-[#e71a0f] hover:bg-opacity-70'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 transition-colors duration-300 focus:outline-none ${
                      currentPage === totalPages 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-white hover:bg-[#e71a0f]'
                    }`}
                    aria-label="Trang sau"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Theaters; 
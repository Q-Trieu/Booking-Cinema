import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import BackToTop from "../../components/UI/BackToTop";

interface Movie {
  id: string;
  title: string;
  poster: string;
  releaseDate: string;
  duration: string;
  genre: string[];
  rating: number;
  isUpcoming: boolean;
}

const Movies: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"now" | "upcoming">("now");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const moviesPerPage = 10;

  useEffect(() => {
    // Giả định dữ liệu phim
    const sampleMovies: Movie[] = [
      {
        id: "1",
        title: "Avatar: Dòng Chảy Của Nước",
        poster: "https://i.imgur.com/QmGPrY5.jpg",
        releaseDate: "16/12/2022",
        duration: "192 phút",
        genre: ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"],
        rating: 4.5,
        isUpcoming: false
      },
      {
        id: "2",
        title: "Black Panther: Wakanda Mãi Mãi",
        poster: "https://i.imgur.com/QDvJ8WR.jpg",
        releaseDate: "11/11/2022",
        duration: "161 phút",
        genre: ["Hành động", "Phiêu lưu", "Siêu anh hùng"],
        rating: 4.3,
        isUpcoming: false
      },
      {
        id: "3",
        title: "Top Gun: Maverick",
        poster: "https://i.imgur.com/0EI65lK.jpg",
        releaseDate: "27/05/2022",
        duration: "130 phút",
        genre: ["Hành động", "Kịch tính"],
        rating: 4.7,
        isUpcoming: false
      },
      {
        id: "4",
        title: "Người Nhện: Không Còn Nhà",
        poster: "https://i.imgur.com/QImB5MU.jpg",
        releaseDate: "17/12/2021",
        duration: "148 phút",
        genre: ["Hành động", "Phiêu lưu", "Siêu anh hùng"],
        rating: 4.6,
        isUpcoming: false
      },
      {
        id: "5",
        title: "Fast X",
        poster: "https://i.imgur.com/CSr0k0n.jpg",
        releaseDate: "19/05/2023",
        duration: "141 phút",
        genre: ["Hành động", "Tội phạm", "Phiêu lưu"],
        rating: 4.0,
        isUpcoming: false
      },
      {
        id: "6",
        title: "Mission: Impossible – Nghiệp Vụ Bất Khả Thi",
        poster: "https://i.imgur.com/PVNPVsv.jpg",
        releaseDate: "12/07/2023",
        duration: "163 phút",
        genre: ["Hành động", "Phiêu lưu", "Điệp viên"],
        rating: 4.4,
        isUpcoming: false
      },
      {
        id: "7",
        title: "Deadpool 3",
        poster: "https://i.imgur.com/QPuuhg4.jpg",
        releaseDate: "26/07/2024",
        duration: "Chưa xác định",
        genre: ["Hành động", "Siêu anh hùng", "Hài hước"],
        rating: 4.8,
        isUpcoming: true
      },
      {
        id: "8",
        title: "John Wick: Chapter 5",
        poster: "https://i.imgur.com/QSJaesJ.jpg",
        releaseDate: "23/05/2025",
        duration: "Chưa xác định",
        genre: ["Hành động", "Tội phạm", "Thriller"],
        rating: 4.6,
        isUpcoming: true
      },
      {
        id: "9",
        title: "Avengers: The Kang Dynasty",
        poster: "https://i.imgur.com/SU9rS9L.jpg",
        releaseDate: "02/05/2025",
        duration: "Chưa xác định",
        genre: ["Hành động", "Phiêu lưu", "Siêu anh hùng"],
        rating: 4.7,
        isUpcoming: true
      },
      {
        id: "10",
        title: "The Batman 2",
        poster: "https://i.imgur.com/3pN1vFi.jpg",
        releaseDate: "03/10/2025",
        duration: "Chưa xác định",
        genre: ["Hành động", "Tội phạm", "Siêu anh hùng"],
        rating: 4.5,
        isUpcoming: true
      }
    ];

    setTimeout(() => {
      setMovies(sampleMovies);
      setLoading(false);
    }, 800); // Giả lập thời gian tải
  }, []);

  // Lọc phim dựa trên tab đang hoạt động
  const filteredMovies = movies.filter(movie => 
    activeTab === "now" ? !movie.isUpcoming : movie.isUpcoming
  );

  // Tính toán số trang
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  
  // Lấy phim cho trang hiện tại
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

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
        stiffness: 100,
        damping: 12
      }
    }
  };

  const tabVariants = {
    inactive: { borderBottom: "2px solid transparent" },
    active: { 
      borderBottom: "2px solid #e71a0f",
      transition: { duration: 0.3 }
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
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Danh Sách Phim</h1>
          <p className="text-center text-gray-300 max-w-3xl mx-auto">
            Khám phá các bộ phim đang chiếu và sắp chiếu tại hệ thống rạp My Cinema. 
            Đặt vé ngay để có trải nghiệm xem phim tốt nhất!
          </p>
        </motion.div>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex border-b border-gray-600 w-full max-w-md justify-between">
            <motion.button
              variants={tabVariants}
              animate={activeTab === "now" ? "active" : "inactive"}
              onClick={() => {
                setActiveTab("now");
                setCurrentPage(1);
              }}
              className={`px-6 py-3 text-lg font-medium ${
                activeTab === "now" ? "text-white" : "text-gray-400"
              } transition-colors duration-300 focus:outline-none`}
            >
              Phim Đang Chiếu
            </motion.button>
            
            <motion.button
              variants={tabVariants}
              animate={activeTab === "upcoming" ? "active" : "inactive"}
              onClick={() => {
                setActiveTab("upcoming");
                setCurrentPage(1);
              }}
              className={`px-6 py-3 text-lg font-medium ${
                activeTab === "upcoming" ? "text-white" : "text-gray-400"
              } transition-colors duration-300 focus:outline-none`}
            >
              Phim Sắp Chiếu
            </motion.button>
          </div>
        </div>
        
        {/* Movie grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-bounce w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              >
                {currentMovies.map((movie) => (
                  <motion.div 
                    key={movie.id}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    className="bg-white bg-opacity-10 rounded-lg overflow-hidden transition-all duration-300"
                  >
                    <div className="relative">
                      <Link to={`/movie-details/${movie.id}`}>
                        <img 
                          src={movie.poster} 
                          alt={movie.title} 
                          className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {movie.isUpcoming && (
                          <div className="absolute top-3 right-3 bg-[#e71a0f] text-white px-2 py-1 rounded text-xs font-bold">
                            SẮP CHIẾU
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 hover:opacity-30 transition-opacity duration-300"></div>
                      </Link>
                    </div>
                    
                    <div className="p-4">
                      <Link to={`/movie-details/${movie.id}`}>
                        <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-[#e71a0f] transition-colors duration-300">
                          {movie.title}
                        </h2>
                      </Link>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="text-white ml-1">{movie.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-300 text-sm">{movie.duration}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {movie.genre.slice(0, 2).map((genre, index) => (
                          <span key={index} className="px-2 py-1 bg-[#e71a0f] bg-opacity-40 text-white text-xs rounded-full">
                            {genre}
                          </span>
                        ))}
                        {movie.genre.length > 2 && (
                          <span className="px-2 py-1 bg-gray-700 bg-opacity-40 text-white text-xs rounded-full">
                            +{movie.genre.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{movie.releaseDate}</span>
                        {!movie.isUpcoming ? (
                          <Link to={`/booking/${movie.id}`}>
                            <button className="bg-[#e71a0f] text-white px-3 py-1 rounded transition-all duration-300 hover:bg-red-700 hover:shadow-lg focus:outline-none text-sm">
                              Đặt Vé
                            </button>
                          </Link>
                        ) : (
                          <button className="bg-gray-600 text-white px-3 py-1 rounded transition-all duration-300 hover:bg-gray-700 focus:outline-none text-sm">
                            Thông Báo
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {filteredMovies.length > moviesPerPage && (
                <motion.div 
                  className="flex justify-center mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
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
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Movies; 
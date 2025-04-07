import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import axiosInstance from "../../api/axios";
import BackToTop from "../../components/UI/BackToTop";

interface Movie {
  _id: string;
  title: string;
  description: string;
  poster: string;
  release_date: string;
  director?: string;
  cast?: string[];
  duration?: number; // Thời lượng phim (phút)
  genre?: string[];
  rating?: number; // Đánh giá (1-5)
  trailer_url?: string;
}

interface Comment {
  user: string;
  content: string;
  rating: number;
  date: Date;
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userComment, setUserComment] = useState<string>("");
  const [userRating, setUserRating] = useState<number>(5);

  // Dữ liệu phim mẫu khi API không hoạt động
  const sampleMovie: Movie = {
    _id: id || "1",
    title: "[RE-RUN 39K] EXHUMA: QUẬT MỘ TRÙNG MA",
    description: "Phim kinh dị siêu nhiên đầy kịch tính. Một nhóm người khám phá một ngôi mộ cổ và giải phóng một thực thể ma quỷ...",
    poster: "https://i.imgur.com/FHOtPWc.jpg",
    release_date: "2024-03-24",
    director: "Jang Jae-hyun",
    cast: ["Choi Min-sik", "Kim Go-eun", "Yoo Hae-jin", "Lee Do-hyun"],
    duration: 133,
    genre: ["Thriller", "Criminal", "Horror"],
    rating: 8.5,
    trailer_url: "https://www.youtube.com/embed/BnK_0_wSa3A"
  };

  // Bình luận mẫu khi API không hoạt động
  const sampleComments: Comment[] = [
    {
      user: "Nguyễn Văn A",
      content: "Phim hay quá, diễn viên đóng rất tốt!",
      rating: 5,
      date: new Date("2024-03-25")
    },
    {
      user: "Trần Thị B",
      content: "Cảnh quay đẹp, âm thanh sống động, nhưng cốt truyện hơi khó hiểu.",
      rating: 4,
      date: new Date("2024-03-26")
    },
    {
      user: "Lê Văn C",
      content: "Phim đáng xem, nhưng hơi dài.",
      rating: 3,
      date: new Date("2024-03-27")
    }
  ];

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        // Thay đường dẫn API phù hợp
        const response = await axiosInstance.get(`/api/movie/${id}`);
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Không thể lấy thông tin phim:", err);
        // Sử dụng dữ liệu mẫu khi không kết nối được API
        setMovie(sampleMovie);
        setComments(sampleComments);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userComment.trim()) return;
    
    // Trong thực tế, gửi bình luận đến API
    // Tạm thời thêm bình luận vào state
    const newComment: Comment = {
      user: "Bạn",
      content: userComment,
      rating: userRating,
      date: new Date()
    };
    
    setComments([newComment, ...comments]);
    setUserComment("");
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
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
        {/* Banner phim */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-8">
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center mb-4">
              {movie.rating && renderStars(Math.round(movie.rating / 2))}
              <span className="ml-2">{movie.rating?.toFixed(1)}/10</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre?.map((genre, index) => (
                <span key={index} className="bg-[#e71a0f] px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
            <Link 
              to={`/booking/${movie._id}`} 
              className="bg-[#e71a0f] text-white py-2 px-6 rounded-full transition-all duration-300 hover:bg-red-700 hover:scale-105 hover:shadow-lg inline-block"
            >
              Đặt Vé Ngay
            </Link>
          </div>
        </div>

        {/* Thông tin chi tiết và trailer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white bg-opacity-10 p-6 rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Nội dung phim</h2>
            <p className="mb-6">{movie.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Đạo diễn</h3>
                <p>{movie.director || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Thời lượng</h3>
                <p>{movie.duration ? `${movie.duration} phút` : "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Ngày khởi chiếu</h3>
                <p>{new Date(movie.release_date).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Thể loại</h3>
                <p>{movie.genre?.join(", ") || "Chưa cập nhật"}</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Diễn viên</h3>
            <p className="mb-6">{movie.cast?.join(", ") || "Chưa cập nhật"}</p>
          </div>

          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">Trailer</h2>
            {movie.trailer_url ? (
              <div className="aspect-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={movie.trailer_url} 
                  title={`${movie.title} trailer`}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center text-white">
                Trailer chưa cập nhật
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4 text-white">Suất chiếu gần nhất</h3>
              <div className="grid grid-cols-3 gap-2">
                <button className="bg-white bg-opacity-20 text-white py-2 rounded-lg hover:bg-opacity-30 transition-all">
                  13:30
                </button>
                <button className="bg-white bg-opacity-20 text-white py-2 rounded-lg hover:bg-opacity-30 transition-all">
                  15:45
                </button>
                <button className="bg-white bg-opacity-20 text-white py-2 rounded-lg hover:bg-opacity-30 transition-all">
                  18:00
                </button>
                <button className="bg-white bg-opacity-20 text-white py-2 rounded-lg hover:bg-opacity-30 transition-all">
                  20:15
                </button>
                <button className="bg-white bg-opacity-20 text-white py-2 rounded-lg hover:bg-opacity-30 transition-all">
                  22:30
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Phần bình luận */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Bình luận</h2>
          
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <label className="block text-white mb-2">Đánh giá của bạn</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="text-3xl focus:outline-none"
                  >
                    <span className={star <= userRating ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                  </button>
                ))}
              </div>
            </div>
            
            <textarea
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Nhập bình luận của bạn..."
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
            ></textarea>
            
            <button 
              type="submit" 
              className="mt-4 bg-[#e71a0f] text-white py-2 px-6 rounded-full transition-all duration-300 hover:bg-red-700 hover:scale-105"
            >
              Gửi bình luận
            </button>
          </form>
          
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <div key={index} className="bg-white bg-opacity-5 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{comment.user}</h3>
                  <div className="flex">
                    {renderStars(comment.rating)}
                  </div>
                </div>
                <p className="text-gray-200 mb-2">{comment.content}</p>
                <p className="text-gray-400 text-sm">
                  {comment.date.toLocaleDateString('vi-VN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default MovieDetails; 
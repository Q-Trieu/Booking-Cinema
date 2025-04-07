import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import BackToTop from "../../components/UI/BackToTop";

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  validUntil: string;
  code: string;
  discount: string;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedPromotion, setExpandedPromotion] = useState<string | null>(null);

  useEffect(() => {
    // Giả định dữ liệu khuyến mãi
    const samplePromotions: Promotion[] = [
      {
        id: "1",
        title: "Ưu đãi sinh nhật",
        description: "Nhận ngay 1 vé xem phim MIỄN PHÍ trong tháng sinh nhật của bạn. Áp dụng cho tất cả các hạng thành viên. Xuất trình CCCD hoặc giấy tờ tùy thân có thông tin ngày sinh khi đến quầy để nhận ưu đãi.",
        image: "https://i.imgur.com/X6BtZnb.jpg",
        validUntil: "31/12/2024",
        code: "HPBD2024",
        discount: "100%"
      },
      {
        id: "2",
        title: "Ưu đãi thành viên mới",
        description: "Đăng ký thành viên mới, nhận ngay ưu đãi giảm 50% cho lần mua vé đầu tiên. Ưu đãi áp dụng cho tất cả các suất chiếu từ thứ 2 đến thứ 6 (trừ ngày lễ).",
        image: "https://i.imgur.com/LgY2rRH.jpg",
        validUntil: "30/06/2024",
        code: "NEWMEMBER50",
        discount: "50%"
      },
      {
        id: "3",
        title: "Combo đôi tiết kiệm",
        description: "Combo dành cho 2 người bao gồm 2 vé xem phim, 1 bắp lớn và 2 nước lớn với giá chỉ 249.000đ. Áp dụng cho tất cả các suất chiếu hàng ngày.",
        image: "https://i.imgur.com/WqKbMES.jpg",
        validUntil: "31/08/2024",
        code: "COUPLE249",
        discount: "Tiết kiệm 30%"
      },
      {
        id: "4",
        title: "Ưu đãi thanh toán VNPay",
        description: "Giảm ngay 20.000đ khi thanh toán bằng VNPay-QR cho hóa đơn từ 100.000đ trở lên. Mỗi khách hàng được áp dụng tối đa 1 lần/tháng.",
        image: "https://i.imgur.com/RJpKAl9.jpg",
        validUntil: "30/09/2024",
        code: "VNPAY20K",
        discount: "20.000đ"
      },
      {
        id: "5",
        title: "Thứ 3 vui vẻ",
        description: "Đồng giá vé chỉ 50.000đ cho tất cả các suất chiếu vào thứ 3 hàng tuần. Không áp dụng cho các suất chiếu đặc biệt, phim 3D và ghế VIP/Premium.",
        image: "https://i.imgur.com/bCQYCIr.jpg",
        validUntil: "31/12/2024",
        code: "HAPPY_TUESDAY",
        discount: "Đồng giá 50.000đ"
      },
      {
        id: "6",
        title: "Ưu đãi học sinh, sinh viên",
        description: "Giảm 20% giá vé cho học sinh, sinh viên vào các ngày trong tuần (từ thứ 2 đến thứ 6, trừ ngày lễ). Vui lòng xuất trình thẻ học sinh, sinh viên khi mua vé.",
        image: "https://i.imgur.com/3eGWJfC.jpg",
        validUntil: "31/12/2024",
        code: "STUDENT20",
        discount: "20%"
      }
    ];

    setTimeout(() => {
      setPromotions(samplePromotions);
      setLoading(false);
    }, 800); // Giả lập thời gian tải
  }, []);

  const toggleExpand = (id: string) => {
    if (expandedPromotion === id) {
      setExpandedPromotion(null);
    } else {
      setExpandedPromotion(id);
    }
  };

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
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Chương Trình Khuyến Mãi</h1>
          <p className="text-center text-gray-300 max-w-3xl mx-auto">
            Khám phá các ưu đãi độc quyền và chương trình khuyến mãi hấp dẫn tại My Cinema. 
            Đừng bỏ lỡ cơ hội tiết kiệm và nhận được nhiều phần quà giá trị!
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
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {promotions.map((promotion) => (
              <motion.div 
                key={promotion.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="bg-white bg-opacity-10 rounded-lg overflow-hidden transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={promotion.image} 
                    alt={promotion.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h2 className="text-xl font-bold text-white">{promotion.title}</h2>
                    <div className="flex items-center mt-1">
                      <span className="bg-[#e71a0f] text-white text-xs px-2 py-1 rounded-full">
                        {promotion.discount}
                      </span>
                      <span className="text-white text-xs ml-2">
                        Có hiệu lực đến: {promotion.validUntil}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className={`text-gray-300 mb-4 overflow-hidden transition-all duration-300 ${
                    expandedPromotion === promotion.id ? 'max-h-96' : 'max-h-24'
                  }`}>
                    <p>{promotion.description}</p>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <div className="bg-gray-800 bg-opacity-40 p-3 rounded flex justify-between items-center">
                      <span className="text-white font-semibold">Mã khuyến mãi:</span>
                      <span className="bg-[#e71a0f] text-white px-3 py-1 rounded font-mono">{promotion.code}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleExpand(promotion.id)}
                        className="flex-1 bg-gray-700 text-white py-2 rounded-lg transition-all duration-300 hover:bg-gray-600 hover:shadow-lg focus:outline-none"
                      >
                        {expandedPromotion === promotion.id ? 'Thu gọn' : 'Xem thêm'}
                      </button>
                      <button className="flex-1 bg-[#e71a0f] text-white py-2 rounded-lg transition-all duration-300 hover:bg-red-700 hover:shadow-lg focus:outline-none">
                        Sử dụng ngay
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Promotions; 
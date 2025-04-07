import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import BackToTop from "../../components/UI/BackToTop";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Vui lòng chọn chủ đề";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung";
    } else if (formData.message.length < 20) {
      newErrors.message = "Nội dung quá ngắn (tối thiểu 20 ký tự)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }, 1500);
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
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-center text-gray-300 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe ý kiến và giải đáp mọi thắc mắc của bạn.
            Hãy để lại thông tin liên hệ và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thông tin liên hệ */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-1"
          >
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-6">Thông Tin Liên Hệ</h2>
              
              <motion.div variants={itemVariants} className="flex items-start mb-6">
                <div className="text-[#e71a0f] mr-4">
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Điện Thoại</h3>
                  <p className="text-gray-300 mt-1">1900 6969</p>
                  <p className="text-gray-300">+84 28 3822 8888</p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-start mb-6">
                <div className="text-[#e71a0f] mr-4">
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-gray-300 mt-1">info@mycinema.vn</p>
                  <p className="text-gray-300">support@mycinema.vn</p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-start mb-6">
                <div className="text-[#e71a0f] mr-4">
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Trụ Sở Chính</h3>
                  <p className="text-gray-300 mt-1">
                    Tầng 12, Tòa nhà TNR Tower, 180-192 Nguyễn Công Trứ, Quận 1, TP. Hồ Chí Minh
                  </p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-start">
                <div className="text-[#e71a0f] mr-4">
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Giờ Làm Việc</h3>
                  <p className="text-gray-300 mt-1">Thứ Hai - Thứ Sáu: 8:00 - 17:30</p>
                  <p className="text-gray-300">Thứ Bảy: 8:00 - 12:00</p>
                </div>
              </motion.div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-white mb-3">Kết Nối Với Chúng Tôi</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-white hover:text-[#e71a0f] transition-colors duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.3,5.71a8.21,8.21,0,0,0-11.58,0A8.14,8.14,0,0,0,5,12a8.27,8.27,0,0,0,2.72,6.29A8.2,8.2,0,0,0,12,20.91a8.2,8.2,0,0,0,4.28-1.62A8.27,8.27,0,0,0,19,13.09,8.14,8.14,0,0,0,18.3,5.71ZM15.66,17A6.34,6.34,0,0,1,12,18.09,6.34,6.34,0,0,1,8.34,17a6.2,6.2,0,0,1-2-2,6.2,6.2,0,0,1-.49-2.43,6.14,6.14,0,0,1,.49-2.43,6.2,6.2,0,0,1,2-2A6.34,6.34,0,0,1,12,6.91,6.34,6.34,0,0,1,15.66,8a6.2,6.2,0,0,1,2,2,6.14,6.14,0,0,1,.49,2.43,6.2,6.2,0,0,1-.49,2.43A6.2,6.2,0,0,1,15.66,17ZM12.16,10h2V8h-2V6h-2V8h-2v2h2v4h2Z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-[#e71a0f] transition-colors duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.82,4.26a10.14,10.14,0,0,0-.53,1.1,14.66,14.66,0,0,0-4.58,0,10.14,10.14,0,0,0-.53-1.1,16,16,0,0,0-4.13,1.3,17.33,17.33,0,0,0-3,11.59,16.6,16.6,0,0,0,5.07,2.59A12.89,12.89,0,0,0,8.23,18a9.65,9.65,0,0,1-1.71-.83,3.39,3.39,0,0,0,.42-.33,11.66,11.66,0,0,0,10.12,0q.21.18.42.33a10.84,10.84,0,0,1-1.71.84,12.41,12.41,0,0,0,1.08,1.78,16.44,16.44,0,0,0,5.06-2.59,17.22,17.22,0,0,0-3-11.59A16.09,16.09,0,0,0,14.82,4.26Z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-[#e71a0f] transition-colors duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46,6c-.77.35-1.6.58-2.46.69.88-.53,1.56-1.37,1.88-2.38-.83.5-1.75.85-2.72,1.05C18.37,4.5,17.26,4,16,4c-2.35,0-4.27,1.92-4.27,4.29,0,.34.04.67.11.98C8.28,9.09,5.11,7.38,3,4.79c-.37.63-.58,1.37-.58,2.15,0,1.49.75,2.81,1.91,3.56-.71,0-1.37-.2-1.95-.5v.03c0,2.08,1.48,3.82,3.44,4.21a4.22,4.22,0,0,1-1.93.07,4.28,4.28,0,0,0,4,2.98,8.521,8.521,0,0,1-5.33,1.84c-.34,0-.68-.02-1.02-.06C3.44,20.29,5.7,21,8.12,21,16,21,20.33,14.46,20.33,8.79c0-.19,0-.37-.01-.56.84-.6,1.56-1.36,2.14-2.23Z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-[#e71a0f] transition-colors duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2.2c3.2,0,3.6,0,4.8.1,3.3.1,4.8,1.7,4.9,4.9.1,1.3.1,1.6.1,4.8s0,3.6-.1,4.8c-.1,3.2-1.7,4.8-4.9,4.9-1.3.1-1.6.1-4.8.1s-3.6,0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2,1.7-4.8,4.9-4.9,1.2-.1,1.6-.1,4.8-.1ZM12,0C8.7,0,8.3,0,7.1.1,2.7.3.3,2.7.1,7.1,0,8.3,0,8.7,0,12s0,3.7.1,4.9c.2,4.4,2.6,6.8,7,7,1.2.1,1.6.1,4.9.1s3.7,0,4.9-.1c4.4-.2,6.8-2.6,7-7,.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7,0,15.3,0,12,0Zm0,5.8c-3.4,0-6.2,2.8-6.2,6.2s2.8,6.2,6.2,6.2,6.2-2.8,6.2-6.2S15.4,5.8,12,5.8Zm0,10.2c-2.2,0-4-1.8-4-4s1.8-4,4-4,4,1.8,4,4S14.2,16,12,16ZM16.8,4.2c-.8,0-1.4.6-1.4,1.4s.6,1.4,1.4,1.4,1.4-.6,1.4-1.4S17.6,4.2,16.8,4.2Z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Form liên hệ */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-2"
          >
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-6">Gửi Thông Tin Liên Hệ</h2>
              
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500 bg-opacity-20 border border-green-500 text-green-100 px-4 py-3 rounded relative mb-6"
                >
                  <strong className="font-bold">Gửi thành công!</strong>
                  <span className="block sm:inline"> Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <motion.div variants={itemVariants}>
                      <label htmlFor="name" className="block text-gray-300 mb-1">Họ và tên *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-black bg-opacity-20 border ${
                          errors.name ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg text-white focus:outline-none focus:border-[#e71a0f] transition-colors duration-300`}
                        placeholder="Nhập họ và tên"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <label htmlFor="email" className="block text-gray-300 mb-1">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-black bg-opacity-20 border ${
                          errors.email ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg text-white focus:outline-none focus:border-[#e71a0f] transition-colors duration-300`}
                        placeholder="Nhập địa chỉ email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <motion.div variants={itemVariants}>
                      <label htmlFor="phone" className="block text-gray-300 mb-1">Số điện thoại *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-black bg-opacity-20 border ${
                          errors.phone ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg text-white focus:outline-none focus:border-[#e71a0f] transition-colors duration-300`}
                        placeholder="Nhập số điện thoại"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <label htmlFor="subject" className="block text-gray-300 mb-1">Chủ đề *</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-black bg-opacity-20 border ${
                          errors.subject ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg text-white focus:outline-none focus:border-[#e71a0f] transition-colors duration-300`}
                      >
                        <option value="" disabled>Chọn chủ đề</option>
                        <option value="general">Thông tin chung</option>
                        <option value="booking">Đặt vé / Hoàn vé</option>
                        <option value="complaint">Khiếu nại</option>
                        <option value="feedback">Góp ý</option>
                        <option value="business">Hợp tác kinh doanh</option>
                        <option value="other">Khác</option>
                      </select>
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                      )}
                    </motion.div>
                  </div>
                  
                  <motion.div variants={itemVariants} className="mb-6">
                    <label htmlFor="message" className="block text-gray-300 mb-1">Nội dung *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-2 bg-black bg-opacity-20 border ${
                        errors.message ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white focus:outline-none focus:border-[#e71a0f] transition-colors duration-300`}
                      placeholder="Nhập nội dung tin nhắn"
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                    )}
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-[#e71a0f] text-white py-3 rounded-lg transition-all duration-300 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700 hover:shadow-lg'
                      } focus:outline-none`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang gửi...
                        </span>
                      ) : (
                        'Gửi Tin Nhắn'
                      )}
                    </button>
                  </motion.div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Google Map */}
        <div className="mt-8">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-6">Bản Đồ</h2>
            <div className="rounded-lg overflow-hidden h-96">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.70126231542337!3d10.777057362130542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb9972!2sTNR%20Tower!5e0!3m2!1svi!2s!4v1651136176944!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Contact; 
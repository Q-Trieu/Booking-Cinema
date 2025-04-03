import axios from 'axios';

const api = axios.create({
  // Dùng biến môi trường của Vite để set baseURL.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// (Tùy chọn) Request interceptor: thêm token hoặc log request nếu cần
api.interceptors.request.use(
  (config) => {
    // Ví dụ: thêm header xác thực nếu cần
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log('Request:', config);
    return config;
  },
  (error) => Promise.reject(error)
);

// (Tùy chọn) Response interceptor: xử lý lỗi toàn cục
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

export default api;

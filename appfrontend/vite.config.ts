import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Địa chỉ của backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Loại bỏ prefix '/api' nếu cần
      }
    }
  }
});
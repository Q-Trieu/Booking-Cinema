import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/auth/sign-up', {
        full_name: fullName,
        email,
        phone: phoneNumber,
        password,
      });

      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Đăng ký thất bại');
      }
      setSuccessMessage('');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('/api/auth/google-login');
      window.location.href = response.data.redirect_url;
    } catch {
      setErrorMessage('Đăng nhập bằng Google thất bại');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const response = await axios.get('/api/auth/facebook-login');
      window.location.href = response.data.redirect_url;
    } catch {
      setErrorMessage('Đăng nhập bằng Facebook thất bại');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
      <div className="text-center mb-6">
        <img src="path_to_your_image" alt="Characters" className="w-full" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Tạo tài khoản</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <div className="mb-4">
        <label className="block mb-1">Họ và tên</label>
        <input
          type="text"
          placeholder="Nhập họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          placeholder="Nhập Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Số điện thoại</label>
        <input
          type="text"
          placeholder="Nhập số điện thoại"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={handleRegister}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ĐĂNG KÝ
      </button>
      <div className="text-center mt-4">
        <span>Hoặc đăng nhập bằng:</span>
        <div className="flex justify-around mt-4">
          <button
            onClick={handleGoogleLogin}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Google
          </button>
          <button
            onClick={handleFacebookLogin}
            className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

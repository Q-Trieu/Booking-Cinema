import React, { useState } from 'react';
import axios from 'axios';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        '/api/auth/sign-in',
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setSuccessMessage(response.data.message);
      setError('');
      console.log('Đăng nhập thành công:', response.data);
      // Redirect or perform additional actions after login
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('Lỗi đăng nhập:', err.response.data?.message || err.message);
        setError(err.response.data?.message || 'Đăng nhập thất bại');
      } else {
        console.error('Lỗi đăng nhập:', (err as Error).message);
        setError('Đăng nhập thất bại');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
      <h2 className="text-center text-2xl font-semibold mb-4">Đăng nhập</h2>

      {error && (
        <div className="text-red-500 mb-4 text-center">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="text-green-500 mb-4 text-center">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          placeholder="Nhập Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={handleLogin}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ĐĂNG NHẬP
      </button>
    </div>
  );
};

export default LoginForm;

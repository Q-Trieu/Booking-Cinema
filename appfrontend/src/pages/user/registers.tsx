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

  const handleLogin = () => {
    console.log('Chuyển hướng tới trang đăng nhập');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="path_to_your_image" alt="Characters" style={{ width: '100%' }} />
      </div>
      <h2>Tạo tài khoản</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <div style={{ marginBottom: '10px' }}>
        <label>Họ và tên</label>
        <input
          type="text"
          placeholder="Nhập họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Nhập Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Số điện thoại</label>
        <input
          type="text"
          placeholder="Nhập số điện thoại"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <button
        onClick={handleRegister}
        style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        ĐĂNG KÝ
      </button>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <span>Bạn đã có tài khoản?</span>
        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
        >
          ĐĂNG NHẬP
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;

import React, { useState, useRef } from "react";
import axios from "axios";

const OTP: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    if (value && !/^[a-zA-Z0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text").trim();
    const pastedCharacters = pasteData.slice(0, 6).split("");

    const newOtp = [...otp];
    pastedCharacters.forEach((char, i) => {
      if (/^[a-zA-Z0-9]$/.test(char)) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);

    const lastIndex = pastedCharacters.length >= 6 ? 5 : pastedCharacters.length;
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/verify-otp", { otp: otpCode });
      console.log("OTP verified successfully:", response.data);
      // Xử lý thành công (ví dụ: chuyển hướng người dùng)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        console.error("Error verifying OTP:", err.response.data);
        setError(err.response.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
      } else {
        console.error("Error verifying OTP:", (err as Error).message);
        setError("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full mb-6">
        <img
          src="/assets/banner.png"
          alt="Banner OTP"
          className="w-full object-cover"
        />
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md w-11/12 max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Nhập mã xác nhận
        </h2>
        <div className="flex justify-center space-x-2 mb-6">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              value={value}
              maxLength={1}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:outline-none"
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-lg transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "Đang xử lý..." : "Xác Nhận"}
        </button>
      </div>
    </div>
  );
};

export default OTP;

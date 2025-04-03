import React, { useState } from "react";
import axios from "axios";

const PaymentPage: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("momo");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post("/api/payment", {
        ticketId: "12345", // Replace with actual ticket ID
        paymentMethod: selectedPaymentMethod,
        promotionCode: "PROMO123", // Replace with actual promotion code if applicable
      });

      setSuccessMessage(response.data.message || "Payment processed successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Payment failed. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Phần chi tiết phim */}
        <div className="mb-4">
          <div className="h-40 bg-gray-300 rounded-lg mb-4"></div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Tên Phim</h1>
            <p className="text-gray-600">Ngày, Tháng, Năm mua vé</p>
            <p className="text-gray-600">Thời Gian Chiếu</p>
            <p className="text-gray-600">Rạp Chiếu Phim</p>
            <p className="text-gray-600">Ghế</p>
            <p className="text-red-600 font-bold">Tổng Thanh toán</p>
          </div>
        </div>

        {/* Phần thông tin vé */}
        <div className="mb-4">
          <div className="bg-red-600 text-white p-2 rounded-t-lg">THÔNG TIN VÉ</div>
          <div className="p-2 border border-gray-300 rounded-b-lg space-y-1">
            <p>SỐ LƯỢNG: ...</p>
            <p>TỔNG: ...</p>
            <p>Voucher: ...</p>
          </div>
        </div>

        {/* Phần lựa chọn thanh toán */}
        <div>
          <div className="bg-red-600 text-white p-2 rounded-t-lg">THANH TOÁN</div>
          <div className="p-2 border border-gray-300 rounded-b-lg">
            <div
              className={`flex items-center mb-2 cursor-pointer ${
                selectedPaymentMethod === "momo" ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedPaymentMethod("momo")}
            >
              <img src="/path-to-icons/momo.png" alt="Ví MOMO" className="w-6 h-6 mr-2" />
              <p>Ví MOMO</p>
              {selectedPaymentMethod === "momo" && <span className="text-red-600 ml-auto">&#10003;</span>}
            </div>
            <div
              className={`flex items-center mb-2 cursor-pointer ${
                selectedPaymentMethod === "atm" ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedPaymentMethod("atm")}
            >
              <img src="/path-to-icons/atm.png" alt="ATM Card" className="w-6 h-6 mr-2" />
              <p>ATM Card</p>
              {selectedPaymentMethod === "atm" && <span className="text-red-600 ml-auto">&#10003;</span>}
            </div>
            <div
              className={`flex items-center mb-2 cursor-pointer ${
                selectedPaymentMethod === "zalopay" ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedPaymentMethod("zalopay")}
            >
              <img src="/path-to-icons/zalopay.png" alt="ZALOPAY" className="w-6 h-6 mr-2" />
              <p>ZALOPAY</p>
              {selectedPaymentMethod === "zalopay" && <span className="text-red-600 ml-auto">&#10003;</span>}
            </div>
            <div
              className={`flex items-center cursor-pointer ${
                selectedPaymentMethod === "vnpay" ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedPaymentMethod("vnpay")}
            >
              <img src="/path-to-icons/vnpay.png" alt="VNPAY" className="w-6 h-6 mr-2" />
              <p>VNPAY</p>
              {selectedPaymentMethod === "vnpay" && <span className="text-red-600 ml-auto">&#10003;</span>}
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="mt-4">
          <button
            onClick={handlePayment}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </div>

        {/* Error or Success Message */}
        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      </div>
    </div>
  );
};

export default PaymentPage;

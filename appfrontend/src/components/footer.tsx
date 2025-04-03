import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#800000] text-white py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Phần thông tin văn bản */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">my CINEMA</h1>
          <p className="mt-2">CÔNG TY TNHH MY CINEMA VIỆT NAM</p>
          <p className="mt-2 text-sm">
            Địa chỉ: Khu Công nghệ cao Xa lộ Hà Nội, Hiệp Phú, Thủ Đức, Hồ Chí
            Minh, Việt Nam
          </p>
          <p className="mt-2 text-sm">Hotline: (+84) 285 445 2222</p>
        </div>

        {/* Phần logo tròn */}
        <div className="mt-6 md:mt-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center">
            <span className="text-[#800000] font-bold">CINEMA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

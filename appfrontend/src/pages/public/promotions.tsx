import React, { useState, useEffect } from "react";
import { Card, Row, Col, Pagination, Spin, Tooltip, Button } from "antd";
import Header from "../../components/header";
import Footer from "../../components/footer";
import axiosInstance from "../../utils/AxiosInstance";

const { Meta } = Card;

interface Promotion {
  id: string;
  code: string;
  discount: number;
  start_date: string;
  end_date: string;
  type: string;
  condition: string;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const promotionsPerPage = 6;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/promotions");
        setPromotions(response.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Tính toán phân trang
  const indexOfLastPromotion = currentPage * promotionsPerPage;
  const indexOfFirstPromotion = indexOfLastPromotion - promotionsPerPage;
  const currentPromotions = promotions.slice(indexOfFirstPromotion, indexOfLastPromotion);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#633B48]">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Chương Trình Khuyến Mãi</h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Khám phá các ưu đãi độc quyền và chương trình khuyến mãi hấp dẫn tại My Cinema. Đừng bỏ lỡ cơ hội tiết kiệm và nhận được nhiều phần quà giá trị!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {currentPromotions.map((promotion) => (
                <Col key={promotion.id} xs={24} sm={12} md={8} lg={8}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={promotion.code}
                        src={`https://via.placeholder.com/300x200?text=${promotion.code}`}
                        style={{ height: "200px", objectFit: "cover" }}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                    }
                  >
                    <Meta
                      title={`Mã: ${promotion.code}`}
                      description={
                        <>
                          <p>
                            <strong>Giảm giá:</strong> {promotion.discount}%
                          </p>
                          <p>
                            <strong>Thời gian:</strong> {formatDate(promotion.start_date)} -{" "}
                            {formatDate(promotion.end_date)}
                          </p>
                          <p>
                            <strong>Điều kiện:</strong> {promotion.condition}
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <Tooltip title="Mã khuyến mãi">
                              <span className="bg-[#e71a0f] text-white px-3 py-1 rounded font-mono">
                                {promotion.code}
                              </span>
                            </Tooltip>
                            <Button type="primary" size="small">
                              Sử dụng ngay
                            </Button>
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={promotionsPerPage}
                total={promotions.length}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Promotions;
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Pagination, Spin } from "antd";
import Header from "../../components/header";
import Footer from "../../components/footer";
import axiosInstance from "../../utils/AxiosInstance";

const { Meta } = Card;

interface Theater {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

const Theaters: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const theatersPerPage = 6;

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/theaters");
        setTheaters(response.data);
      } catch (error) {
        console.error("Error fetching theaters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  // Tính toán phân trang
  const indexOfLastTheater = currentPage * theatersPerPage;
  const indexOfFirstTheater = indexOfLastTheater - theatersPerPage;
  const currentTheaters = theaters.slice(indexOfFirstTheater, indexOfLastTheater);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#633B48]">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Hệ Thống Rạp Chiếu Phim</h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Khám phá hệ thống rạp chiếu phim hiện đại với công nghệ âm thanh và hình ảnh tuyệt vời.
            Chọn rạp gần bạn nhất để có trải nghiệm xem phim tốt nhất.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {currentTheaters.map((theater) => (
                <Col key={theater.id} xs={24} sm={12} md={8} lg={8}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={theater.name}
                        src={`https://via.placeholder.com/300x200?text=${theater.name}`}
                        style={{ height: "200px", objectFit: "cover" }}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                    }
                  >
                    <Meta
                      title={theater.name}
                      description={
                        <>
                          <p>
                            <strong>Địa chỉ:</strong> {theater.location}
                          </p>
                          <p>
                            <strong>Sức chứa:</strong> {theater.capacity} người
                          </p>
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
                pageSize={theatersPerPage}
                total={theaters.length}
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

export default Theaters;
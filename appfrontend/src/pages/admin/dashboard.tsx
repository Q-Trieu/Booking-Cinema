import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Table, Spin, Typography } from "antd";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface User {
  _id: string;
  full_name: string;
  email: string;
  role: string;
}

interface Theater {
  _id: string;
  name: string;
  location: string;
  capacity: number;
}

interface Movie {
  _id: string;
  title: string;
  genre: string[];
  rating: number;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, theatersRes, moviesRes] = await Promise.all([
          axios.get("/api/admin/get-all-users"),
          axios.get("/api/theater/get-all-theaters"),
          axios.get("/api/movie/get-all-movies"),
        ]);

        setUsers(usersRes.data.data);
        setTheaters(theatersRes.data.data);
        setMovies(moviesRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <Spin size="large" />
      </div>
    );
  }

  const userColumns = [
    { title: "Name", dataIndex: "full_name", key: "full_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
  ];

  const theaterColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Capacity", dataIndex: "capacity", key: "capacity" },
  ];

  const movieColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      render: (genres: string[]) => genres.join(", "),
    },
    { title: "Rating", dataIndex: "rating", key: "rating" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#001529",
          color: "#fff",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <Title level={3} style={{ color: "#fff" }}>
          Admin Dashboard
        </Title>
      </Header>
      <Content style={{ margin: "16px" }}>
        <div
          style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}
        >
          <Title level={4}>Users</Title>
          <Table
            dataSource={users}
            columns={userColumns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />

          <Title level={4} style={{ marginTop: "24px" }}>
            Theaters
          </Title>
          <Table
            dataSource={theaters}
            columns={theaterColumns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />

          <Title level={4} style={{ marginTop: "24px" }}>
            Movies
          </Title>
          <Table
            dataSource={movies}
            columns={movieColumns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Admin Dashboard ©2023</Footer>
    </Layout>
  );
};

export default AdminDashboard;

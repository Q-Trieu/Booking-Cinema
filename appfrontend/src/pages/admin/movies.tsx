import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button, Table, Modal, Form, Input, message, Select, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface Movie {
  id: string;
  title: string;
  director: string;
  releaseDate: string;
  duration: number;
  genre: string[];
  description: string;
  poster: string;
  rating: number;
}

const AdminMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [form] = Form.useForm();

  const genreOptions = [
    { value: 'action', label: 'Hành động' },
    { value: 'comedy', label: 'Hài' },
    { value: 'drama', label: 'Chính kịch' },
    { value: 'horror', label: 'Kinh dị' },
    { value: 'scifi', label: 'Khoa học viễn tưởng' },
    { value: 'romance', label: 'Lãng mạn' },
    { value: 'animation', label: 'Hoạt hình' },
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/movies'); // Adjust the endpoint as needed
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      message.error("Không thể tải danh sách phim!");
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setEditingMovie(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    form.setFieldsValue({
      ...movie,
      genre: movie.genre
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/movies/${id}`);
      setMovies(movies.filter(movie => movie.id !== id));
      message.success('Đã xóa phim thành công');
    } catch (error) {
      console.error("Error deleting movie:", error);
      message.error("Không thể xóa phim!");
    }
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(async values => {
        try {
          if (editingMovie) {
            // Update movie
            const response = await axios.put(`/api/movies/${editingMovie.id}`, values);
            setMovies(movies.map(movie => 
              movie.id === editingMovie.id ? response.data : movie
            ));
            message.success('Cập nhật phim thành công');
          } else {
            // Add new movie
            const response = await axios.post('/api/movies', values);
            setMovies([...movies, response.data]);
            message.success('Thêm phim thành công');
          }
          setModalVisible(false);
        } catch (error) {
          console.error("Error saving movie:", error);
          message.error("Không thể lưu phim!");
        }
      })
      .catch(error => {
        console.log('Validate Failed:', error);
      });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'poster',
      key: 'poster',
      render: (poster: string) => (
        <img 
          src={poster} 
          alt="Movie poster" 
          style={{ width: 50, height: 75, objectFit: 'cover' }}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = 'https://placehold.co/50x75?text=No+Image';
          }}
        />
      ),
    },
    {
      title: 'Tên phim',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: Movie, b: Movie) => a.title.localeCompare(b.title),
    },
    {
      title: 'Đạo diễn',
      dataIndex: 'director',
      key: 'director',
    },
    {
      title: 'Ngày công chiếu',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      sorter: (a: Movie, b: Movie) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
      sorter: (a: Movie, b: Movie) => a.duration - b.duration,
    },
    {
      title: 'Thể loại',
      dataIndex: 'genre',
      key: 'genre',
      render: (genres: string[]) => (
        <span>
          {genres.map(genre => {
            const genreObj = genreOptions.find(option => option.value === genre);
            return genreObj ? genreObj.label : genre;
          }).join(', ')}
        </span>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a: Movie, b: Movie) => a.rating - b.rating,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Movie) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phim này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Phim</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          Thêm phim mới
        </Button>
      </div>

      <Table 
        dataSource={movies} 
        columns={columns} 
        rowKey="id"
        loading={loading}
        bordered
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingMovie ? "Chỉnh sửa phim" : "Thêm phim mới"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            {editingMovie ? "Cập nhật" : "Thêm mới"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingMovie || {}}
        >
          <Form.Item
            name="title"
            label="Tên phim"
            rules={[{ required: true, message: 'Vui lòng nhập tên phim!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="director"
            label="Đạo diễn"
            rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn!' }]}
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="releaseDate"
              label="Ngày công chiếu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày công chiếu!' }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Thời lượng (phút)"
              rules={[{ required: true, message: 'Vui lòng nhập thời lượng phim!' }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </div>

          <Form.Item
            name="genre"
            label="Thể loại"
            rules={[{ required: true, message: 'Vui lòng chọn thể loại phim!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn thể loại"
              options={genreOptions}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả phim!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="poster"
              label="URL Poster"
              rules={[{ required: true, message: 'Vui lòng nhập URL poster phim!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Đánh giá"
              rules={[{ required: true, message: 'Vui lòng nhập đánh giá phim!' }]}
            >
              <Input type="number" min={0} max={10} step={0.1} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default AdminMovies;

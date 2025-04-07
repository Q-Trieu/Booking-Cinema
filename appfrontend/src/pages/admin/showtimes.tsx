import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, Table, Modal, Form, Input, message, Select, Space, Popconfirm, DatePicker, TimePicker, InputNumber } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from "axios";
import dayjs from "dayjs";

interface Showtime {
  id: string;
  movieId: string;
  movieTitle: string;
  theaterId: string;
  theaterName: string;
  screen: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
}

interface Movie {
  id: string;
  title: string;
  duration: number;
}

interface Theater {
  id: string;
  name: string;
  screens: Screen[];
}

interface Screen {
  id: string;
  name: string;
  seats: number;
}

const AdminShowtimes: React.FC = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [selectedMovieDuration, setSelectedMovieDuration] = useState<number>(0);
  const [selectedTheater, setSelectedTheater] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, theatersRes, showtimesRes] = await Promise.all([
          axios.get("/api/movies"),
          axios.get("/api/theaters"),
          axios.get("/api/showtimes"),
        ]);
        setMovies(moviesRes.data);
        setTheaters(theatersRes.data);
        setShowtimes(showtimesRes.data);
      } catch {
          message.error("Lỗi khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showAddModal = () => {
    setEditingShowtime(null);
    form.resetFields();
    setSelectedMovieDuration(0);
    setSelectedTheater("");
    setScreens([]);
    setModalVisible(true);
  };

  const showEditModal = (showtime: Showtime) => {
    setEditingShowtime(showtime);

    const selectedMovie = movies.find(movie => movie.id === showtime.movieId);
    setSelectedMovieDuration(selectedMovie?.duration || 0);

    const theater = theaters.find(theater => theater.id === showtime.theaterId);
    setSelectedTheater(showtime.theaterId);
    setScreens(theater?.screens || []);

    form.setFieldsValue({
      ...showtime,
      date: dayjs(showtime.date),
      startTime: dayjs(showtime.startTime, "HH:mm:ss"),
    });

    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/showtimes/${id}`);
      setShowtimes(showtimes.filter(showtime => showtime.id !== id));
      message.success("Đã xóa lịch chiếu thành công");
    } catch {
      message.error("Lỗi khi xóa lịch chiếu!");
    }
  };

  const handleMovieChange = (movieId: string) => {
    const selectedMovie = movies.find(movie => movie.id === movieId);
    setSelectedMovieDuration(selectedMovie?.duration || 0);
  };

  const handleTheaterChange = (theaterId: string) => {
    setSelectedTheater(theaterId);
    const theater = theaters.find(theater => theater.id === theaterId);
    setScreens(theater?.screens || []);
    form.setFieldsValue({ screen: undefined });
  };

  const calculateEndTime = (startTime: dayjs.Dayjs) => {
    if (startTime && selectedMovieDuration) {
      return startTime.add(selectedMovieDuration, "minute").format("HH:mm:ss");
    }
    return "";
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const startTime = values.startTime.format("HH:mm:ss");
      const endTime = calculateEndTime(values.startTime);
      const date = values.date.format("YYYY-MM-DD");

      const movie = movies.find(m => m.id === values.movieId);
      const theater = theaters.find(t => t.id === values.theaterId);
      const screen = screens.find(s => s.name === values.screen);

      if (editingShowtime) {
        const updatedShowtime = {
          ...editingShowtime,
          movieId: values.movieId,
          movieTitle: movie?.title || "",
          theaterId: values.theaterId,
          theaterName: theater?.name || "",
          screen: values.screen,
          date,
          startTime,
          endTime,
          price: values.price,
          availableSeats: values.availableSeats,
          totalSeats: screen?.seats || 0,
        };

        await axios.put(`/api/showtimes/${editingShowtime.id}`, updatedShowtime);
        setShowtimes(showtimes.map(showtime => (showtime.id === editingShowtime.id ? updatedShowtime : showtime)));
        message.success("Cập nhật lịch chiếu thành công");
      } else {
        const newShowtime: Showtime = {
          id: Date.now().toString(),
          movieId: values.movieId,
          movieTitle: movie?.title || "",
          theaterId: values.theaterId,
          theaterName: theater?.name || "",
          screen: values.screen,
          date,
          startTime,
          endTime,
          price: values.price,
          availableSeats: screen?.seats || 0,
          totalSeats: screen?.seats || 0,
        };

        const response = await axios.post("/api/showtimes", newShowtime);
        setShowtimes([...showtimes, response.data]);
        message.success("Thêm lịch chiếu thành công");
      }

      setModalVisible(false);
    } catch {
      message.error("Lỗi khi lưu lịch chiếu!");
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const columns = [
    {
      title: "Phim",
      dataIndex: "movieTitle",
      key: "movieTitle",
      sorter: (a: Showtime, b: Showtime) => a.movieTitle.localeCompare(b.movieTitle),
    },
    {
      title: "Rạp",
      dataIndex: "theaterName",
      key: "theaterName",
      sorter: (a: Showtime, b: Showtime) => a.theaterName.localeCompare(b.theaterName),
    },
    {
      title: "Phòng chiếu",
      dataIndex: "screen",
      key: "screen",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      key: "date",
      sorter: (a: Showtime, b: Showtime) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      sorter: (a: Showtime, b: Showtime) => a.startTime.localeCompare(b.startTime),
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Giá vé (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString("vi-VN"),
      sorter: (a: Showtime, b: Showtime) => a.price - b.price,
    },
    {
      title: "Ghế trống",
      key: "seatsInfo",
      render: (record: Showtime) => `${record.availableSeats}/${record.totalSeats}`,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Showtime) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa lịch chiếu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} />
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
        <h1 className="text-2xl font-bold">Quản lý Lịch Chiếu</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          Thêm lịch chiếu mới
        </Button>
      </div>

      <Table
        dataSource={showtimes}
        columns={columns}
        rowKey="id"
        loading={loading}
        bordered
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingShowtime ? "Chỉnh sửa lịch chiếu" : "Thêm lịch chiếu mới"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            {editingShowtime ? "Cập nhật" : "Thêm mới"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" initialValues={editingShowtime || {}}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="movieId"
              label="Phim"
              rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
            >
              <Select
                placeholder="Chọn phim"
                options={movies.map(movie => ({ value: movie.id, label: movie.title }))}
                onChange={handleMovieChange}
              />
            </Form.Item>

            <Form.Item label="Thời lượng (phút)">
              <Input value={selectedMovieDuration ? `${selectedMovieDuration} phút` : ""} disabled />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="theaterId"
              label="Rạp chiếu"
              rules={[{ required: true, message: "Vui lòng chọn rạp chiếu!" }]}
            >
              <Select
                placeholder="Chọn rạp chiếu"
                options={theaters.map(theater => ({ value: theater.id, label: theater.name }))}
                onChange={handleTheaterChange}
              />
            </Form.Item>

            <Form.Item
              name="screen"
              label="Phòng chiếu"
              rules={[{ required: true, message: "Vui lòng chọn phòng chiếu!" }]}
            >
              <Select
                placeholder="Chọn phòng chiếu"
                options={screens.map(screen => ({ value: screen.name, label: `${screen.name} (${screen.seats} ghế)` }))}
                disabled={!selectedTheater}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="date"
              label="Ngày chiếu"
              rules={[{ required: true, message: "Vui lòng chọn ngày chiếu!" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
            </Form.Item>

            <Form.Item
              name="startTime"
              label="Giờ bắt đầu"
              rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu!" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                placeholder="Chọn giờ bắt đầu"
                minuteStep={5}
              />
            </Form.Item>

            <Form.Item label="Giờ kết thúc (dự kiến)">
              <Input
                value={form.getFieldValue("startTime") ? calculateEndTime(form.getFieldValue("startTime")) : ""}
                disabled
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label="Giá vé (VNĐ)"
              rules={[{ required: true, message: "Vui lòng nhập giá vé!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={1000}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={() => 0}
              />
            </Form.Item>

            {editingShowtime && (
              <Form.Item
                name="availableSeats"
                label="Số ghế còn trống"
                rules={[
                  { required: true, message: "Vui lòng nhập số ghế trống!" },
                  () => ({
                    validator(_, value) {
                      const totalSeats = editingShowtime.totalSeats;
                      if (value >= 0 && value <= totalSeats) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(`Số ghế trống không được vượt quá tổng số ghế (${totalSeats})!`)
                      );
                    },
                  }),
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} max={editingShowtime.totalSeats} />
              </Form.Item>
            )}
          </div>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default AdminShowtimes;

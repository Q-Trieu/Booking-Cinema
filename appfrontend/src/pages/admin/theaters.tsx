import React, { Key, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  message,
  Select,
  Space,
  Popconfirm,
  InputNumber,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

interface Theater {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  screens: number;
  facilities: string[];
  image: string;
  contactPhone: string;
}

const AdminTheaters: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
  const [form] = Form.useForm();

  const cityOptions = [
    { value: "hanoi", label: "Hà Nội" },
    { value: "hcm", label: "TP. Hồ Chí Minh" },
    { value: "danang", label: "Đà Nẵng" },
    { value: "cantho", label: "Cần Thơ" },
    { value: "hue", label: "Huế" },
  ];

  const facilityOptions = [
    { value: "parking", label: "Bãi đỗ xe" },
    { value: "food", label: "Đồ ăn & Thức uống" },
    { value: "vip", label: "Phòng chiếu VIP" },
    { value: "4dx", label: "Công nghệ 4DX" },
    { value: "imax", label: "IMAX" },
    { value: "wifi", label: "Wi-Fi miễn phí" },
    { value: "wheelchair", label: "Lối đi cho xe lăn" },
  ];

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/theaters");
      setTheaters(data);
    } catch {
      message.error("Lỗi khi tải dữ liệu rạp chiếu phim");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = (theater?: Theater) => {
    setEditingTheater(theater || null);
    form.resetFields();
    if (theater) {
      form.setFieldsValue(theater);
    }
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/theaters/${id}`);
      setTheaters(theaters.filter((theater) => theater.id !== id));
      message.success("Đã xóa rạp chiếu phim thành công");
    } catch {
      message.error("Lỗi khi xóa rạp chiếu phim");
    }
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingTheater) {
        const { data } = await axios.put(
          `/api/theaters/${editingTheater.id}`,
          values
        );
        setTheaters(
          theaters.map((theater) =>
            theater.id === editingTheater.id ? data : theater
          )
        );
        message.success("Cập nhật rạp chiếu phim thành công");
      } else {
        const { data } = await axios.post("/api/theaters", values);
        setTheaters([...theaters, data]);
        message.success("Thêm rạp chiếu phim thành công");
      }
      handleModalClose();
    } catch {
      message.error("Lỗi khi lưu rạp chiếu phim");
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="Theater"
          style={{
            width: 80,
            height: 60,
            objectFit: "cover",
            borderRadius: "4px",
          }}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src =
              "https://placehold.co/80x60?text=No+Image";
          }}
        />
      ),
    },
    {
      title: "Tên rạp",
      dataIndex: "name",
      key: "name",
      sorter: (a: Theater, b: Theater) => a.name.localeCompare(b.name),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      key: "city",
      render: (city: string) =>
        cityOptions.find((option) => option.value === city)?.label ?? city,
      filters: cityOptions.map((option) => ({
        text: option.label,
        value: option.value,
      })),
      onFilter: (value: boolean | Key, record: Theater): boolean => {
        // Cast value to string for comparison with record.city
        return record.city === String(value);
      },
    },
    {
      title: "Số phòng chiếu",
      dataIndex: "screens",
      key: "screens",
      sorter: (a: Theater, b: Theater) => a.screens - b.screens,
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
      sorter: (a: Theater, b: Theater) => a.capacity - b.capacity,
    },
    {
      title: "Tiện ích",
      dataIndex: "facilities",
      key: "facilities",
      render: (facilities: string[]) =>
        facilities
          .map(
            (facility) =>
              facilityOptions.find((option) => option.value === facility)
                ?.label ?? facility
          )
          .join(", "),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Theater) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleModalOpen(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa rạp này?"
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
        <h1 className="text-2xl font-bold">Quản lý Rạp Chiếu Phim</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleModalOpen()}
        >
          Thêm rạp mới
        </Button>
      </div>

      <Table
        dataSource={theaters}
        columns={columns}
        rowKey="id"
        loading={loading}
        bordered
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={
          editingTheater
            ? "Chỉnh sửa rạp chiếu phim"
            : "Thêm rạp chiếu phim mới"
        }
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="back" onClick={handleModalClose}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleFormSubmit}>
            {editingTheater ? "Cập nhật" : "Thêm mới"}
          </Button>,
        ]}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên rạp"
            rules={[{ required: true, message: "Vui lòng nhập tên rạp!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ rạp!" },
            ]}
          >
            <Input />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="city"
              label="Thành phố"
              rules={[{ required: true, message: "Vui lòng chọn thành phố!" }]}
            >
              <Select
                placeholder="Chọn thành phố"
                options={cityOptions}
              />
            </Form.Item>
            <Form.Item
              name="screens"
              label="Số phòng chiếu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số phòng chiếu!",
                },
              ]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="capacity"
              label="Sức chứa"
              rules={[
                { required: true, message: "Vui lòng nhập sức chứa!" },
              ]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Form.Item
            name="facilities"
            label="Tiện ích"
            rules={[
              { required: true, message: "Vui lòng chọn tiện ích!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn tiện ích"
              options={facilityOptions}
            />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="image"
              label="URL hình ảnh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập URL hình ảnh rạp!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="contactPhone"
              label="Số điện thoại liên hệ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại liên hệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default AdminTheaters;

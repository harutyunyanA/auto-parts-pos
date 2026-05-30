import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Popconfirm,
  Space,
  Flex,
  Typography,
  Input,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSuppliers } from "./queries";
import { useDeleteSupplier } from "./mutations";
import { SupplierForm } from "./supplierForm";
import type { ISupplier } from "./types";

export function SuppliersTable() {
  const navigate = useNavigate();
  const { data: suppliers, isLoading } = useSuppliers();
  const deleteMutation = useDeleteSupplier();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ISupplier | null>(null);
  const [search, setSearch] = useState("");

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (supplier: ISupplier) => {
    setEditing(supplier);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const filtered = (suppliers ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "25%",
      render: (phone: string | null) => phone || "—",
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      align: "center" as const,
      render: (_: unknown, record: ISupplier) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/suppliers/${record.id}`)}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Delete supplier?"
            description="This cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Flex vertical gap="middle" style={{ height: "100%", minHeight: 0 }}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={4} style={{ margin: 0 }}>
          Suppliers
        </Typography.Title>
        <Space>
          <Input
            allowClear
            placeholder="Search suppliers..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Supplier
          </Button>
        </Space>
      </Flex>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        bordered
        sticky
        scroll={{ y: "calc(100vh - 320px)" }}
        pagination={{ defaultPageSize: 20, showSizeChanger: true }}
      />

      <Modal
        open={modalOpen}
        title={editing ? "Edit Supplier" : "Add Supplier"}
        footer={null}
        maskClosable={false}
        destroyOnClose
        onCancel={closeModal}
        width={480}
      >
        <SupplierForm supplier={editing} onClose={closeModal} />
      </Modal>
    </Flex>
  );
}

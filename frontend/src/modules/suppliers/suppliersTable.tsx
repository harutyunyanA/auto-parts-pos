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
import { useTranslation } from "react-i18next";
import type { ISupplier } from "./types";

export function SuppliersTable() {
  const { t } = useTranslation();
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
      title: t("columns.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("columns.phone"),
      dataIndex: "phone",
      key: "phone",
      width: "25%",
      render: (phone: string | null) => phone || "—",
    },
    {
      title: t("columns.actions"),
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
            {t("common.view")}
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title={t("suppliers.deleteConfirmTitle")}
            description={t("common.cannotBeUndone")}
            okText={t("common.delete")}
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
          {t("suppliers.title")}
        </Typography.Title>
        <Space>
          <Input
            allowClear
            placeholder={t("suppliers.searchPlaceholder")}
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {t("suppliers.add")}
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
        title={editing ? t("suppliers.editTitle") : t("suppliers.add")}
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

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Pagination,
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
import { useClients } from "./queries";
import { useDeleteClient } from "./mutations";
import { ClientForm } from "./clientForm";
import { useContainerHeight } from "../../hooks/useContainerHeight";
import { useTranslation } from "react-i18next";
import type { IClient } from "./types";

export function ClientsTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: clients, isLoading } = useClients();
  const deleteMutation = useDeleteClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = useContainerHeight(containerRef);
  const tableScrollY = Math.max(containerHeight - 52, 160);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IClient | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (client: IClient) => {
    setEditing(client);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const filtered = (clients ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    {
      title: t("columns.name"),
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: t("columns.phone"),
      dataIndex: "phone",
      key: "phone",
      width: 180,
      render: (phone: string | null) => phone || "—",
    },
    {
      title: t("columns.actions"),
      key: "actions",
      width: 220,
      align: "center" as const,
      render: (_: unknown, record: IClient) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/clients/${record.id}`)}
          >
            {t("common.view")}
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title={t("clients.deleteConfirmTitle")}
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
          {t("clients.title")}
        </Typography.Title>
        <Space>
          <Input
            allowClear
            placeholder={t("clients.searchPlaceholder")}
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ width: 240 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {t("clients.add")}
          </Button>
        </Space>
      </Flex>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-hidden">
        <Table
          dataSource={paged}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          bordered
          sticky
          scroll={{ x: 600, y: tableScrollY }}
          pagination={false}
        />
      </div>
      <Pagination
        className="shrink-0"
        current={page}
        pageSize={pageSize}
        total={filtered.length}
        showSizeChanger
        onChange={(nextPage, nextPageSize) => {
          setPage(nextPage);
          setPageSize(nextPageSize);
        }}
      />

      <Modal
        open={modalOpen}
        title={editing ? t("clients.editTitle") : t("clients.add")}
        footer={null}
        maskClosable={false}
        destroyOnClose
        onCancel={closeModal}
        width={480}
      >
        <ClientForm client={editing} onClose={closeModal} />
      </Modal>
    </Flex>
  );
}

import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import {
  Card,
  Pagination,
  Statistic,
  Switch,
  Table,
  Typography,
  Button,
  Flex,
  Empty,
  Spin,
  Popconfirm,
} from "antd";
import { ArrowLeftOutlined, GiftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useClientPurchases } from "./queries";
import { usePayAllBonus, useToggleCartBonusPaid } from "./mutations";
import { useContainerHeight } from "../../hooks/useContainerHeight";
import { useSource } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import type { IClientPurchase, IClientPurchaseItem } from "./types";

interface ClientDetailProps {
  id: number;
}

export function ClientDetail({ id }: ClientDetailProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const source = useSource();
  const { data, isLoading } = useClientPurchases(id, source);
  const payAllBonus = usePayAllBonus(id);
  const toggleBonusPaid = useToggleCartBonusPaid(id);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = useContainerHeight(containerRef);
  const tableScrollY = Math.max(containerHeight - 52, 120);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!data) {
    return <Empty description={t("clients.notFound")} />;
  }

  const { client, purchases, stats } = data;

  const money = (v: number) => Math.round(Number(v) || 0).toLocaleString();

  const itemColumns = [
    {
      title: t("columns.code"),
      dataIndex: "code",
      key: "code",
      width: 80,
      render: (v: number | null) => v ?? "—",
    },
    {
      title: t("columns.name"),
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
      render: (v: string | undefined) => v ?? "—",
    },
    {
      title: t("columns.type"),
      dataIndex: "type",
      key: "type",
      width: 90,
      ellipsis: true,
      render: (v: string | null) => v ?? "—",
    },
    {
      title: t("columns.oem"),
      dataIndex: "oem",
      key: "oem",
      width: 110,
      ellipsis: true,
      render: (v: string | null) => v ?? "—",
    },
    {
      title: t("columns.qty"),
      dataIndex: "quantity",
      key: "quantity",
      width: 70,
      align: "right" as const,
    },
    {
      title: t("columns.price"),
      dataIndex: "priceAtSale",
      key: "priceAtSale",
      width: 100,
      align: "right" as const,
      render: (v: number) => money(v),
    },
    {
      title: t("columns.total"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 110,
      align: "right" as const,
      render: (v: number) => money(v),
    },
  ];

  const purchaseColumns = [
    {
      title: t("clients.purchaseId"),
      dataIndex: "id",
      key: "id",
      width: 110,
    },
    {
      title: t("columns.date"),
      dataIndex: "createdAt",
      key: "createdAt",
      ellipsis: true,
      render: (v: string) => dayjs(v).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: t("columns.total"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 130,
      align: "right" as const,
      render: (v: number) => money(v),
    },
    {
      title: t("clients.bonus"),
      dataIndex: "bonusAmount",
      key: "bonusAmount",
      width: 120,
      align: "right" as const,
      render: (v: number) => money(v),
    },
    {
      title: t("clients.bonusPaid"),
      key: "bonusPaid",
      width: 110,
      align: "center" as const,
      render: (_: unknown, p: IClientPurchase) => (
        <Switch
          checked={p.bonusPaid}
          loading={toggleBonusPaid.isPending}
          onChange={(checked) =>
            toggleBonusPaid.mutate({ cartId: p.id, bonusPaid: checked })
          }
        />
      ),
    },
  ];

  return (
    <Flex vertical gap="small" style={{ height: "100%", minHeight: 0 }}>
      <Flex align="center" gap="middle" wrap="wrap">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/clients")}
        />
        <Typography.Title level={4} style={{ margin: 0 }}>
          {client.name}
        </Typography.Title>
        {client.phone && (
          <Typography.Text type="secondary">{client.phone}</Typography.Text>
        )}
        <div style={{ marginLeft: "auto" }}>
          <Popconfirm
            title={t("clients.payAllConfirm")}
            okText={t("clients.payAll")}
            disabled={stats.bonusOutstanding <= 0}
            onConfirm={() => payAllBonus.mutate()}
          >
            <Button
              type="primary"
              icon={<GiftOutlined />}
              loading={payAllBonus.isPending}
              disabled={stats.bonusOutstanding <= 0}
            >
              {t("clients.payAll")}
            </Button>
          </Popconfirm>
        </div>
      </Flex>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card size="small">
          <Statistic
            title={t("clients.statTotalPurchases")}
            value={stats.totalPurchases}
          />
        </Card>
        <Card size="small">
          <Statistic
            title={t("clients.statTotalSpent")}
            value={money(stats.totalSpent)}
          />
        </Card>
        <Card size="small">
          <Statistic
            title={t("clients.statBonusPercent")}
            value={stats.bonusPercent}
            suffix="%"
          />
        </Card>
        <Card size="small">
          <Statistic
            title={t("clients.statBonusAccrued")}
            value={money(stats.bonusAccrued)}
          />
        </Card>
        <Card size="small">
          <Statistic
            title={t("clients.statBonusOutstanding")}
            value={money(stats.bonusOutstanding)}
            valueStyle={{
              color: stats.bonusOutstanding > 0 ? "#cf1322" : undefined,
            }}
          />
        </Card>
      </div>

      <Typography.Title level={5} style={{ margin: 0 }}>
        {t("clients.purchaseHistory")}
      </Typography.Title>

      <div ref={containerRef} className="flex flex-col min-h-0 overflow-scroll">
        <Table
          dataSource={purchases.slice((page - 1) * pageSize, page * pageSize)}
          columns={purchaseColumns}
          rowKey="id"
          bordered
          sticky
          pagination={false}
          scroll={{ x: 640, y: tableScrollY }}
          locale={{ emptyText: <Empty description={t("clients.noPurchases")} /> }}
          expandable={{
            expandedRowRender: (p: IClientPurchase) => (
              <Table
                dataSource={p.items}
                columns={itemColumns}
                rowKey={(item: IClientPurchaseItem) => item.id}
                size="small"
                pagination={false}
                scroll={{ x: "max-content" }}
              />
            ),
            rowExpandable: (p: IClientPurchase) => (p.items?.length ?? 0) > 0,
          }}
        />
      </div>
      <Pagination
        className="shrink-0"
        current={page}
        pageSize={pageSize}
        total={purchases.length}
        showSizeChanger
        onChange={(nextPage, nextPageSize) => {
          setPage(nextPage);
          setPageSize(nextPageSize);
        }}
      />
    </Flex>
  );
}

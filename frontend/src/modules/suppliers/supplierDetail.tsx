import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import {
  Card,
  Pagination,
  Statistic,
  Table,
  Tag,
  Typography,
  Button,
  Flex,
  Empty,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSupplierSupplies } from "./queries";
import { useContainerHeight } from "../../hooks/useContainerHeight";
import { useTranslation } from "react-i18next";
import type { ISupplierSupply, ISupplierSupplyItem } from "./types";

interface SupplierDetailProps {
  id: number;
}

export function SupplierDetail({ id }: SupplierDetailProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, isLoading } = useSupplierSupplies(id);
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
    return <Empty description={t("suppliers.notFound")} />;
  }

  const { supplier, supplies, stats } = data;

  const dec = (v: string | null, digits = 2) =>
    v == null || v === "" ? "—" : Number(v).toFixed(digits);

  const itemColumns = [
    {
      title: t("columns.code"),
      dataIndex: ["product", "code"],
      key: "code",
      width: 80,
    },
    {
      title: t("columns.product"),
      dataIndex: ["product", "name"],
      key: "name",
      width: 200,
      ellipsis: true,
      render: (name: string | undefined) => name ?? "—",
    },
    {
      title: t("columns.type"),
      dataIndex: ["product", "type"],
      key: "type",
      width: 90,
      ellipsis: true,
      render: (v: string | null) => v ?? "—",
    },
    {
      title: t("columns.oem"),
      dataIndex: ["product", "oem"],
      key: "oem",
      width: 110,
      ellipsis: true,
      render: (v: string | null) => v ?? "—",
    },
    {
      title: t("columns.wxqp"),
      dataIndex: ["product", "WXQP"],
      key: "wxqp",
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
      title: t("columns.purchase"),
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      width: 100,
      align: "right" as const,
      render: (v: string) => dec(v),
    },
    {
      title: t("columns.sale"),
      dataIndex: "salePrice",
      key: "salePrice",
      width: 100,
      align: "right" as const,
      render: (v: string | null) => dec(v),
    },
    {
      title: t("columns.usdPrice"),
      dataIndex: "purchasePriceUsd",
      key: "purchasePriceUsd",
      width: 100,
      align: "right" as const,
      render: (v: string | null) => dec(v),
    },
    {
      title: t("columns.usdRate"),
      dataIndex: "usdRate",
      key: "usdRate",
      width: 100,
      align: "right" as const,
      render: (v: string | null) => dec(v, 4),
    },
    {
      title: t("columns.tax"),
      dataIndex: "tax",
      key: "tax",
      width: 90,
      align: "right" as const,
      render: (v: string | null) => dec(v),
    },
    {
      title: t("columns.weight"),
      dataIndex: "weight",
      key: "weight",
      width: 90,
      align: "right" as const,
      render: (v: string | null) => dec(v, 3),
    },
  ];

  const supplyColumns = [
    {
      title: t("columns.supplyId"),
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
      title: t("columns.status"),
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: string) => (
        <Tag color={status === "completed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: t("columns.items"),
      key: "items",
      width: 100,
      align: "right" as const,
      render: (_: unknown, s: ISupplierSupply) => s.items?.length ?? 0,
    },
    {
      title: t("columns.totalCost"),
      dataIndex: "totalCost",
      key: "totalCost",
      width: 140,
      align: "right" as const,
      render: (v: string | null) => Number(v ?? 0).toFixed(2),
    },
  ];

  return (
    <Flex vertical gap="small" style={{ height: "100%", minHeight: 0 }}>
      <Flex align="center" gap="middle">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/suppliers")}
        />
        <Typography.Title level={4} style={{ margin: 0 }}>
          {supplier.name}
        </Typography.Title>
        {supplier.phone && (
          <Typography.Text type="secondary">{supplier.phone}</Typography.Text>
        )}
      </Flex>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card size="small">
          <Statistic
            title={t("suppliers.statTotalSupplies")}
            value={stats.totalSupplies}
          />
        </Card>
        <Card size="small">
          <Statistic
            title={t("suppliers.statTotalSpent")}
            value={stats.totalSpent}
            precision={2}
          />
        </Card>
        <Card size="small">
          <Statistic
            title={t("suppliers.statUnitsDelivered")}
            value={stats.totalItems}
          />
        </Card>
        <Card size="small">
          <Statistic
            title={t("suppliers.statLastSupply")}
            value={
              stats.lastSupplyAt
                ? dayjs(stats.lastSupplyAt).format("DD-MM-YYYY")
                : "—"
            }
          />
        </Card>
      </div>

      <Typography.Title level={5} style={{ margin: 0 }}>
        {t("suppliers.supplyHistory")}
      </Typography.Title>

        <div
          ref={containerRef}
          className="flex flex-col min-h-0 overflow-scroll"
        >
          <Table
            dataSource={supplies.slice((page - 1) * pageSize, page * pageSize)}
            columns={supplyColumns}
            rowKey="id"
            bordered
            sticky
            pagination={false}
            scroll={{ x: 640, y: tableScrollY }}
            expandable={{
              expandedRowRender: (s: ISupplierSupply) => (
                <Table
                  dataSource={s.items}
                  columns={itemColumns}
                  rowKey={(item: ISupplierSupplyItem) => item.id}
                  size="small"
                  pagination={false}
                  scroll={{ x: "max-content" }}
                />
              ),
              rowExpandable: (s: ISupplierSupply) => (s.items?.length ?? 0) > 0,
            }}
          />
        </div>
        <Pagination
          className="shrink-0"
          current={page}
          pageSize={pageSize}
          total={supplies.length}
          showSizeChanger
          onChange={(nextPage, nextPageSize) => {
            setPage(nextPage);
            setPageSize(nextPageSize);
          }}
        />
    </Flex>
  );
}

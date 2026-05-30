import { useNavigate } from "react-router-dom";
import {
  Card,
  Col,
  Row,
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
import type { ISupplierSupply, ISupplierSupplyItem } from "./types";

interface SupplierDetailProps {
  id: number;
}

export function SupplierDetail({ id }: SupplierDetailProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useSupplierSupplies(id);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!data) {
    return <Empty description="Supplier not found" />;
  }

  const { supplier, supplies, stats } = data;

  const dec = (v: string | null, digits = 2) =>
    v == null || v === "" ? "—" : Number(v).toFixed(digits);

  const itemColumns = [
    {
      title: "Code",
      dataIndex: ["product", "code"],
      key: "code",
      width: 80,
    },
    {
      title: "Product",
      dataIndex: ["product", "name"],
      key: "name",
      width: 200,
      render: (name: string | undefined) => name ?? "—",
    },
    {
      title: "Type",
      dataIndex: ["product", "type"],
      key: "type",
      width: 90,
      render: (v: string | null) => v ?? "—",
    },
    {
      title: "OEM",
      dataIndex: ["product", "oem"],
      key: "oem",
      width: 110,
      render: (v: string | null) => v ?? "—",
    },
    {
      title: "WXQP",
      dataIndex: ["product", "WXQP"],
      key: "wxqp",
      width: 110,
      render: (v: string | null) => v ?? "—",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      width: 70,
      align: "right" as const,
    },
    {
      title: "Purchase",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      width: 100,
      align: "right" as const,
      render: (v: string) => dec(v),
    },
    {
      title: "Sale",
      dataIndex: "salePrice",
      key: "salePrice",
      width: 100,
      align: "right" as const,
      render: (v: string | null) => dec(v),
    },
    {
      title: "USD price",
      dataIndex: "purchasePriceUsd",
      key: "purchasePriceUsd",
      width: 100,
      align: "right" as const,
      render: (v: string | null) => dec(v),
    },
    {
      title: "USD rate",
      dataIndex: "usdRate",
      key: "usdRate",
      width: 100,
      align: "right" as const,
      render: (v: string | null) => dec(v, 4),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      width: 90,
      align: "right" as const,
      render: (v: string | null) => dec(v),
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      width: 90,
      align: "right" as const,
      render: (v: string | null) => dec(v, 3),
    },
  ];

  const supplyColumns = [
    {
      title: "Supply ID",
      dataIndex: "id",
      key: "id",
      width: 110,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => dayjs(v).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: string) => (
        <Tag color={status === "completed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Items",
      key: "items",
      width: 100,
      align: "right" as const,
      render: (_: unknown, s: ISupplierSupply) => s.items?.length ?? 0,
    },
    {
      title: "Total cost",
      dataIndex: "totalCost",
      key: "totalCost",
      width: 140,
      align: "right" as const,
      render: (v: string | null) => Number(v ?? 0).toFixed(2),
    },
  ];

  return (
    <Flex vertical gap="middle" style={{ height: "100%", minHeight: 0 }}>
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

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Total supplies" value={stats.totalSupplies} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total spent"
              value={stats.totalSpent}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Units delivered" value={stats.totalItems} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Last supply"
              value={
                stats.lastSupplyAt
                  ? dayjs(stats.lastSupplyAt).format("DD-MM-YYYY")
                  : "—"
              }
            />
          </Card>
        </Col>
      </Row>

      <Typography.Title level={5} style={{ margin: 0 }}>
        Supply history
      </Typography.Title>

      <Table
        dataSource={supplies}
        columns={supplyColumns}
        rowKey="id"
        bordered
        sticky
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        scroll={{ y: "calc(100vh - 500px)" }}
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
    </Flex>
  );
}

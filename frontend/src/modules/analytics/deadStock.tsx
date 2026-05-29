import { useState } from "react";
import { Table, Typography, Segmented, Space, Card, Statistic } from "antd";
import { useDeadStock } from "./queries";
import { money } from "./format";
import type { IDeadStockItem } from "./types";

const DAY_OPTIONS = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "180 days", value: 180 },
  { label: "365 days", value: 365 },
];

export function DeadStock() {
  const [days, setDays] = useState(90);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const { data, isLoading } = useDeadStock(days);

  const frozenTotal = (data ?? []).reduce((sum, p) => sum + p.frozenValue, 0);

  const handleDaysChange = (value: number) => {
    setDays(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <Space size="large" align="center">
        <Space>
          <Typography.Text type="secondary">No sales within:</Typography.Text>
          <Segmented<number>
            value={days}
            onChange={handleDaysChange}
            options={DAY_OPTIONS}
          />
        </Space>
        <Card size="small">
          <Statistic
            title="Frozen capital"
            value={money(frozenTotal)}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Space>

      <Table<IDeadStockItem>
        dataSource={data}
        loading={isLoading}
        rowKey="id"
        sticky
        bordered
        size="small"
        scroll={{ y: "calc(100vh - 400px)" }}
        pagination={{
          current: page,
          pageSize,
          showSizeChanger: true,
          placement: ["bottomStart"],
          size: "middle",
          pageSizeOptions: [50, 100, 200, 500],
          showTotal: (total) => `${total} items`,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPage);
            setPageSize(nextPageSize);
          },
        }}
        columns={[
          {
            title: "№",
            key: "index",
            align: "center",
            width: "5%",
            render: (_t, _r, index) => (page - 1) * pageSize + index + 1,
          },
          {
            title: "Code",
            dataIndex: "code",
            key: "code",
            align: "center",
            width: "10%",
          },
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Type",
            dataIndex: "type",
            key: "type",
            align: "center",
            width: "10%",
          },
          {
            title: "OEM",
            dataIndex: "oem",
            key: "oem",
            align: "center",
            width: "12%",
          },
          {
            title: "Qty",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
            width: "8%",
            sorter: (a, b) => a.quantity - b.quantity,
          },
          {
            title: "Purchase price",
            dataIndex: "purchase_price",
            key: "purchase_price",
            align: "right",
            width: "13%",
            render: (v: number) => money(v),
          },
          {
            title: "Frozen value",
            dataIndex: "frozenValue",
            key: "frozenValue",
            align: "right",
            width: "15%",
            sorter: (a, b) => a.frozenValue - b.frozenValue,
            defaultSortOrder: "descend",
            render: (v: number) => (
              <Typography.Text type="danger">{money(v)}</Typography.Text>
            ),
          },
        ]}
      />
    </div>
  );
}

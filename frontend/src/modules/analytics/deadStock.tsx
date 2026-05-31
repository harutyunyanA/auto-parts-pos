import { useState } from "react";
import { Table, Typography, Segmented, Space, Card, Statistic } from "antd";
import { useDeadStock } from "./queries";
import { money } from "./format";
import { useTranslation } from "react-i18next";
import type { IDeadStockItem } from "./types";

const DAY_VALUES = [30, 90, 180, 365];

export function DeadStock() {
  const [days, setDays] = useState(90);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const { t } = useTranslation();
  const { data, isLoading } = useDeadStock(days);

  const dayOptions = DAY_VALUES.map((value) => ({
    label: `${value} ${t("analytics.daysLabel")}`,
    value,
  }));

  const frozenTotal = (data ?? []).reduce((sum, p) => sum + p.frozenValue, 0);

  const handleDaysChange = (value: number) => {
    setDays(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <Space size="large" align="center">
        <Space>
          <Typography.Text type="secondary">
            {t("analytics.noSalesWithin")}
          </Typography.Text>
          <Segmented<number>
            value={days}
            onChange={handleDaysChange}
            options={dayOptions}
          />
        </Space>
        <Card size="small">
          <Statistic
            title={t("analytics.frozenCapital")}
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
          showTotal: (total) => `${total} ${t("analytics.items")}`,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPage);
            setPageSize(nextPageSize);
          },
        }}
        columns={[
          {
            title: t("columns.num"),
            key: "index",
            align: "center",
            width: "5%",
            render: (_t, _r, index) => (page - 1) * pageSize + index + 1,
          },
          {
            title: t("columns.code"),
            dataIndex: "code",
            key: "code",
            align: "center",
            width: "10%",
          },
          {
            title: t("columns.name"),
            dataIndex: "name",
            key: "name",
          },
          {
            title: t("columns.type"),
            dataIndex: "type",
            key: "type",
            align: "center",
            width: "10%",
          },
          {
            title: t("columns.oem"),
            dataIndex: "oem",
            key: "oem",
            align: "center",
            width: "12%",
          },
          {
            title: t("columns.qty"),
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
            width: "8%",
            sorter: (a, b) => a.quantity - b.quantity,
          },
          {
            title: t("columns.purchasePrice"),
            dataIndex: "purchase_price",
            key: "purchase_price",
            align: "right",
            width: "13%",
            render: (v: number) => money(v),
          },
          {
            title: t("columns.frozenValue"),
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

import { useState } from "react";
import { Table, Typography, Segmented, Space } from "antd";
import { useTopProducts } from "./queries";
import { money } from "./format";
import type { ITopProduct, IDateRange, TopProductsSort } from "./types";

interface Props {
  range: IDateRange;
}

export function TopProducts({ range }: Props) {
  const [by, setBy] = useState<TopProductsSort>("revenue");
  const { data, isLoading } = useTopProducts(range, by, 50);

  return (
    <div className="flex flex-col gap-4 h-full">
      <Space>
        <Typography.Text type="secondary">Rank by:</Typography.Text>
        <Segmented<TopProductsSort>
          value={by}
          onChange={setBy}
          options={[
            { label: "Revenue", value: "revenue" },
            { label: "Quantity", value: "qty" },
          ]}
        />
      </Space>

      <Table<ITopProduct>
        dataSource={data}
        loading={isLoading}
        rowKey="productId"
        sticky
        bordered
        size="small"
        pagination={false}
        scroll={{ y: "calc(100vh - 360px)" }}
        columns={[
          {
            title: "№",
            key: "index",
            align: "center",
            width: "5%",
            render: (_t, _r, index) => index + 1,
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
            title: "OEM",
            dataIndex: "oem",
            key: "oem",
            align: "center",
            width: "12%",
          },
          {
            title: "Qty sold",
            dataIndex: "qtySold",
            key: "qtySold",
            align: "right",
            width: "10%",
            sorter: (a, b) => a.qtySold - b.qtySold,
          },
          {
            title: "Revenue",
            dataIndex: "revenue",
            key: "revenue",
            align: "right",
            width: "13%",
            sorter: (a, b) => a.revenue - b.revenue,
            render: (v: number) => money(v),
          },
          {
            title: "Profit",
            dataIndex: "profit",
            key: "profit",
            align: "right",
            width: "13%",
            sorter: (a, b) => a.profit - b.profit,
            render: (v: number) => (
              <Typography.Text type={v >= 0 ? "success" : "danger"}>
                {money(v)}
              </Typography.Text>
            ),
          },
        ]}
      />
    </div>
  );
}

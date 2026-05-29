import { Table, Typography, Row, Col, Card, Statistic } from "antd";
import { useSupplierStats } from "./queries";
import { money } from "./format";
import type { ISupplierStat, IDateRange } from "./types";

interface Props {
  range: IDateRange;
}

export function SuppliersStats({ range }: Props) {
  const { data, isLoading } = useSupplierStats(range);

  const totals = (data ?? []).reduce(
    (acc, s) => {
      acc.purchased += s.purchased;
      acc.sold += s.sold;
      acc.profit += s.profit;
      return acc;
    },
    { purchased: 0, sold: 0, profit: 0 },
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      <Row gutter={16}>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Total purchased" value={money(totals.purchased)} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Total sold" value={money(totals.sold)} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Total profit"
              value={money(totals.profit)}
              valueStyle={{ color: totals.profit >= 0 ? "#3f8600" : "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      <Table<ISupplierStat>
        dataSource={data}
        loading={isLoading}
        rowKey={(r) => String(r.supplierId)}
        sticky
        bordered
        size="small"
        pagination={false}
        scroll={{ y: "calc(100vh - 360px)" }}
        columns={[
          {
            title: "Supplier",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Supplies",
            dataIndex: "supplyCount",
            key: "supplyCount",
            align: "center",
            width: "10%",
            sorter: (a, b) => a.supplyCount - b.supplyCount,
          },
          {
            title: "Purchased",
            dataIndex: "purchased",
            key: "purchased",
            align: "right",
            width: "15%",
            sorter: (a, b) => a.purchased - b.purchased,
            defaultSortOrder: "descend",
            render: (v: number) => money(v),
          },
          {
            title: "Sold",
            dataIndex: "sold",
            key: "sold",
            align: "right",
            width: "15%",
            sorter: (a, b) => a.sold - b.sold,
            render: (v: number) => money(v),
          },
          {
            title: "COGS",
            dataIndex: "cogs",
            key: "cogs",
            align: "right",
            width: "15%",
            render: (v: number) => money(v),
          },
          {
            title: "Profit",
            dataIndex: "profit",
            key: "profit",
            align: "right",
            width: "15%",
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

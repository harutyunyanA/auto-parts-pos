import { useRef } from "react";
import { Table, Typography, Card, Statistic } from "antd";
import { useSupplierStats } from "./queries";
import { money } from "./format";
import { useContainerHeight } from "../../hooks/useContainerHeight";
import { useTranslation } from "react-i18next";
import type { ISupplierStat, IDateRange } from "./types";

interface Props {
  range: IDateRange;
}

export function SuppliersStats({ range }: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = useSupplierStats(range);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = useContainerHeight(containerRef);
  const tableScrollY = Math.max(containerHeight - 56, 200);

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card size="small">
          <Statistic
            title={t("analytics.totalPurchased")}
            value={money(totals.purchased)}
          />
        </Card>
        <Card size="small">
          <Statistic
            title={t("analytics.totalSold")}
            value={money(totals.sold)}
          />
        </Card>
        <Card size="small">
          <Statistic
            title={t("analytics.totalProfit")}
            value={money(totals.profit)}
            valueStyle={{ color: totals.profit >= 0 ? "#3f8600" : "#cf1322" }}
          />
        </Card>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0">
        <Table<ISupplierStat>
          dataSource={data}
          loading={isLoading}
          rowKey={(r) => String(r.supplierId)}
          sticky
          bordered
          size="small"
          pagination={false}
          scroll={{ x: 770, y: tableScrollY }}
          columns={[
            {
              title: t("columns.supplier"),
              dataIndex: "name",
              key: "name",
              ellipsis: true,
            },
            {
              title: t("columns.supplies"),
              dataIndex: "supplyCount",
              key: "supplyCount",
              align: "center",
              width: 90,
              sorter: (a, b) => a.supplyCount - b.supplyCount,
            },
            {
              title: t("columns.purchased"),
              dataIndex: "purchased",
              key: "purchased",
              align: "right",
              width: 130,
              sorter: (a, b) => a.purchased - b.purchased,
              defaultSortOrder: "descend",
              render: (v: number) => money(v),
            },
            {
              title: t("columns.sold"),
              dataIndex: "sold",
              key: "sold",
              align: "right",
              width: 130,
              sorter: (a, b) => a.sold - b.sold,
              render: (v: number) => money(v),
            },
            {
              title: t("columns.cogs"),
              dataIndex: "cogs",
              key: "cogs",
              align: "right",
              width: 130,
              render: (v: number) => money(v),
            },
            {
              title: t("columns.profit"),
              dataIndex: "profit",
              key: "profit",
              align: "right",
              width: 130,
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
    </div>
  );
}

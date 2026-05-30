import { useState } from "react";
import { Tabs, DatePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { SuppliersStats } from "../modules/analytics/suppliersStats";
import { TopProducts } from "../modules/analytics/topProducts";
import { DeadStock } from "../modules/analytics/deadStock";
import type { IDateRange } from "../modules/analytics/types";

const { RangePicker } = DatePicker;

export default function Analytics() {
  const [activeKey, setActiveKey] = useState("suppliers");
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const range: IDateRange = {
    from: dates[0]?.format("YYYY-MM-DD"),
    to: dates[1]?.format("YYYY-MM-DD"),
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        tabBarExtraContent={
          activeKey !== "dead" ? (
            <RangePicker
              value={dates}
              onChange={(d) =>
                d && d[0] && d[1] && setDates([d[0], d[1]])
              }
              allowClear={false}
              maxDate={dayjs()}
              variant="filled"
            />
          ) : null
        }
        items={[
          {
            key: "suppliers",
            label: "Suppliers",
            children: <SuppliersStats range={range} />,
          },
          {
            key: "top",
            label: "Top Products",
            children: <TopProducts range={range} />,
          },
          {
            key: "dead",
            label: "Dead Stock",
            children: <DeadStock />,
          },
        ]}
      />
    </div>
  );
}

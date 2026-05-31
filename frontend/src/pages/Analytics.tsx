import { useState } from "react";
import { Tabs, DatePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { SuppliersStats } from "../modules/analytics/suppliersStats";
import { DeadStock } from "../modules/analytics/deadStock";
import type { IDateRange } from "../modules/analytics/types";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

export default function Analytics() {
  const { t } = useTranslation();
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
            label: t("analytics.tabSuppliers"),
            children: <SuppliersStats range={range} />,
          },
          {
            key: "dead",
            label: t("analytics.tabDeadStock"),
            children: <DeadStock />,
          },
        ]}
      />
    </div>
  );
}

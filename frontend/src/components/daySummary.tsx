import { useEffect, useState } from "react";
import type { ISalesSummary } from "../modules/sales/types";
import { useCurrentDate } from "../store/useDateStore";
import api from "../api/client";
import type { ApiResponse } from "../types/api.types";
import { Divider, Flex } from "antd";
import Text from "antd/es/typography/Text";

export function DaySummary() {
  const currentDate = useCurrentDate();

  const [daySummary, setDaySummary] = useState<ISalesSummary | null>(null);

  useEffect(() => {
    api
      .get<ApiResponse<ISalesSummary>>(`/sale/summary/${currentDate}`)
      .then((res) => {
        setDaySummary(res.data.data);
      });
  }, [currentDate]);

  if (!daySummary) {
    return null;
  }

  return (
    <>
      <Flex vertical>
        <Flex vertical gap={"small"}>
          <Text strong>
            Cash paid: {daySummary.totalIncome - daySummary.totalCardIncome}
          </Text>
          <Text strong>Card paid: {daySummary.totalCardIncome}</Text>
        </Flex>
        <Divider />
        <Flex>
          <Text>Total income: {daySummary.totalIncome}</Text>
        </Flex>
      </Flex>
    </>
  );
}

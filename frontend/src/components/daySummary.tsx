import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ISalesSummary } from "../modules/sales/types";
import { useCurrentDate } from "../store/useDateStore";
import api from "../api/client";
import type { ApiResponse } from "../types/api.types";
import { Divider, Flex, Spin } from "antd";
import Text from "antd/es/typography/Text";

export function DaySummary() {
  const { t } = useTranslation();
  const currentDate = useCurrentDate();

  const [daySummary, setDaySummary] = useState<ISalesSummary | null>(null);

  useEffect(() => {
    api
      .get<ApiResponse<ISalesSummary>>(`/sale/summary/${currentDate}`)
      .then((res) => {
        setDaySummary(res.data.data ?? null);
      });
  }, [currentDate]);

  if (!daySummary) {
    return (
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Spin description={t("common.loading")} size="large" />
      </Flex>
    );
  }

  return (
    <>
      <Flex vertical>
        <Flex vertical gap={"small"}>
          <Text strong>
            {t("summary.cashPaid")}:{" "}
            {daySummary.totalIncome - daySummary.totalCardIncome}
          </Text>
          <Text strong>
            {t("summary.cardPaid")}: {daySummary.totalCardIncome}
          </Text>
        </Flex>
        <Divider />
        <Flex>
          <Text>
            {t("summary.totalIncome")}: {daySummary.totalIncome}
          </Text>
        </Flex>
      </Flex>
    </>
  );
}

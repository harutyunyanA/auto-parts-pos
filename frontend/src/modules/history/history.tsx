import { Button, DatePicker, Input, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "../../api/client";
import type { IHistory } from "./types";
import type { ApiResponse } from "../../types/api.types";

const { RangePicker } = DatePicker;

type AppliedParams = {
  id: string;
  oem: string;
  from: string;
  to: string;
};

export function ProductHistory() {
  const { t } = useTranslation();
  const [oem, setOEM] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [date, setDate] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
  const [applied, setApplied] = useState<AppliedParams | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["product/history", applied],
    queryFn: async () => {
      const res = await api.get<ApiResponse<IHistory[]>>("/product/history", {
        params: {
          ...(applied!.id ? { id: applied!.id } : {}),
          ...(applied!.oem ? { oem: applied!.oem } : {}),
          from: applied!.from,
          to: applied!.to,
        },
      });
      return res.data.data ?? [];
    },
    enabled: applied !== null,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const handleSearch = () => {
    if (!productId && !oem) return;
    setApplied({
      id: productId,
      oem,
      from: date[0].format("YYYY-MM-DD"),
      to: date[1].format("YYYY-MM-DD"),
    });
  };

  const columns: ColumnsType<IHistory> = [
    {
      title: t("columns.date"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
    },
    {
      title: t("columns.operation"),
      dataIndex: "operation",
      key: "operation",
      width: 100,
      render: (op: IHistory["operation"]) => (
        <Tag color={op === "IN" ? "green" : "red"}>{op}</Tag>
      ),
    },
    {
      title: t("columns.id"),
      dataIndex: ["product", "id"],
      key: "id",
      width: 90,
    },
    {
      title: t("columns.oem"),
      dataIndex: ["product", "oem"],
      key: "oem",
    },
    {
      title: t("columns.name"),
      dataIndex: ["product", "name"],
      key: "name",
    },
    {
      title: t("columns.type"),
      dataIndex: ["product", "type"],
      key: "type",
    },
    {
      title: t("columns.qty"),
      dataIndex: "quantity",
      key: "quantity",
      width: 90,
    },
    {
      title: t("columns.price"),
      key: "price",
      width: 110,
      render: (_, row) =>
        row.operation === "IN" ? row.purchasePrice : row.priceAtSale,
    },
    {
      title: t("columns.total"),
      key: "total",
      width: 120,
      render: (_, row) =>
        row.operation === "IN" ? row.totalCost : row.totalPrice,
    },
    {
      title: t("columns.document"),
      key: "doc",
      width: 110,
      render: (_, row) =>
        row.operation === "IN"
          ? t("history.supplyDoc", { id: row.supplyId })
          : t("history.cartDoc", { id: row.cartId }),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-6">
        <Input
          placeholder={t("columns.id")}
          size="large"
          value={productId}
          disabled={oem.length > 0}
          allowClear={{ clearIcon: <CloseOutlined /> }}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length < 9) setProductId(value);
          }}
          onPressEnter={handleSearch}
          style={{ width: "20%" }}
        />

        <Input
          placeholder={t("columns.oem")}
          size="large"
          value={oem}
          allowClear={{ clearIcon: <CloseOutlined /> }}
          disabled={productId.length > 0}
          onChange={(e) => setOEM(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: "30%" }}
        />

        <RangePicker
          format="DD-MM-YYYY"
          value={date}
          onChange={(v) => v && setDate(v as [Dayjs, Dayjs])}
          allowClear={false}
        />
        <Button size="large" onClick={handleSearch} loading={isFetching}>
          {t("common.search")}
        </Button>
      </div>
      <Table<IHistory>
        rowKey={(row) => `${row.operation}-${row.id}`}
        columns={columns}
        dataSource={data ?? []}
        loading={isFetching}
        pagination={{ pageSize: 20, showSizeChanger: false }}
        size="middle"
      />
    </div>
  );
}

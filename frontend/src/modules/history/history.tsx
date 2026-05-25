import { Button, DatePicker, Input, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import type { IHistory } from "./types";
import type { ApiResponse } from "../../types/api.types";

const { RangePicker } = DatePicker;

type AppliedParams = {
  code: string;
  oem: string;
  from: string;
  to: string;
};

export function ProductHistory() {
  const [oem, setOEM] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [date, setDate] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
  const [applied, setApplied] = useState<AppliedParams | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["product/history", applied],
    queryFn: async () => {
      const res = await api.get<ApiResponse<IHistory[]>>("/product/history", {
        params: {
          ...(applied!.code ? { code: applied!.code } : {}),
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
    if (!code && !oem) return;
    setApplied({
      code,
      oem,
      from: date[0].format("YYYY-MM-DD"),
      to: date[1].format("YYYY-MM-DD"),
    });
  };

  const columns: ColumnsType<IHistory> = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      key: "operation",
      width: 100,
      render: (op: IHistory["operation"]) => (
        <Tag color={op === "IN" ? "green" : "red"}>{op}</Tag>
      ),
    },
    {
      title: "Code",
      dataIndex: ["product", "code"],
      key: "code",
      width: 90,
    },
    {
      title: "OEM",
      dataIndex: ["product", "serial_number"],
      key: "serial_number",
    },
    {
      title: "Name",
      dataIndex: ["product", "name"],
      key: "name",
    },
    {
      title: "Type",
      dataIndex: ["product", "type"],
      key: "type",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      width: 90,
    },
    {
      title: "Price",
      key: "price",
      width: 110,
      render: (_, row) =>
        row.operation === "IN" ? row.purchasePrice : row.priceAtSale,
    },
    {
      title: "Total",
      key: "total",
      width: 120,
      render: (_, row) =>
        row.operation === "IN" ? row.totalCost : row.totalPrice,
    },
    {
      title: "Document",
      key: "doc",
      width: 110,
      render: (_, row) =>
        row.operation === "IN"
          ? `Supply #${row.supplyId}`
          : `Cart #${row.cartId}`,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-6">
        <Input
          placeholder="Code"
          size="large"
          value={code}
          disabled={oem.length > 0}
          allowClear={{ clearIcon: <CloseOutlined /> }}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length < 6) setCode(value);
          }}
          onPressEnter={handleSearch}
          style={{ width: "20%" }}
        />

        <Input
          placeholder="OEM"
          size="large"
          value={oem}
          allowClear={{ clearIcon: <CloseOutlined /> }}
          disabled={code.length > 0}
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
          Search
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

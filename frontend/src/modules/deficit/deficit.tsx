import { useState } from "react";
import { Button, Table, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../../types/api.types";
import type { IProduct } from "../products/types";
import api from "../../api/client";
import { useSource } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";

export function Deficit() {
  const { t } = useTranslation();
  const source = useSource();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading } = useQuery({
    queryKey: ["deficit", source],
    queryFn: () =>
      api
        .get<ApiResponse<IProduct[]>>("/product/deficit")
        .then((res) => res.data.data),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-start">
        <Button icon={<PrinterOutlined />}>{t("common.print")}</Button>
      </div>
      <Table
        dataSource={data}
        loading={isLoading}
        rowKey="id"
        sticky
        bordered
        size="small"
        scroll={{ y: "calc(100vh - 310px)" }}
      pagination={{
        current: page,
        size: "medium",
        pageSize,
        placement: ["bottomStart"],
        showSizeChanger: true,
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
          render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
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
          render: (text) => (
            <Typography.Text type="danger">{text}</Typography.Text>
          ),
        },
        {
          title: t("columns.min"),
          dataIndex: "minimum_quantity",
          key: "minimum_quantity",
          align: "center",
          width: "8%",
        },
        {
          title: t("columns.purchasePrice"),
          dataIndex: "purchase_price",
          key: "purchase_price",
          align: "center",
          width: "12%",
        },
      ]}
      />
    </div>
  );
}

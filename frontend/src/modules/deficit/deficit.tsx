import { useRef, useState } from "react";
import { Button, Pagination, Table, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../../types/api.types";
import type { IProduct } from "../products/types";
import api from "../../api/client";
import { useSource } from "../../store/useAuthStore";
import { useContainerHeight } from "../../hooks/useContainerHeight";
import { useTranslation } from "react-i18next";

export function Deficit() {
  const { t } = useTranslation();
  const source = useSource();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = useContainerHeight(containerRef);
  const tableScrollY = Math.max(containerHeight - 52, 160);

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
      <div ref={containerRef} className="flex-1 min-h-0 overflow-hidden">
      <Table
        dataSource={(data ?? []).slice((page - 1) * pageSize, page * pageSize)}
        loading={isLoading}
        rowKey="id"
        sticky
        bordered
        size="small"
        scroll={{ x: 800, y: tableScrollY }}
        pagination={false}
      columns={[
        {
          title: t("columns.num"),
          key: "index",
          align: "center",
          width: 60,
          render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
        },
        {
          title: t("columns.code"),
          dataIndex: "code",
          key: "code",
          align: "center",
          width: 90,
        },
        {
          title: t("columns.name"),
          dataIndex: "name",
          key: "name",
          ellipsis: true,
        },
        {
          title: t("columns.type"),
          dataIndex: "type",
          key: "type",
          align: "center",
          width: 90,
          ellipsis: true,
        },
        {
          title: t("columns.oem"),
          dataIndex: "oem",
          key: "oem",
          align: "center",
          width: 130,
          ellipsis: true,
        },
        {
          title: t("columns.qty"),
          dataIndex: "quantity",
          key: "quantity",
          align: "center",
          width: 80,
          render: (text) => (
            <Typography.Text type="danger">{text}</Typography.Text>
          ),
        },
        {
          title: t("columns.min"),
          dataIndex: "minimum_quantity",
          key: "minimum_quantity",
          align: "center",
          width: 80,
        },
        {
          title: t("columns.purchasePrice"),
          dataIndex: "purchase_price",
          key: "purchase_price",
          align: "center",
          width: 120,
        },
      ]}
      />
      </div>
      <Pagination
        className="shrink-0"
        current={page}
        pageSize={pageSize}
        total={data?.length ?? 0}
        showSizeChanger
        onChange={(nextPage, nextPageSize) => {
          setPage(nextPage);
          setPageSize(nextPageSize);
        }}
      />
    </div>
  );
}

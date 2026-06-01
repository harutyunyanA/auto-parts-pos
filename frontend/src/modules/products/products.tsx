import { type RefObject, useEffect, useState } from "react";
import type { IProduct } from "./types";
import { Flex, Pagination, Table, Input, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../../types/api.types";
import api from "../../api/client";
import { useSource } from "../../store/useAuthStore";
import { useContainerHeight } from "../../hooks/useContainerHeight";
import { useTranslation } from "react-i18next";

export function Products({
  filters,
  containerRef,
}: {
  filters: any;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const containerHeight = useContainerHeight(containerRef);
  const tableScrollY = Math.max(containerHeight - 90, 200);
  const source = useSource();
  const { t } = useTranslation();

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading } = useQuery({
    queryKey: ["products", page, limit, filters, source],
    queryFn: () =>
      api
        .get<ApiResponse<{ items: IProduct[]; total: number }>>("/product/all", {
          params: {
            page,
            limit,
            ...filters,
          },
        })
        .then((res) => res.data.data),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return (
    <Flex vertical gap={"middle"} style={{ height: "100%", minHeight: 0 }}>
      <Table
        dataSource={data?.items}
        loading={isLoading}
        rowKey={"id"}
        sticky
        bordered
        style={{ height: "100%", minHeight: 0, overflow: "hidden" }}
        size="small"
        scroll={{ x: 1140, y: tableScrollY }}
        pagination={false}
        columns={[
          {
            title: t("columns.code"),
            dataIndex: "code",
            key: "code",
            align: "center",
            width: 80,
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
            title: t("columns.quantity"),
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
            width: 80,
            render: (text, record) => (
              <Typography.Text
                type={
                  record.minimum_quantity !== null &&
                  record.quantity <= record.minimum_quantity
                    ? "danger"
                    : undefined
                }
              >
                {text}
              </Typography.Text>
            ),
          },
          {
            title: t("columns.purchasePrice"),
            dataIndex: "purchase_price",
            key: "purchase_price",
            align: "center",
            width: 110,
          },
          {
            title: t("columns.salePrice"),
            dataIndex: "sale_price",
            key: "sale_price",
            align: "center",
            width: 110,
          },
          {
            title: t("columns.supplier"),
            dataIndex: ["supplier", "name"],
            align: "center",
            key: "supplier",
            width: 140,
            ellipsis: true,
          },
          {
            title: t("columns.min"),
            dataIndex: "minimum_quantity",
            key: "minimum_quantity",
            align: "center",
            width: 90,
            render: (text, record) => {
              const isEnabled = text !== null && text !== undefined;
              return (
                <Flex gap="small" align="center" justify="center">
                  <Input
                    key={`${record.id}-min-${text}`}
                    defaultValue={isEnabled ? String(text) : ""}
                    variant="borderless"
                    style={{ textAlign: "center", padding: 0, width: "40px" }}
                  />
                </Flex>
              );
            },
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
            title: t("columns.wxqp"),
            dataIndex: "WXQP",
            key: "WXQP",
            align: "center",
            width: 130,
            ellipsis: true,
          },
        ]}
      />
      <Pagination
        current={page}
        total={data?.total}
        pageSize={limit}
        onChange={(page, limit) => {
          setPage(page);
          setLimit(limit);
        }}
      />
    </Flex>
  );
}

import { type RefObject, useEffect, useState } from "react";
import type { IProduct } from "./types";
import { Flex, Pagination, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../../types/api.types";
import api from "../../api/client";

function useContainerHeight(containerRef: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(400);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        if (h > 0) setHeight(h);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  return height;
}

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

  

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading } = useQuery({
    queryKey: ["products/all", page, limit, filters],
    queryFn: () =>
      api
        .get<ApiResponse<{ items: IProduct[]; total: number }>>(
          "/product/all",
          {
            params: {
              page,
              limit,
              ...filters,
            },
          },
        )
        .then((res) => res.data.data),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return (
    <Flex
      vertical
      gap={"middle"}
      style={{ height: "100%", minHeight: 0 }}
    >
      <Table
        dataSource={data?.items}
        loading={isLoading}
        rowKey={"id"}
        bordered
        sticky
        style={{
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
          flex: 1,
          minHeight: 0,
        }}
        size="small"
        scroll={{ y: tableScrollY }}
        pagination={false}
        columns={[
          {
            title: "Code",
            dataIndex: "code",
            key: "code",
            align: "center",
            width: "7%",
          },
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Type",
            dataIndex: "type",
            key: "type",
            align: "center",
            width: "7%",
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
            width: "7%",
          },
          {
            title: "Purchase price",
            dataIndex: "purchase_price",
            key: "purchase_price",
            align: "center",
            width: "10%",
          },
          {
            title: "Sale price",
            dataIndex: "sale_price",
            key: "sale_price",
            align: "center",
            width: "10%",
          },
          {
            title: "Supplier",
            dataIndex: ["supplier", "name"],
            align: "center",
            key: "supplier",
            width: "12%",
          },
          {
            title: "Min",
            dataIndex: "minimum_quantity",
            key: "minimum_quantity",
            align: "center",
            width: "5%",
          },
          {
            title: "OEM",
            dataIndex: "serial_number",
            key: "serial_number",
            align: "center",
            width: "12%",
          },
          {
            title: "WXQP",
            dataIndex: "WXQP",
            key: "WXQP",
            align: "center",
            width: "12%",
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

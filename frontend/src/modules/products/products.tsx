import { type RefObject, useEffect, useState } from "react";
import type { IProduct } from "./types";
import { Flex, Pagination, Table, theme, Checkbox, Input, Typography } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "../../types/api.types";
import api from "../../api/client";
import { useSource } from "../../store/useAuthStore";

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
  const { token } = theme.useToken();
  const source = useSource();
  const queryClient = useQueryClient();

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

  // const mutationUpdateMin = useMutation({
  //   mutationFn: (vars: { code: number; min: number | null }) =>
  //     api.patch(
  //       `/product`,
  //       { minimum_quantity: vars.min },
  //       { params: { code: vars.code, source } },
  //     ),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["products"] });
  //   },
  // });

  return (
    <Flex vertical gap={"middle"} style={{ height: "100%", minHeight: 0 }}>
      <Table
        dataSource={data?.items}
        loading={isLoading}
        rowKey={"id"}
        sticky
        bordered
        style={{
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
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
            width: "8%",
            render: (text, record) => {
              const isEnabled = text !== null && text !== undefined;
              return (
                <Flex gap="small" align="center" justify="center">
                  {/* <Checkbox
                    checked={isEnabled}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      mutationUpdateMin.mutate({
                        code: record.code,
                        min: checked ? 0 : null,
                      });
                    }}
                  /> */}
                  <Input
                    // disabled={!isEnabled}
                    key={`${record.id}-min-${text}`}
                    defaultValue={isEnabled ? String(text) : ""}
                    variant="borderless"
                    style={{ textAlign: "center", padding: 0, width: "40px" }}
                    // onPressEnter={(e: any) => {
                    //   mutationUpdateMin.mutate({
                    //     code: record.code,
                    //     min: Number(e.target.value),
                    //   });
                    // }}
                    // onBlur={(e: any) => {
                    //   const val = e.target.value;
                    //   if (isEnabled && val !== String(text)) {
                    //     mutationUpdateMin.mutate({
                    //       code: record.code,
                    //       min: Number(val),
                    //     });
                    //   }
                    // }}
                  />
                </Flex>
              );
            },
          },
          {
            title: "OEM",
            dataIndex: "oem",
            key: "oem",
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

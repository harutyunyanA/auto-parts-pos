import { useEffect, useState } from "react";
import type { IProduct } from "./types";
import { Flex, Pagination, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../../types/api.types";
import api from "../../api/client";
import { theme } from "antd";

export function Products({ filters }: { filters: any }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const { token } = theme.useToken();
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
    <>
      <Flex vertical gap={"large"}>
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
            height: "100%",
            // border: `1px solid ${token.colorBorder}`,
            minHeight: 0,
            overflowY: "auto",
            // borderRadius: token.borderRadiusLG,
          }}
          size="small"
          scroll={{ y: "calc(100vh - 420px)" }}
          pagination={false}
          // pagination={{
          //   disabled: true,
          //   position: ["bottomLeft"],
          //   current: page,
          //   total: data?.total,
          //   pageSize: limit,
          //   onChange: (page, limit) => {
          //     setPage(page);
          //     setLimit(limit);
          //   },
          // }}
          columns={[
            {
              title: "Code",
              dataIndex: "code",
              key: "code",
              align: "center",
              width: 80,
            },
            {
              title: "Name",
              dataIndex: "name",
              key: "name",
              //  align: "center"
            },
            {
              title: "Type",
              dataIndex: "type",
              key: "type",
              align: "center",
              width: 80,
            },
            {
              title: "Quantity",
              dataIndex: "quantity",
              key: "quantity",
              align: "center",
              width: 80,
            },
            {
              title: "Purchase price",
              dataIndex: "purchase_price",
              key: "purchase_price",
              align: "center",
              width: 120,
            },
            {
              title: "Sale price",
              dataIndex: "sale_price",
              key: "sale_price",
              align: "center",
              width: 120,
            },
            {
              title: "Supplier",
              dataIndex: ["supplier", "name"],
              align: "center",
              key: "supplier",
              width: 150,
            },
            {
              title: "Min",
              dataIndex: "minimum_quantity",
              key: "minimum_quantity",
              align: "center",
              width: 60,
            },
            {
              title: "OEM",
              dataIndex: "serial_number",
              key: "serial_number",
              align: "center",
              width: 150,
            },
            {
              title: "WXQP",
              dataIndex: "WXQP",
              key: "WXQP",
              align: "center",
              width: 150,
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
    </>
  );
}

import { useState } from "react";
import { Button, Table, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../../types/api.types";
import type { IProduct } from "../products/types";
import api from "../../api/client";
import { useSource } from "../../store/useAuthStore";

export function Deficit() {
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
        <Button icon={<PrinterOutlined />}>Print</Button>
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
          title: "№",
          key: "index",
          align: "center",
          width: "5%",
          render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
        },
        {
          title: "Code",
          dataIndex: "code",
          key: "code",
          align: "center",
          width: "10%",
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
          width: "10%",
        },
        {
          title: "OEM",
          dataIndex: "oem",
          key: "oem",
          align: "center",
          width: "12%",
        },
        {
          title: "Qty",
          dataIndex: "quantity",
          key: "quantity",
          align: "center",
          width: "8%",
          render: (text) => (
            <Typography.Text type="danger">{text}</Typography.Text>
          ),
        },
        {
          title: "Min",
          dataIndex: "minimum_quantity",
          key: "minimum_quantity",
          align: "center",
          width: "8%",
        },
        {
          title: "Purchase price",
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

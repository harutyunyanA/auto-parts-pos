import { Table, theme } from "antd";
import { useSupplyTable } from "../../hooks/useSupplyTable";
import type { ISupplyItem } from "./types";

interface SupplyProps {
  supply:
    | {
        id: number;
        status: string;
        items: ISupplyItem[];
      }
    | undefined;
}

export function Supply({ supply }: SupplyProps) {
  const { token } = theme.useToken();
  const { columns, dataSource } = useSupplyTable({ supply });

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="key"
      pagination={false}
      bordered
      size="small"
      sticky
      scroll={{ y: "calc(100vh - 300px)" }}
      style={{
        borderRadius: token.borderRadiusLG,
        overflow: "hidden",
      }}
    />
  );
}

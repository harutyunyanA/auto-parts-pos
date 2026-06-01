import { Table, theme } from "antd";
import { useRef } from "react";
import { useSupplyTable } from "../../hooks/useSupplyTable";
import { useContainerHeight } from "../../hooks/useContainerHeight";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = useContainerHeight(containerRef);
  const tableScrollY = Math.max(containerHeight - 48, 200);

  return (
    <div ref={containerRef} className="flex flex-col h-full min-h-0">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={false}
        bordered
        size="small"
        sticky
        scroll={{ x: 1240, y: tableScrollY }}
        style={{ borderRadius: token.borderRadiusLG, overflow: "hidden" }}
      />
    </div>
  );
}

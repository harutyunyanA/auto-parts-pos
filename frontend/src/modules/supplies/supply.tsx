import { Input, Table, theme, Typography, message, Checkbox, Flex } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useRef, useEffect } from "react";
import { useSupplyMutations } from "./mutations";
import type { ISupplyItem } from "./types";

const { Text } = Typography;

interface SupplyProps {
  supply:
    | {
        id: number;
        status: string;
        items: ISupplyItem[];
      }
    | undefined;
}

type FieldType =
  | "code"
  | "quantity"
  | "purchasePrice"
  | "salePrice"
  | "minQuantity";

export function Supply({ supply }: SupplyProps) {
  const { token } = theme.useToken();
  const [focusTarget, setFocusTarget] = useState<{
    id: number | "new";
    field: FieldType;
  }>({ id: "new", field: "code" });
  const inputRefs = useRef<Record<string, any>>({});
  const { mutationAdd, mutationUpdate, mutationDelete, mutationStatusToggle } =
    useSupplyMutations({
      supplyId: supply?.id,
      setFocusTarget,
    });

  const isCompleted = supply?.status === "completed";

  const fields: FieldType[] = [
    "code",
    "quantity",
    "purchasePrice",
    "salePrice",
  ];

  const handleCodeChange = async (record: any, code: string) => {
    if (!code) return;

    if (record.isNew) {
      mutationAdd.mutate(code);
    } else {
      if (String(record.product?.code) === String(code)) {
        setFocusTarget({ id: record.id, field: "quantity" });
        return;
      }
      if (record.quantity > 0) {
        message.error("Cannot change code if quantity > 0");
        return;
      }
      try {
        await mutationDelete.mutateAsync(record.id);
        mutationAdd.mutate(code);
      } catch (e: any) {
        message.error(e.response?.data?.message || "Failed to replace item");
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    record: any,
    field: FieldType,
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLInputElement;
      if (target) {
        const originalValue =
          field === "code" ? record.product?.code : record[field];
        const val = String(originalValue ?? "");

        // React value setter trick to ensure it works even with controlled components
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(target, val);

        // Dispatch events to notify React/Antd about the change
        target.dispatchEvent(new Event("input", { bubbles: true }));
        target.dispatchEvent(new Event("change", { bubbles: true }));

        setTimeout(() => {
          target.select();
        }, 0);
      }
      return;
    }

    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
      return;

    const currentIndex = dataSource.findIndex(
      (item) => item.key === record.key,
    );
    const fieldIndex = fields.indexOf(field);

    let nextIndex = currentIndex;
    let nextField = field;

    if (e.key === "ArrowUp") {
      nextIndex = Math.max(0, currentIndex - 1);
    } else if (e.key === "ArrowDown") {
      nextIndex = Math.min(dataSource.length - 1, currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      nextField = fields[Math.max(0, fieldIndex - 1)];
    } else if (e.key === "ArrowRight") {
      nextField = fields[Math.min(fields.length - 1, fieldIndex + 1)];
    }

    const nextRecord = dataSource[nextIndex] as any;
    if (nextRecord.isNew && nextField !== "code") {
      nextField = "code";
    }

    if (nextIndex !== currentIndex || nextField !== field) {
      e.preventDefault();
      setFocusTarget({
        id: nextRecord.isNew ? "new" : nextRecord.id,
        field: nextField,
      });
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 80,
      align: "center",
      render: (text, record) => (
        <Input
          key={
            record.isNew
              ? `new-code-${supply?.items?.length || 0}`
              : `${record.id}-code`
          }
          ref={(el) => {
            inputRefs.current[
              record.isNew
                ? `new-code-${supply?.items?.length || 0}`
                : `${record.id}-code`
            ] = el;
          }}
          defaultValue={record.isNew ? "" : record.product?.code}
          variant="borderless"
          style={{ textAlign: "center", padding: 0 }}
          readOnly={isCompleted}
          onFocus={(e) => {
            if (isCompleted) return;
            e.target.select();
          }}
          onKeyDown={(e) => handleKeyDown(e, record, "code")}
          onPressEnter={(e: any) => {
            if (isCompleted) return;
            handleCodeChange(record, e.target.value);
          }}
        />
      ),
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) =>
        record.product?.name || (record.isNew ? "" : "Unknown"),
    },
    {
      title: "Type",
      key: "type",
      width: 100,
      render: (_, record) => record.product?.type,
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "center",
      render: (text, record) =>
        record.isNew ? null : (
          <Input
            key={`${record.id}-quantity-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-quantity`] = el;
            }}
            defaultValue={text}
            variant="borderless"
            style={{ textAlign: "center", padding: 0 }}
            readOnly={isCompleted}
            onFocus={(e) => {
              if (isCompleted) return;
              e.target.select();
            }}
            onKeyDown={(e) => handleKeyDown(e, record, "quantity")}
            onPressEnter={(e: any) => {
              if (isCompleted) return;
              mutationUpdate.mutate({
                id: record.id,
                data: { quantity: Number(e.target.value) },
              });
            }}
          />
        ),
    },
    {
      title: "Buy Price",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      width: 100,
      align: "right",
      render: (text, record) =>
        record.isNew ? null : (
          <Input
            key={`${record.id}-purchasePrice-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-purchasePrice`] = el;
            }}
            defaultValue={text}
            variant="borderless"
            style={{ textAlign: "right", padding: 0 }}
            readOnly={isCompleted}
            onFocus={(e) => {
              if (isCompleted) return;
              e.target.select();
            }}
            onKeyDown={(e) => handleKeyDown(e, record, "purchasePrice")}
            onPressEnter={(e: any) => {
              if (isCompleted) return;
              mutationUpdate.mutate({
                id: record.id,
                data: { purchasePrice: Number(e.target.value) },
              });
            }}
          />
        ),
    },
    {
      title: "Sale Price",
      dataIndex: "salePrice",
      key: "salePrice",
      width: 100,
      align: "right",
      render: (text, record) =>
        record.isNew ? null : (
          <Input
            key={`${record.id}-salePrice-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-salePrice`] = el;
            }}
            defaultValue={text}
            variant="borderless"
            style={{ textAlign: "right", padding: 0 }}
            readOnly={isCompleted}
            onFocus={(e) => {
              if (isCompleted) return;
              e.target.select();
            }}
            onKeyDown={(e) => handleKeyDown(e, record, "salePrice")}
            onPressEnter={(e: any) => {
              if (isCompleted) return;
              mutationUpdate.mutate({
                id: record.id,
                data: { salePrice: Number(e.target.value) },
              });
            }}
          />
        ),
    },
    {
      title: "In Stock",
      key: "inStock",
      width: 90,
      align: "center",
      render: (_, record) =>
        record.isNew ? null : (
          <Text
            type={
              record.product &&
              record.product.minimum_quantity !== null &&
              record.product.quantity <= record.product.minimum_quantity
                ? "danger"
                : undefined
            }
          >
            {record.product?.quantity ?? "-"}
          </Text>
        ),
    },

    {
      title: "Min",
      dataIndex: "minQuantity",
      key: "minQuantity",
      width: 100,
      align: "center",
      render: (text, record) => {
        if (record.isNew) return null;
        const currentMin = text ?? record.product?.minimum_quantity;
        const isEnabled = currentMin !== null && currentMin !== undefined;

        return (
          <Flex gap="small" align="center" justify="center">
            <Checkbox
              checked={isEnabled}
              disabled={isCompleted}
              onChange={(e) => {
                const checked = e.target.checked;
                mutationUpdate.mutate({
                  id: record.id,
                  data: { minQuantity: checked ? 0 : null },
                });
              }}
            />
            <Input
              disabled={!isEnabled || isCompleted}
              key={`${record.id}-minQuantity-${text}`}
              ref={(el) => {
                inputRefs.current[`${record.id}-minQuantity`] = el;
              }}
              defaultValue={isEnabled ? String(currentMin) : ""}
              variant="borderless"
              style={{ textAlign: "center", padding: 0, width: "40px" }}
              onFocus={(e) => {
                if (isCompleted) return;
                e.target.select();
              }}
              onKeyDown={(e) => handleKeyDown(e, record, "minQuantity")}
              onPressEnter={(e: any) => {
                if (isCompleted) return;
                mutationUpdate.mutate({
                  id: record.id,
                  data: { minQuantity: Number(e.target.value) },
                });
              }}
              onBlur={(e: any) => {
                if (isCompleted) return;
                const val = e.target.value;
                if (isEnabled && val !== String(currentMin)) {
                  mutationUpdate.mutate({
                    id: record.id,
                    data: { minQuantity: Number(val) },
                  });
                }
              }}
            />
          </Flex>
        );
      },
    },

    {
      title: "Profit",
      key: "profit",
      width: 80,
      align: "center",
      render: (_, record) => {
        if (record.isNew) return null;
        const buy = Number(record.purchasePrice);
        const sale = Number(record.salePrice);
        if (!buy || !sale) return "-";
        const profit = ((sale - buy) / buy) * 100;
        return (
          <Text type={profit < 0 ? "danger" : "success"} strong>
            {profit > 0 ? "+" : ""}
            {profit.toFixed(0)}%
          </Text>
        );
      },
    },
  ];

  const dataSource = [
    ...(supply?.items || []).map((item) => ({ ...item, key: item.id })),
    ...(!isCompleted ? [{ key: "new", isNew: true }] : []),
  ];

  useEffect(() => {
    const key =
      focusTarget.id === "new"
        ? `new-code-${supply?.items?.length || 0}`
        : `${focusTarget.id}-${focusTarget.field}`;
    const timer = setTimeout(() => {
      const input = inputRefs.current[key];
      if (input) {
        input.focus();
        if (input.select) input.select();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [focusTarget, supply?.items?.length]);

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

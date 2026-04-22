import { Input, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ICart, ICartItem } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useCurrentDate } from "../../store/useDateStore";
import { usePurchasePriceStore } from "../../store/usePurchasePriceStore";
import { useCartMutations } from "./mutations";

interface CartProps {
  cart: ICart;
}

export function Cart({ cart }: CartProps) {
  const queryClient = useQueryClient();
  const currentDate = useCurrentDate();
  const setActivePrice = usePurchasePriceStore((state) => state.setActivePrice);
  const [focusTarget, setFocusTarget] = useState<{
    id: number | "new";
    field: "code" | "quantity" | "price";
  }>({ id: "new", field: "code" });

  const inputRefs = useRef<Record<string, any>>({});

  const { mutationAdd, mutationQty, mutationPrice, mutationDelete } =
    useCartMutations({
      cartId: cart.id,
      currentDate,
      setFocusTarget,
    });

    

  const handleCodeChange = async (record: any, code: string) => {
    if (!code) return;
    if (record.isNew) {
      mutationAdd.mutate(code);
    } else {
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

  const fields: ("code" | "quantity" | "price")[] = ["code", "quantity", "price"];

  const handleKeyDown = (
    e: React.KeyboardEvent,
    record: any,
    field: "code" | "quantity" | "price"
  ) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
      return;

    const currentIndex = dataSource.findIndex((item) => item.key === record.key);
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

    const nextRecord = dataSource[nextIndex];

    // If moving onto the "new" row, only "code" is available
    if (
      (nextRecord as any).isNew &&
      (nextField === "quantity" || nextField === "price")
    ) {
      nextField = "code";
    }

    if (nextIndex !== currentIndex || nextField !== field) {
      e.preventDefault();
      setFocusTarget({
        id: (nextRecord as any).isNew ? "new" : (nextRecord as any).id,
        field: nextField,
      });
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 70,
      align: "center",
      render: (text: any, record: any) => (
        <Input
          key={
            record.isNew
              ? `new-code-${cart.items.length}`
              : `${record.key}-code-${text}`
          }
          ref={(el) => {
            inputRefs.current[`${record.key}-code`] = el;
          }}
          defaultValue={text}
          onFocus={(e) => {
            e.target.select();
            if (!record.isNew) setActivePrice(record.purchase_price);
          }}
          onPressEnter={(e: any) => handleCodeChange(record, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, record, "code")}
          variant="borderless"
          style={{ width: "100%", padding: "0" }}
        />
      ),
    },
    {
      title: "OEM",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 200,
    },
    { title: "WXQP", dataIndex: "WXQP", key: "WXQP", width: 200 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type", width: 70 },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 70,
      align: "center",
      render: (text: any, record: any) =>
        record.isNew ? null : (
          <Input
            key={`${record.id}-qty-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-quantity`] = el;
            }}
            defaultValue={text}
            onFocus={(e) => e.target.select()}
            onPressEnter={(e: any) =>
              mutationQty.mutate({
                id: record.id,
                quantity: Number(e.target.value),
              })
            }
            onKeyDown={(e) => handleKeyDown(e, record, "quantity")}
            variant="borderless"
            style={{ width: "100%", padding: "0" }}
          />
        ),
    },
    {
      title: "Price",
      dataIndex: "priceAtSale",
      key: "priceAtSale",
      width: 100,
      align: "center",
      render: (text: any, record: any) =>
        record.isNew ? null : (
          <Input
            key={`${record.id}-price-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-price`] = el;
            }}
            defaultValue={text}
            onFocus={(e) => {
              e.target.select();
              setActivePrice(record.purchase_price);
            }}
            onPressEnter={(e: any) =>
              mutationPrice.mutate({
                id: record.id,
                price: Number(e.target.value),
              })
            }
            onKeyDown={(e) => handleKeyDown(e, record, "price")}
            variant="borderless"
            style={{ width: "100%", padding: "0" }}
          />
        ),
    },
    { title: "Total", dataIndex: "totalPrice", key: "totalPrice", width: 70 },
    {
      title: "Stock",
      dataIndex: "quantityAtStore",
      key: "quantityAtStore",
      width: 70,
    },
  ];

  const dataSource = [
    ...(cart.items || []).map((item) => ({ ...item, key: item.id })),
    { key: "new", isNew: true, code: "" },
  ];

  useEffect(() => {
    const key =
      focusTarget.id === "new"
        ? "new-code"
        : `${focusTarget.id}-${focusTarget.field}`;

    // Small timeout to ensure input is mounted after data refresh
    const timer = setTimeout(() => {
      const input = inputRefs.current[key];
      if (input) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [focusTarget, cart.items.length]);

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey="key"
      size="small"
      bordered
      onRow={(record: any) => ({
        onClick: () => {
          if (!record.isNew) setActivePrice(record.purchase_price);
        },
      })}
    />
  );
}

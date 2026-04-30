import { Input, Table, message, Modal, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ICart } from "./types";
import { useState, useRef, useEffect } from "react";
import { useCurrentDate } from "../../store/useDateStore";
import { usePurchasePriceStore } from "../../store/usePurchasePriceStore";
import { useCartMutations } from "./mutations";

interface CartProps {
  cart: ICart;
}

export function Cart({ cart }: CartProps) {
  const currentDate = useCurrentDate();
  const setActivePrice = usePurchasePriceStore((state) => state.setActivePrice);
  const [focusTarget, setFocusTarget] = useState<{
    id: number | "new";
    field: "code" | "quantity" | "price";
  }>({ id: "new", field: "code" });
  const { token } = theme.useToken();
  const inputRefs = useRef<Record<string, any>>({});
  const {
    mutationAdd,
    mutationQty,
    mutationPrice,
    mutationDelete,
    mutationStatusToggle,
  } = useCartMutations({
    cartId: cart.id,
    currentDate,
    setFocusTarget,
  });

  const showReopenModal = (originalValue: any, inputKey: string) => {
    Modal.confirm({
      title: "Cart is closed",
      content:
        "This cart is completed. Would you like to open it to make changes?",
      okText: "Open",
      cancelText: "Cancel",
      onOk: () => {
        mutationStatusToggle.mutate(cart.id);
      },
      onCancel: () => {
        const input = inputRefs.current[inputKey];
        if (input && input.input) {
          input.input.value = originalValue;
        }
      },
    });
  };

  const handleCodeChange = async (record: any, code: string) => {
    if (!code) return;

    if (cart.status === "completed") {
      showReopenModal("", record.isNew ? "new-code" : `${record.id}-code`);
      return;
    }

    if (record.isNew) {
      mutationAdd.mutate(code);
    } else {
      if (String(record.code) === String(code)) {
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

  const fields: ("code" | "quantity" | "price")[] = [
    "code",
    "quantity",
    "price",
  ];

  const handleKeyDown = (
    e: React.KeyboardEvent,
    record: any,
    field: "code" | "quantity" | "price",
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLInputElement;
      if (target) {
        const originalValue =
          field === "code"
            ? record.code
            : record[field === "price" ? "priceAtSale" : field];
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

    const nextRecord = dataSource[nextIndex];

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
          onPressEnter={(e: any) => {
            if (cart.status === "completed") {
              showReopenModal(
                text,
                record.isNew ? "new-code" : `${record.id}-code`,
              );
              return;
            }
            handleCodeChange(record, e.target.value);
          }}
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
      width: 150,
    },
    { title: "WXQP", dataIndex: "WXQP", key: "WXQP", width: 150 },
    { title: "Type", dataIndex: "type", key: "type", width: 70 },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
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
            onPressEnter={(e: any) => {
              if (cart.status === "completed") {
                showReopenModal(text, `${record.id}-quantity`);
                return;
              }
              mutationQty.mutate({
                id: record.id,
                quantity: Number(e.target.value),
              });
            }}
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
            onPressEnter={(e: any) => {
              if (cart.status === "completed") {
                showReopenModal(text, `${record.id}-price`);
                return;
              }
              mutationPrice.mutate({
                id: record.id,
                price: Number(e.target.value),
              });
            }}
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
  }, [focusTarget, cart.items.length, cart.status]);

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey={"id"}
      bordered
      sticky
      style={{
        wordWrap: "break-word",
        wordBreak: "break-word",
        whiteSpace: "normal",
        height: "100%",
        border: `1px solid ${token.colorBorder}`,
        minHeight: 0,
        overflowY: "auto",
        borderRadius: token.borderRadiusLG,
      }}
      size="small"
      scroll={{ y: "calc(100vh - 370px)" }}
      onRow={(record: any) => ({
        onClick: () => {
          if (!record.isNew) setActivePrice(record.purchase_price);
        },
      })}
    />
  );
}

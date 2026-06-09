import { Input, Table, message, Modal, theme, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ICart } from "./types";
import { discountPct } from "./discount";
import { useState, useRef, useEffect } from "react";
import { useCurrentDate } from "../../store/useDateStore";
import { usePurchasePriceStore } from "../../store/usePurchasePriceStore";
import { useContainerHeight } from "../../hooks/useContainerHeight";
import { useCartMutations } from "./mutations";
import { useTranslation } from "react-i18next";

interface CartProps {
  cart: ICart;
}

export function Cart({ cart }: CartProps) {
  const currentDate = useCurrentDate();
  const { t } = useTranslation();
  const setActivePrice = usePurchasePriceStore((state) => state.setActivePrice);
  const [focusTarget, setFocusTarget] = useState<{
    id: number | "new";
    field: "code" | "quantity" | "price";
  }>({ id: "new", field: "code" });
  const { token } = theme.useToken();
  const inputRefs = useRef<Record<string, any>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = useContainerHeight(containerRef);
  const tableScrollY = Math.max(containerHeight - 48, 200);
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
      title: t("cart.closedTitle"),
      content: t("cart.closedContent"),
      okText: t("cart.open"),
      cancelText: t("common.cancel"),
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
      if (String(record.productId) === String(code)) {
        setFocusTarget({ id: record.id, field: "quantity" });
        return;
      }
      if (record.quantity > 0) {
        message.error(t("toast.cannotChangeCodeQty"));
        return;
      }
      try {
        await mutationDelete.mutateAsync(record.id);
        mutationAdd.mutate(code);
      } catch (e: any) {
        message.error(e.response?.data?.message || t("toast.failedReplaceItem"));
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
            ? record.productId
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

    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "Delete" || e.key === "Backspace")
    ) {
      if (record.isNew) return;
      if (record.quantity > 0) {
        message.warning(t("toast.cannotDeleteItemQty"));
        return;
      }
      e.preventDefault();
      mutationDelete.mutate(record.id);
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
      title: t("columns.id"),
      dataIndex: "productId",
      key: "productId",
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
      title: t("columns.oem"),
      dataIndex: "oem",
      key: "oem",
      width: 130,
      ellipsis: true,
    },
    {
      title: t("columns.wxqp"),
      dataIndex: "WXQP",
      key: "WXQP",
      width: 130,
      ellipsis: true,
    },
    { title: t("columns.type"), dataIndex: "type", key: "type", width: 70 },
    { title: t("columns.name"), dataIndex: "name", key: "name", ellipsis: true },
    {
      title: t("columns.quantity"),
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
      title: t("columns.discount"),
      key: "discount",
      width: 80,
      align: "center",
      render: (_: any, record: any) => {
        if (record.isNew) return null;
        const pct = discountPct(record);
        return pct > 0 ? (
          <span style={{ color: token.colorError }}>-{pct}%</span>
        ) : null;
      },
    },
    {
      title: t("columns.price"),
      dataIndex: "priceAtSale",
      key: "priceAtSale",
      width: 100,
      align: "center",
      render: (text: any, record: any) =>
        record.isNew ? null : (
          <Tooltip
            title={
              discountPct(record) > 0
                ? `${t("sales.originalPrice")}: ${record.sale_price}`
                : ""
            }
          >
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
          </Tooltip>
        ),
    },
    { title: t("columns.total"), dataIndex: "totalPrice", key: "totalPrice", width: 80 },
    {
      title: t("columns.stock"),
      dataIndex: "quantityAtStore",
      key: "quantityAtStore",
      width: 80,
    },
  ];

  const dataSource = [
    ...(cart.items || []).map((item) => ({ ...item, key: item.id })),
    { key: "new", isNew: true, productId: "" },
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
    <div ref={containerRef} className="flex flex-col h-full min-h-0">
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey="key"
        bordered
        sticky
        style={{
          height: "100%",
          border: `1px solid ${token.colorBorder}`,
          minHeight: 0,
          overflow: "hidden",
          borderRadius: token.borderRadiusLG,
        }}
        size="small"
        scroll={{ x: 990, y: tableScrollY }}
        onRow={(record: any) => ({
          onClick: () => {
            if (!record.isNew) setActivePrice(record.purchase_price);
          },
          onContextMenu: (e) => {
            e.preventDefault();
          },
        })}
      />
    </div>
  );
}

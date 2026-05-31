import { Input, Checkbox, Flex, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { useSupplyMutations } from "../modules/supplies/mutations";
import type { ISupplyItem } from "../modules/supplies/types";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

type FieldType =
  | "code"
  | "quantity"
  | "purchasePriceUsd"
  | "usdRate"
  | "weight"
  | "tax"
  | "purchasePrice"
  | "salePrice"
  | "minQuantity";

const NAVIGABLE_FIELDS: FieldType[] = [
  "code",
  "quantity",
  "purchasePriceUsd",
  "usdRate",
  "weight",
  "tax",
  "purchasePrice",
  "salePrice",
];

interface UseSupplyTableProps {
  supply:
    | {
        id: number;
        status: string;
        items: ISupplyItem[];
      }
    | undefined;
}

interface SupplyTableRow extends Partial<ISupplyItem> {
  key: number | string;
  isNew?: boolean;
}

export function useSupplyTable({ supply }: UseSupplyTableProps): {
  columns: ColumnsType<SupplyTableRow>;
  dataSource: SupplyTableRow[];
} {
  const [focusTarget, setFocusTarget] = useState<{
    id: number | "new";
    field: FieldType;
  }>({ id: "new", field: "code" });
  const inputRefs = useRef<Record<string, any>>({});
  const { t } = useTranslation();

  const { mutationAdd, mutationUpdate, mutationDelete } = useSupplyMutations({
    supplyId: supply?.id,
    setFocusTarget,
  });

  const isCompleted = supply?.status === "completed";

  const dataSource: SupplyTableRow[] = [
    ...(supply?.items || []).map((item) => ({ ...item, key: item.id })),
    ...(!isCompleted ? [{ key: "new", isNew: true }] : []),
  ];

  const handleCodeChange = async (record: any, code: string) => {
    if (!code) return;

    if (record.isNew) {
      mutationAdd.mutate(code);
      return;
    }

    if (String(record.product?.code) === String(code)) {
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

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(target, val);

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
    const fieldIndex = NAVIGABLE_FIELDS.indexOf(field);

    let nextIndex = currentIndex;
    let nextField = field;

    if (e.key === "ArrowUp") {
      nextIndex = Math.max(0, currentIndex - 1);
    } else if (e.key === "ArrowDown") {
      nextIndex = Math.min(dataSource.length - 1, currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      nextField = NAVIGABLE_FIELDS[Math.max(0, fieldIndex - 1)];
    } else if (e.key === "ArrowRight") {
      nextField =
        NAVIGABLE_FIELDS[Math.min(NAVIGABLE_FIELDS.length - 1, fieldIndex + 1)];
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

  const columns: ColumnsType<SupplyTableRow> = [
    {
      title: t("columns.code"),
      dataIndex: "code",
      key: "code",
      width: 80,
      align: "center",
      render: (_text, record: any) => (
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
      title: t("columns.name"),
      key: "name",
      render: (_, record: any) =>
        record.product?.name || (record.isNew ? "" : t("common.unknown")),
    },
    {
      title: t("columns.type"),
      key: "type",
      width: 100,
      render: (_, record: any) => record.product?.type,
    },
    {
      title: t("columns.qty"),
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "center",
      render: (text, record: any) =>
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
      title: t("columns.buyUsd"),
      dataIndex: "purchasePriceUsd",
      key: "purchasePriceUsd",
      width: 100,
      align: "right",
      render: (text, record: any) =>
        record.isNew ? null : (
          <Input
            key={`${record.id}-purchasePriceUsd-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-purchasePriceUsd`] = el;
            }}
            defaultValue={text ?? ""}
            variant="borderless"
            style={{ textAlign: "right", padding: 0 }}
            readOnly={isCompleted}
            onFocus={(e) => {
              if (isCompleted) return;
              e.target.select();
            }}
            onKeyDown={(e) => handleKeyDown(e, record, "purchasePriceUsd")}
            onPressEnter={(e: any) => {
              if (isCompleted) return;
              const v = e.target.value;
              mutationUpdate.mutate({
                id: record.id,
                data: { purchasePriceUsd: v === "" ? null : Number(v) },
              });
            }}
          />
        ),
    },
    {
      title: t("columns.rate"),
      dataIndex: "usdRate",
      key: "usdRate",
      width: 80,
      align: "right",
      render: (text, record: any) =>
        record.isNew ? null : (
          <Input
            key={`${record.id}-usdRate-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-usdRate`] = el;
            }}
            defaultValue={text ?? ""}
            variant="borderless"
            style={{ textAlign: "right", padding: 0 }}
            readOnly={isCompleted}
            onFocus={(e) => {
              if (isCompleted) return;
              e.target.select();
            }}
            onKeyDown={(e) => handleKeyDown(e, record, "usdRate")}
            onPressEnter={(e: any) => {
              if (isCompleted) return;
              const v = e.target.value;
              mutationUpdate.mutate({
                id: record.id,
                data: { usdRate: v === "" ? null : Number(v) },
              });
            }}
          />
        ),
    },
    {
      title: t("columns.weightKg"),
      dataIndex: "weight",
      key: "weight",
      width: 90,
      align: "center",
      render: (text, record: any) => {
        if (record.isNew) return null;
        const display = text ?? record.product?.weight ?? "";
        const usdEmpty =
          record.purchasePriceUsd === null ||
          record.purchasePriceUsd === undefined;
        return (
          <Input
            key={`${record.id}-weight-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-weight`] = el;
            }}
            defaultValue={display}
            variant="borderless"
            style={{ textAlign: "center", padding: 0 }}
            readOnly={isCompleted || usdEmpty}
            disabled={usdEmpty}
            onFocus={(e) => {
              if (isCompleted || usdEmpty) return;
              e.target.select();
            }}
            onKeyDown={(e) => handleKeyDown(e, record, "weight")}
            onPressEnter={(e: any) => {
              if (isCompleted || usdEmpty) return;
              const v = e.target.value;
              mutationUpdate.mutate({
                id: record.id,
                data: { weight: v === "" ? null : Number(v) },
              });
            }}
          />
        );
      },
    },
    {
      title: t("columns.taxPerKg"),
      dataIndex: "tax",
      key: "tax",
      width: 90,
      align: "right",
      render: (text, record: any) => {
        if (record.isNew) return null;
        const usdEmpty =
          record.purchasePriceUsd === null ||
          record.purchasePriceUsd === undefined;
        return (
          <Input
            key={`${record.id}-tax-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-tax`] = el;
            }}
            defaultValue={text ?? ""}
            variant="borderless"
            style={{ textAlign: "right", padding: 0 }}
            readOnly={isCompleted || usdEmpty}
            disabled={usdEmpty}
            onFocus={(e) => {
              if (isCompleted || usdEmpty) return;
              e.target.select();
            }}
            onKeyDown={(e) => handleKeyDown(e, record, "tax")}
            onPressEnter={(e: any) => {
              if (isCompleted || usdEmpty) return;
              const v = e.target.value;
              mutationUpdate.mutate({
                id: record.id,
                data: { tax: v === "" ? null : Number(v) },
              });
            }}
          />
        );
      },
    },
    {
      title: t("columns.buyPrice"),
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      width: 100,
      align: "right",
      render: (text, record: any) =>
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
      title: t("columns.salePrice"),
      dataIndex: "salePrice",
      key: "salePrice",
      width: 100,
      align: "right",
      render: (text, record: any) =>
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
      title: t("columns.inStock"),
      key: "inStock",
      width: 90,
      align: "center",
      render: (_, record: any) =>
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
      title: t("columns.min"),
      dataIndex: "minQuantity",
      key: "minQuantity",
      width: 100,
      align: "center",
      render: (text, record: any) => {
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
      title: t("columns.profit"),
      key: "profit",
      width: 80,
      align: "center",
      render: (_, record: any) => {
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

  return { columns, dataSource };
}

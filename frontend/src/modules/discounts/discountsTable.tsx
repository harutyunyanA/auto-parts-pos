import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Input,
  InputNumber,
  Pagination,
  Table,
  Tooltip,
  Typography,
  Button,
} from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useContainerHeight } from "../../hooks/useContainerHeight";
import { useDiscountProducts } from "./queries";
import { useSetProductDiscount } from "./mutations";
import type { IProduct } from "../products/types";

const { Text } = Typography;

// Profit relative to purchase price, matching the rest of the app.
function profitPercent(product: IProduct): number | null {
  const buy = Number(product.purchase_price);
  const sale = Number(product.sale_price);
  if (!(buy > 0)) return null;
  return ((sale - buy) / buy) * 100;
}

function effectivePrice(product: IProduct): number {
  const sale = Number(product.sale_price);
  const discount = Number(product.discount) || 0;
  return Math.round(sale * (1 - discount / 100));
}

// Inline discount editor for a single row. Commits on blur / Enter.
function DiscountCell({ product }: { product: IProduct }) {
  const setDiscount = useSetProductDiscount();
  const initial = Number(product.discount) || 0;
  const [value, setValue] = useState<number | null>(initial);

  useEffect(() => {
    setValue(Number(product.discount) || 0);
  }, [product.discount]);

  const commit = (next: number) => {
    if (next !== (Number(product.discount) || 0)) {
      setDiscount.mutate({ id: product.id, discount: next });
    }
  };

  return (
    <InputNumber
      min={0}
      max={100}
      value={value}
      controls={false}
      addonAfter="%"
      style={{ width: 110 }}
      onChange={(v) => setValue(v)}
      onBlur={() => commit(value ?? 0)}
      onPressEnter={() => commit(value ?? 0)}
    />
  );
}

// Per-row "clear discount" action, kept in its own Actions column.
function ResetDiscountButton({ product }: { product: IProduct }) {
  const { t } = useTranslation();
  const setDiscount = useSetProductDiscount();
  const hasDiscount = (Number(product.discount) || 0) > 0;

  return (
    <Tooltip title={t("discounts.clearRow")}>
      <Button
        size="small"
        icon={<CloseOutlined />}
        disabled={!hasDiscount}
        onClick={() => setDiscount.mutate({ id: product.id, discount: 0 })}
      />
    </Tooltip>
  );
}

export function DiscountsTable({
  discountedOnly = false,
}: {
  discountedOnly?: boolean;
}) {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = useContainerHeight(containerRef);
  const tableScrollY = Math.max(containerHeight - 52, 160);

  // Numeric search -> by id, otherwise by name.
  const trimmed = search.trim();
  const filters: Record<string, unknown> = {
    ...(discountedOnly ? { discounted: true } : {}),
    ...(trimmed === ""
      ? {}
      : /^\d+$/.test(trimmed)
        ? { id: Number(trimmed) }
        : { name: trimmed }),
  };

  const { data, isLoading } = useDiscountProducts(page, limit, filters);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const columns = [
    {
      title: t("columns.id"),
      dataIndex: "id",
      key: "id",
      align: "center" as const,
      width: 80,
    },
    {
      title: t("columns.name"),
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: t("columns.type"),
      dataIndex: "type",
      key: "type",
      align: "center" as const,
      width: 90,
      ellipsis: true,
    },
    {
      title: t("columns.purchasePrice"),
      dataIndex: "purchase_price",
      key: "purchase_price",
      align: "center" as const,
      width: 110,
    },
    {
      title: t("columns.salePrice"),
      dataIndex: "sale_price",
      key: "sale_price",
      align: "center" as const,
      width: 110,
    },
    {
      title: t("columns.profit"),
      key: "profit",
      align: "center" as const,
      width: 90,
      render: (_: unknown, record: IProduct) => {
        const profit = profitPercent(record);
        if (profit === null) return "—";
        return (
          <Text type={profit < 0 ? "danger" : "success"} strong>
            {profit > 0 ? "+" : ""}
            {profit.toFixed(0)}%
          </Text>
        );
      },
    },
    {
      title: t("columns.discount"),
      key: "discount",
      align: "center" as const,
      width: 160,
      render: (_: unknown, record: IProduct) => (
        <DiscountCell product={record} />
      ),
    },
    {
      title: t("columns.effectivePrice"),
      key: "effectivePrice",
      align: "center" as const,
      width: 120,
      render: (_: unknown, record: IProduct) => {
        const discount = Number(record.discount) || 0;
        const eff = effectivePrice(record);
        return discount > 0 ? <Text strong>{eff}</Text> : <Text>{eff}</Text>;
      },
    },
    {
      title: t("columns.actions"),
      key: "actions",
      align: "center" as const,
      width: 80,
      render: (_: unknown, record: IProduct) => (
        <ResetDiscountButton product={record} />
      ),
    },
  ];

  return (
    <Flex vertical gap="middle" style={{ height: "100%", minHeight: 0 }}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={4} style={{ margin: 0 }}>
          {discountedOnly
            ? t("discounts.discountedProductsTitle")
            : t("discounts.productsTitle")}
        </Typography.Title>
        <Tooltip title={t("discounts.searchHint")}>
          <Input
            allowClear
            placeholder={t("discounts.searchPlaceholder")}
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
        </Tooltip>
      </Flex>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-hidden">
        <Table
          dataSource={data?.items}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          bordered
          sticky
          size="small"
          scroll={{ x: 760, y: tableScrollY }}
          pagination={false}
        />
      </div>
      <Pagination
        className="shrink-0"
        current={page}
        pageSize={limit}
        total={data?.total}
        showSizeChanger
        onChange={(nextPage, nextPageSize) => {
          setPage(nextPage);
          setLimit(nextPageSize);
        }}
      />
    </Flex>
  );
}

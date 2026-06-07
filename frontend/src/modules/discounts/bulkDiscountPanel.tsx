import { useState } from "react";
import {
  Button,
  Card,
  Flex,
  InputNumber,
  Popconfirm,
  Space,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  ClearOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useBulkDiscount, useResetAllDiscounts } from "./mutations";
import { DiscountRulesModal } from "./discountRulesModal";
import type { IBulkDiscountRule, IDiscountRuleRow } from "./types";

const { Text } = Typography;

function newRow(): IDiscountRuleRow {
  return {
    id: crypto.randomUUID(),
    minProfit: null,
    maxProfit: null,
    discount: null,
  };
}

export function BulkDiscountPanel() {
  const { t } = useTranslation();
  const bulk = useBulkDiscount();
  const resetAll = useResetAllDiscounts();

  const [rows, setRows] = useState<IDiscountRuleRow[]>([newRow()]);
  const [modalOpen, setModalOpen] = useState(false);

  const patchRow = (id: string, patch: Partial<IDiscountRuleRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const addRow = () => setRows((prev) => [...prev, newRow()]);

  const apply = () => {
    const rules: IBulkDiscountRule[] = rows
      .filter((r) => r.minProfit !== null && r.discount !== null)
      .map((r) => ({
        minProfit: r.minProfit as number,
        maxProfit: r.maxProfit,
        discount: r.discount as number,
      }));

    if (rules.length === 0) {
      message.warning(t("discounts.noValidRules"));
      return;
    }

    const invalid = rules.find(
      (r) => r.maxProfit !== null && r.minProfit > r.maxProfit,
    );
    if (invalid) {
      message.warning(t("discounts.invalidRange"));
      return;
    }

    bulk.mutate(rules);
  };

  return (
    <Card size="small" styles={{ body: { padding: 16 } }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {t("discounts.bulkTitle")}
        </Typography.Title>
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setModalOpen(true)}>
            {t("discounts.viewRules")}
          </Button>
          <Popconfirm
            title={t("discounts.resetAllConfirm")}
            okText={t("common.delete")}
            okButtonProps={{ danger: true }}
            onConfirm={() => resetAll.mutate()}
          >
            <Button danger icon={<ClearOutlined />} loading={resetAll.isPending}>
              {t("discounts.resetAll")}
            </Button>
          </Popconfirm>
        </Space>
      </Flex>

      <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
        {t("discounts.bulkHint")}
      </Text>

      <Flex vertical gap={8}>
        {rows.map((row) => (
          <Flex key={row.id} align="center" gap={8} wrap="wrap">
            <Text style={{ width: 70 }}>{t("discounts.profitFrom")}</Text>
            <InputNumber
              min={0}
              value={row.minProfit}
              addonAfter="%"
              style={{ width: 110 }}
              onChange={(v) => patchRow(row.id, { minProfit: v })}
            />
            <Text>{t("discounts.profitTo")}</Text>
            <InputNumber
              min={0}
              value={row.maxProfit}
              addonAfter="%"
              placeholder="∞"
              style={{ width: 110 }}
              onChange={(v) => patchRow(row.id, { maxProfit: v })}
            />
            <Text>{t("discounts.setDiscount")}</Text>
            <InputNumber
              min={0}
              max={100}
              value={row.discount}
              addonAfter="%"
              style={{ width: 110 }}
              onChange={(v) => patchRow(row.id, { discount: v })}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={rows.length === 1}
              onClick={() => removeRow(row.id)}
            />
          </Flex>
        ))}
      </Flex>

      <Space style={{ marginTop: 12 }}>
        <Button icon={<PlusOutlined />} onClick={addRow}>
          {t("discounts.addRule")}
        </Button>
        <Button
          type="primary"
          icon={<ThunderboltOutlined />}
          loading={bulk.isPending}
          onClick={apply}
        >
          {t("discounts.apply")}
        </Button>
      </Space>

      <DiscountRulesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Card>
  );
}

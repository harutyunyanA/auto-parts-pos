import {
  Button,
  Empty,
  Flex,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import { DeleteOutlined, ClearOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSource } from "../../store/useAuthStore";
import { useDiscountRules } from "./queries";
import {
  useDeleteAllDiscountRules,
  useDeleteDiscountRule,
} from "./mutations";
import { DiscountsTable } from "./discountsTable";
import type { IDiscountRule } from "./types";

export function DiscountRulesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const source = useSource();
  const { data: rules, isLoading } = useDiscountRules(source);
  const deleteRule = useDeleteDiscountRule();
  const deleteAll = useDeleteAllDiscountRules();

  const columns = [
    {
      title: t("discounts.ruleFrom"),
      key: "minProfit",
      align: "center" as const,
      width: 110,
      render: (_: unknown, r: IDiscountRule) => `${Number(r.minProfit)}%`,
    },
    {
      title: t("discounts.ruleTo"),
      key: "maxProfit",
      align: "center" as const,
      width: 110,
      render: (_: unknown, r: IDiscountRule) =>
        r.maxProfit === null ? "∞" : `${Number(r.maxProfit)}%`,
    },
    {
      title: t("discounts.ruleDiscount"),
      key: "discount",
      align: "center" as const,
      width: 110,
      render: (_: unknown, r: IDiscountRule) => (
        <Typography.Text strong>{Number(r.discount)}%</Typography.Text>
      ),
    },
    {
      title: t("columns.actions"),
      key: "actions",
      align: "center" as const,
      width: 80,
      render: (_: unknown, r: IDiscountRule) => (
        <Popconfirm
          title={t("discounts.deleteRuleConfirm")}
          okText={t("common.delete")}
          okButtonProps={{ danger: true }}
          onConfirm={() => deleteRule.mutate(r.id)}
        >
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const hasRules = (rules?.length ?? 0) > 0;

  return (
    <Modal
      open={open}
      title={t("discounts.rulesModalTitle")}
      footer={null}
      onCancel={onClose}
      width={900}
      styles={{ body: { paddingTop: 8 } }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {t("discounts.rulesListTitle")}
        </Typography.Title>
        <Popconfirm
          title={t("discounts.deleteAllRulesConfirm")}
          okText={t("common.delete")}
          okButtonProps={{ danger: true }}
          disabled={!hasRules}
          onConfirm={() => deleteAll.mutate()}
        >
          <Button
            danger
            icon={<ClearOutlined />}
            disabled={!hasRules}
            loading={deleteAll.isPending}
          >
            {t("discounts.deleteAllRules")}
          </Button>
        </Popconfirm>
      </Flex>

      <Table
        dataSource={rules}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        bordered
        size="small"
        pagination={false}
        locale={{
          emptyText: <Empty description={t("discounts.noRules")} />,
        }}
      />

      <Space direction="vertical" style={{ width: "100%", marginTop: 24 }}>
        <div style={{ height: 420 }}>
          <DiscountsTable discountedOnly />
        </div>
      </Space>
    </Modal>
  );
}

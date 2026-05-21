import {
  CaretLeftOutlined,
  CaretRightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LockOutlined,
  PlusOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Flex, message, Pagination, theme } from "antd";
import Text from "antd/es/typography/Text";
import api from "../api/client";
import { useEffect, useRef } from "react";
import { Supply } from "../modules/supplies/supply";
import type { ISupply } from "../modules/supplies/types";
import { queryClient } from "../utils/queryClient";
import {
  useCurrentSupplyPage,
  useSetCurrentSupplyPage,
} from "../store/useCurrentSupplyPage";
import dayjs from "dayjs";
import { SuppliersList } from "../modules/suppliers/suppliersList";

export default function Stock() {
  const currentSupplyPage = useCurrentSupplyPage();
  const setCurrentSupplyPage = useSetCurrentSupplyPage();

  const { token } = theme.useToken();
  const { data: supplies } = useQuery<ISupply[]>({
    queryKey: ["supplies"],
    queryFn: () => {
      return api.get("/supplies").then((res) => res.data.data);
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });
  const currentSupply = supplies?.[currentSupplyPage - 1];

  const totals = currentSupply?.items.reduce(
    (acc, item) => {
      const qty = Number(item.quantity) || 0;
      const purchase = Number(item.purchasePrice) || 0;
      const sale = Number(item.salePrice) || 0;
      return {
        purchase: acc.purchase + qty * purchase,
        sale: acc.sale + qty * sale,
      };
    },
    { purchase: 0, sale: 0 },
  ) || { purchase: 0, sale: 0 };

  const totalProfit = totals.sale - totals.purchase;

  const prevSuppliesLength = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);

  useEffect(() => {
    if (supplies && supplies.length > 0) {
      const lengthIncreased = supplies.length > prevSuppliesLength.current;

      if (isFirstLoad.current || lengthIncreased) {
        setCurrentSupplyPage(supplies.length);
        isFirstLoad.current = false;
      }
      prevSuppliesLength.current = supplies.length;
    }
  }, [supplies, setCurrentSupplyPage]);

  const { mutateAsync: createNewSupply } = useMutation({
    mutationFn: async () => {
      const res = await api.post("/supplies", {
        supplierId: 1,
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
      message.success("Supply created successfully");
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Failed to create supply");
    },
  });

  const { mutateAsync: statusToggle } = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/supplies/${id}/complete`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
      message.success("Status updated");
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Failed to update status");
    },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
      }}
    >
      <section id="header" style={{ flex: "0 0 auto" }}>
        <Flex justify="space-between" align="center">
          <Flex gap="middle" align="center">
            <Flex align="center" gap="small">
              <Text strong style={{ fontSize: "18px" }}>
                Supply №
              </Text>
              <Text strong>{currentSupply?.id || "-"}</Text>
            </Flex>
            <Text>{dayjs(currentSupply?.createdAt).format("DD/MM/YYYY")} </Text>
            <Flex gap="small">
              <Button
                icon={<CaretLeftOutlined />}
                onClick={() => {
                  if (supplies && currentSupplyPage > 1) {
                    setCurrentSupplyPage(currentSupplyPage - 1);
                  }
                }}
                disabled={currentSupplyPage <= 1}
              />
              <Button
                icon={<CaretRightOutlined />}
                onClick={() => {
                  if (supplies && currentSupplyPage < supplies.length) {
                    setCurrentSupplyPage(currentSupplyPage + 1);
                  }
                }}
                disabled={!supplies || currentSupplyPage >= supplies.length}
              />
            </Flex>

            <SuppliersList currentSupply={currentSupply} />

            <Button
              icon={<PlusOutlined />}
              onClick={async () => {
                if (currentSupply && currentSupply.status === "draft") {
                  await statusToggle(currentSupply.id);
                }
                createNewSupply();
              }}
            />

            <Button
              // type="text"
              icon={
                currentSupply?.status === "draft" ? (
                  <UnlockOutlined style={{ color: token.colorSuccess }} />
                ) : (
                  <LockOutlined style={{ color: token.colorError }} />
                )
              }
              onClick={() => {
                const supplyId = currentSupply?.id;
                if (supplyId) {
                  statusToggle(supplyId);
                }
              }}
            />
          </Flex>

          <Flex gap="large" align="center">
            <Flex vertical align="end">
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Purchase
              </Text>
              <Text strong>{totals.purchase.toLocaleString()} ֏</Text>
            </Flex>
            <Flex vertical align="end">
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Sale
              </Text>
              <Text strong>{totals.sale.toLocaleString()} ֏</Text>
            </Flex>
            <Flex vertical align="end">
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Profit
              </Text>
              <Text
                strong
                style={{
                  color:
                    totalProfit >= 0 ? token.colorSuccess : token.colorError,
                }}
              >
                {totalProfit.toLocaleString()} ֏
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </section>

      <section
        id="main"
        style={{
          flex: 1,
          minHeight: 0,
          // background: token.colorBgLayout,
          border: `1px solid ${token.colorBorder}`,
          borderRadius: token.borderRadiusLG,
        }}
      >
        {currentSupply ? (
          <Supply supply={currentSupply} />
        ) : (
          <Flex align="center" justify="center" style={{ height: "100%" }}>
            <Text type="secondary">
              No supplies found. Click + to create one.
            </Text>
          </Flex>
        )}
      </section>

      <section id="pagination" style={{ flex: "0 0 auto" }}>
        <Flex justify="center" align="center" gap="small">
          <Button
            icon={<DoubleLeftOutlined />}
            disabled={currentSupplyPage <= 1}
            onClick={() => setCurrentSupplyPage(1)}
            type="text"
          />
          <Pagination
            simple
            current={currentSupplyPage}
            total={supplies?.length || 0}
            pageSize={1}
            onChange={(page) => setCurrentSupplyPage(page)}
          />
          <Button
            icon={<DoubleRightOutlined />}
            disabled={!supplies || currentSupplyPage >= supplies.length}
            onClick={() => supplies && setCurrentSupplyPage(supplies.length)}
            type="text"
          />
        </Flex>
      </section>
    </div>
  );
}

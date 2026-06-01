import {
  CaretLeftOutlined,
  CaretRightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LockOutlined,
  PlusOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, Flex, Pagination, theme } from "antd";
import { ClientsList } from "../components/ClientsList";
import { useCurrentDate } from "../store/useDateStore";
import { useSource } from "../store/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { useEffect, useState, useRef } from "react";
import { Cart } from "../modules/sales/cart";
import type { ICart } from "../modules/sales/types";
import type { ApiResponse } from "../types/api.types";
import {
  useCurrentCartPage,
  useSetCurrentCartPage,
} from "../store/useCurrentCartPage";
import { usePurchasePriceStore } from "../store/usePurchasePriceStore";
import { Typography } from "antd";
import { useCartMutations } from "../modules/sales/mutations";
import Modal from "antd/es/modal/Modal";
import { ProductHistory } from "../modules/history/history";
import { DaySummary } from "../components/daySummary";
import { useTranslation } from "react-i18next";

export default function Sales() {
  const { t } = useTranslation();
  const currentDate = useCurrentDate();
  const currentCartPage = useCurrentCartPage();
  const setCurrentCartPage = useSetCurrentCartPage();
  const activePrice = usePurchasePriceStore((state) => state.activePrice);
  const source = useSource();
  const queryClient = useQueryClient();
  const { token } = theme.useToken();
  const { Text } = Typography;

  const { data: carts } = useQuery({
    queryKey: ["carts", currentDate, source],
    queryFn: () =>
      api.get<ApiResponse<ICart[]>>(`/sale/${currentDate}`).then((res) => {
        return res.data.data;
      }),
    staleTime: 1000 * 60 * 10,
  });

  const { mutationStatusToggle, mutationCardPayment } = useCartMutations({
    cartId: carts?.[currentCartPage - 1]?.id || 0,
    currentDate,
    setFocusTarget: () => {},
  });

  const prevCartsLength = useRef<number>(0);
  const prevDate = useRef<string | null>(null);
  const [isProductHistoryOpen, setIsProductHistoryOpen] =
    useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  useEffect(() => {
    if (carts && carts.length > 0) {
      const isNewDate = prevDate.current !== currentDate;
      const isFirstLoad = prevDate.current === null;
      const lengthIncreased = carts.length > prevCartsLength.current;

      if (isFirstLoad || isNewDate || lengthIncreased) {
        setCurrentCartPage(carts.length);
      }

      prevCartsLength.current = carts.length;
      prevDate.current = currentDate;
    }
  }, [carts, currentDate, setCurrentCartPage, source]);

  async function createNewCart() {
    const currentCart = carts?.[currentCartPage - 1];
    if (currentCart && currentCart.status === "draft") {
      await mutationStatusToggle.mutateAsync(currentCart.id);
    }
    await api.post("/sale", { currentDate });
    queryClient.invalidateQueries({
      queryKey: ["carts", currentDate, source],
    });
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "100%",
        }}
      >
        <section id="header" style={{ flex: "0 0 auto" }}>
          <Flex gap={"large"} align="center" wrap="wrap">
            <Flex gap={"medium"} align="center">
              <Flex gap={"small"} align="center">
                <Button
                  icon={<CaretLeftOutlined />}
                  disabled={currentCartPage <= 1}
                  onClick={() => {
                    if (currentCartPage > 1) {
                      setCurrentCartPage(currentCartPage - 1);
                    }
                  }}
                ></Button>
                <Button
                  icon={<CaretRightOutlined />}
                  disabled={!carts || currentCartPage >= (carts.length || 0)}
                  onClick={() => {
                    if (carts && currentCartPage < carts.length) {
                      setCurrentCartPage(currentCartPage + 1);
                    }
                  }}
                ></Button>
              </Flex>
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  createNewCart();
                }}
              ></Button>
            </Flex>
            <p>
              {t("sales.receipt")} {carts?.[currentCartPage - 1]?.id}
            </p>
            <ClientsList />
            <p id="purchasedPrice">11EAX{activePrice ?? ""}</p>
            <Button
              icon={
                carts?.[currentCartPage - 1]?.status === "draft" ? (
                  <UnlockOutlined style={{ color: token.colorSuccess }} />
                ) : (
                  <LockOutlined style={{ color: token.colorError }} />
                )
              }
              onClick={() => {
                const cartId = carts?.[currentCartPage - 1]?.id;
                if (cartId) {
                  mutationStatusToggle.mutate(cartId);
                }
              }}
            ></Button>
          </Flex>
        </section>
        <section
          id="main"
          style={{
            flex: 1,
            minHeight: 0,
            // border: `1px solid ${token.colorBorder}`,
            // borderRadius: token.borderRadiusLG,
          }}
        >
          {carts && carts[currentCartPage - 1] && (
            <Cart cart={carts[currentCartPage - 1]} />
          )}
        </section>
        <section id="btnTools" style={{ flex: "0 0 auto" }}>
          <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
            <Flex justify="space-between" gap={"small"} vertical>
              <Button>{t("common.print")}</Button>
              <Button onClick={() => setIsSummaryOpen(true)}>
                {t("sales.summary")}
              </Button>
              <Button onClick={() => setIsProductHistoryOpen(true)}>
                {t("base.history")}
              </Button>
            </Flex>
            <Flex gap={"small"} align="flex-start">
              <Button
                disabled={
                  carts?.[currentCartPage - 1]?.status === "draft" ||
                  carts?.[currentCartPage - 1]?.totalAmount === 0
                }
              >
                Receipt
              </Button>
              <Button
                disabled={
                  carts?.[currentCartPage - 1]?.status === "draft" ||
                  carts?.[currentCartPage - 1]?.totalAmount === 0
                }
                onClick={() => {
                  const cartId = carts?.[currentCartPage - 1]?.id;
                  if (cartId) {
                    mutationCardPayment.mutate(cartId);
                  }
                }}
              >
                {t("sales.card")}
              </Button>
            </Flex>
            <Flex vertical gap="small" style={{ width: "200px" }}>
              <Flex justify="space-between" align="center">
                <Text strong>{t("columns.total")}</Text>
                <Text
                  style={{
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: token.borderRadiusLG,
                    padding: "4px 8px",
                    minWidth: "100px",
                    textAlign: "right",
                  }}
                >
                  {carts?.[
                    currentCartPage - 1
                  ]?.totalAmount?.toLocaleString() || 0}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </section>
        <section id="navBar" style={{ flex: "0 0 auto" }}>
          <Flex>
            <Button
              icon={<DoubleLeftOutlined />}
              disabled={currentCartPage <= 1}
              onClick={() => {
                if (currentCartPage > 1) {
                  setCurrentCartPage(1);
                }
              }}
              style={{ border: "none" }}
            ></Button>
            <Pagination
              simple={{ readOnly: true }}
              current={currentCartPage}
              total={carts?.length || 0}
              pageSize={1}
              onChange={(current) => setCurrentCartPage(current)}
            />
            <Button
              icon={<DoubleRightOutlined />}
              disabled={!carts || currentCartPage >= (carts.length || 0)}
              onClick={() => {
                if (carts && currentCartPage < carts.length) {
                  setCurrentCartPage(carts.length);
                }
              }}
              style={{ border: "none" }}
            ></Button>
          </Flex>
        </section>
      </div>
      <Modal
        open={isProductHistoryOpen}
        closeIcon={false}
        onCancel={() => setIsProductHistoryOpen(false)}
        footer={(_, { CancelBtn }) => <CancelBtn />}
        width={"fit-content"}
      >
        <ProductHistory />
      </Modal>
      <Modal
        title={t("sales.summary")}
        open={isSummaryOpen}
        footer={null}
        destroyOnHidden={true}
        onCancel={() => setIsSummaryOpen(false)}
      >
        <DaySummary />
      </Modal>
    </>
  );
}

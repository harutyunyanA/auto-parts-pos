import {
  CaretLeftOutlined,
  CaretRightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LockOutlined,
  PlusOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, Flex, InputNumber, Pagination, theme } from "antd";
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
import { Typography, Card } from "antd";
import { useCartMutations } from "../modules/sales/mutations";

export default function Sales() {
  const currentDate = useCurrentDate();
  // const [currentCartPage, setCurrentCartPage] = useState<number>(1);
  const currentCartPage = useCurrentCartPage();
  const setCurrentCartPage = useSetCurrentCartPage();
  const activePrice = usePurchasePriceStore((state) => state.activePrice);
  // const [currentCart, setCurrentCart] = useState<ICart | null>(null);
  const source = useSource();
  const queryClient = useQueryClient();
  const { token } = theme.useToken();
  const { Title, Paragraph, Text } = Typography;
  const [paid, setPaid] = useState<number>(0);

  const { data: carts } = useQuery({
    queryKey: ["carts", currentDate, source],
    queryFn: () =>
      api.get<ApiResponse<ICart[]>>(`/sale/${currentDate}`).then((res) => {
        return res.data.data;
      }),
    staleTime: 1000 * 60 * 10,
  });

  const { mutationStatusToggle } = useCartMutations({
    cartId: carts?.[currentCartPage - 1]?.id || 0,
    currentDate,
    setFocusTarget: () => {},
  });

  const prevCartsLength = useRef<number>(0);
  const prevDate = useRef<string | null>(null);

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

  useEffect(() => {
    setPaid(0);
  }, [source, currentDate]);


  function createNewCart() {
    api.post("/sale").then(() => {
      queryClient.invalidateQueries({ queryKey: ["carts", currentDate] });
    });
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "calc(100vh - 160px)",
        }}
      >
        <section id="header" style={{ flex: 1, minHeight: 0 }}>
          <Flex gap={"large"} align="center">
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
            <p>Receipt {carts?.[currentCartPage - 1]?.id}</p>
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
            flex: 10,
            minHeight: 0,
            overflowY: "auto",
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG,
          }}
        >
          {carts && carts[currentCartPage - 1] && (
            <Cart cart={carts[currentCartPage - 1]} />
          )}
        </section>
        <section id="btnTools" style={{ flex: 3, minHeight: 0 }}>
          <Flex justify="space-between" align="center">
            <Flex justify="space-between" gap={"small"} vertical>
              <Button size="large">Print</Button>
              <Button size="large">Summary</Button>
              <Button size="large">History</Button>
            </Flex>
            <Flex gap={"small"} align="flex-start">
              <Button size="large">Receipt</Button>
              <Button size="large">Card</Button>
            </Flex>
            <Flex vertical gap="small" style={{ width: "200px" }}>
              <Flex justify="space-between" align="center">
                <Text strong>Total</Text>
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
              {/* <Flex justify="space-between" align="center">
                <Text strong>Paid</Text>
                <InputNumber
                  min={0}
                  value={paid}
                  onChange={(val) => setPaid(val || 0)}
                  style={{ width: "100px" }}
                />
              </Flex>
              <Flex justify="space-between" align="center">
                <Text strong>Rest</Text>
                <Text
                  style={{
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: token.borderRadiusLG,
                    padding: "4px 8px",
                    minWidth: "100px",
                    textAlign: "right",
                    color:
                      (carts?.[currentCartPage - 1]?.totalAmount || 0) - paid <
                      0
                        ? token.colorError
                        : token.colorText,
                  }}
                >
                  {(
                    (carts?.[currentCartPage - 1]?.totalAmount || 0) - paid
                  ).toLocaleString()}
                </Text>
              </Flex> */}
            </Flex>
          </Flex>
        </section>
        <section id="navBar" style={{ flex: 1, minHeight: 0 }}>
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
    </>
  );
}

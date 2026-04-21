import {
  CaretLeftOutlined,
  CaretRightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Flex, Pagination } from "antd";
import { ClientsList } from "../components/ClientsList";
import { useCurrentDate } from "../store/useDateStore";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { useEffect, useState } from "react";
import { Cart } from "../modules/sales/cart";
import type { ICart } from "../modules/sales/types";
import type { ApiResponse } from "../types/api.types";
import {
  useCurrentCartPage,
  useSetCurrentCartPage,
} from "../store/useCurrentCartPage";

export default function Sales() {
  const currentDate = useCurrentDate();
  // const [currentCartPage, setCurrentCartPage] = useState<number>(1);
  const currentCartPage = useCurrentCartPage();
  const setCurrentCartPage = useSetCurrentCartPage();
  const [currentCart, setCurrentCart] = useState<ICart | null>(null);
  const { data: carts } = useQuery({
    queryKey: ["carts", currentDate],
    queryFn: () =>
      api.get<ApiResponse<ICart[]>>(`/sale/${currentDate}`).then((res) => {
        return res.data.data;
      }),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (carts && carts.length > 0) {
      setCurrentCartPage(carts.length);
    }
  }, [carts, currentDate]);

  function createNewCart() {
    api.post("/sale").then((res) => {
      setCurrentCart(res.data.data);
      carts.push(res.data.data);
      setCurrentCartPage(carts.length);
    });
  }
  return (
    <>
      <div>
        <section id="header">
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
            <p>{11}</p>
          </Flex>
        </section>
        <section id="main">
          {carts && carts[currentCartPage - 1] && (
            <Cart cart={carts[currentCartPage - 1]} />
          )}
        </section>
        <section id="btnTools"></section>
        <section id="navBar">
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

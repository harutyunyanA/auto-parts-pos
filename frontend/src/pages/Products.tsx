import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Flex, Pagination } from "antd";
import Text from "antd/es/typography/Text";
import api from "../api/client";
import { useState } from "react";

export default function Stock() {
  const { data: supplies } = useQuery({
    queryKey: ["supplies"],
    queryFn: () => {
      return api.get("/supplies").then((res) => res.data.data);
    },
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  console.log(supplies);
  return (
    <>
      <section id="header">
        <Text>
          Supply №<Text>{supplies?.[currentPage - 1]?.id || "-"}</Text>
        </Text>
      </section>
      <section id="main"></section>
      <section id="btns"></section>
      <section id="pagination">
        <Flex>
          <Button
            icon={<DoubleLeftOutlined />}
            // disabled={currentCartPage <= 1}
            // onClick={() => {
            //   if (currentCartPage > 1) {
            //     setCurrentCartPage(1);
            //   }
            // }}
            style={{ border: "none" }}
          ></Button>
          <Pagination
            simple={{ readOnly: true }}
            // current={currentCartPage}
            // total={carts?.length || 0}
            pageSize={1}
            // onChange={(current) => setCurrentCartPage(current)}
          />
          <Button
            icon={<DoubleRightOutlined />}
            // disabled={!carts || currentCartPage >= (carts.length || 0)}
            // onClick={() => {
            //   if (carts && currentCartPage < carts.length) {
            //     setCurrentCartPage(carts.length);
            //   }
            // }}
            style={{ border: "none" }}
          ></Button>
        </Flex>
      </section>
    </>
  );
}

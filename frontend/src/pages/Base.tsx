import { useQuery } from "@tanstack/react-query";
import { Flex } from "antd";
import { useState } from "react";
import type { ApiResponse } from "../types/api.types";
import type { IProduct } from "../modules/products/types";
import api from "../api/client";

export function Base() {
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["products/all", page],
    queryFn: () =>
      api
        .get<ApiResponse<IProduct[]>>("/product/all", {
          params: {
            page,
          },
        })
        .then((res) => res.data.data),

    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  console.log(data, page);
  return (
    <>
      <Flex vertical>
        <section style={{ flex: 3 }} id="filter">
          Category
        </section>
        <section style={{ flex: 8 }} id="main">
          Subcategory
        </section>
        <section style={{ flex: 1 }} id="pagination">
          Items
        </section>
      </Flex>
    </>
  );
}

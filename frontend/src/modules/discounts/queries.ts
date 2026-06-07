import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import type { IProduct } from "../products/types";
import type { IDiscountRule } from "./types";

// Reuses the product listing endpoint. Shares the ["products", ...] query key
// family so mutations that invalidate ["products"] also refresh this table.
export function useDiscountProducts(
  page: number,
  limit: number,
  filters: Record<string, unknown>,
  source: string | null,
) {
  return useQuery({
    queryKey: ["products", page, limit, filters, source],
    queryFn: () =>
      api
        .get<ApiResponse<{ items: IProduct[]; total: number }>>("/product/all", {
          params: { page, limit, ...filters },
        })
        .then((res) => res.data.data),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

// Saved discount rules for the current source.
export function useDiscountRules(source: string | null) {
  return useQuery({
    queryKey: ["discount-rules", source],
    queryFn: () =>
      api
        .get<ApiResponse<IDiscountRule[]>>("/discounts/rules")
        .then((res) => res.data.data),
    staleTime: 1000 * 60 * 5,
  });
}

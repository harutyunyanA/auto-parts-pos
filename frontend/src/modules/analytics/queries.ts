import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import { useSource } from "../../store/useAuthStore";
import type {
  ISupplierStat,
  ITopProduct,
  IDeadStockItem,
  IDateRange,
  TopProductsSort,
} from "./types";

const STALE = 5 * 60 * 1000;
const GC = 10 * 60 * 1000;

export function useSupplierStats(range: IDateRange) {
  const source = useSource();
  return useQuery({
    queryKey: ["analytics", "suppliers", source, range.from, range.to],
    queryFn: () =>
      api
        .get<ApiResponse<ISupplierStat[]>>("/analytics/suppliers", {
          params: range,
        })
        .then((res) => res.data.data ?? []),
    staleTime: STALE,
    gcTime: GC,
  });
}

export function useTopProducts(
  range: IDateRange,
  by: TopProductsSort,
  limit = 20,
) {
  const source = useSource();
  return useQuery({
    queryKey: [
      "analytics",
      "top-products",
      source,
      range.from,
      range.to,
      by,
      limit,
    ],
    queryFn: () =>
      api
        .get<ApiResponse<ITopProduct[]>>("/analytics/top-products", {
          params: { ...range, by, limit },
        })
        .then((res) => res.data.data ?? []),
    staleTime: STALE,
    gcTime: GC,
  });
}

export function useDeadStock(days: number) {
  const source = useSource();
  return useQuery({
    queryKey: ["analytics", "dead-stock", source, days],
    queryFn: () =>
      api
        .get<ApiResponse<IDeadStockItem[]>>("/analytics/dead-stock", {
          params: { days },
        })
        .then((res) => res.data.data ?? []),
    staleTime: STALE,
    gcTime: GC,
  });
}

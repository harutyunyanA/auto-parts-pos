import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import type {
  ISupplierStat,
  IDeadStockItem,
  IDateRange,
} from "./types";

const STALE = 5 * 60 * 1000;
const GC = 10 * 60 * 1000;

export function useSupplierStats(range: IDateRange) {
  return useQuery({
    queryKey: ["analytics", "suppliers", range.from, range.to],
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

export function useDeadStock(days: number) {
  return useQuery({
    queryKey: ["analytics", "dead-stock", days],
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

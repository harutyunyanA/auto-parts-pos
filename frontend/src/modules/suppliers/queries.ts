import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import type { ISupplier, ISupplierSuppliesResponse } from "./types";

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: () =>
      api
        .get<ApiResponse<ISupplier[]>>("/suppliers")
        .then((res) => res.data.data ?? []),
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

export function useSupplierSupplies(id: number) {
  return useQuery({
    queryKey: ["suppliers", id, "supplies"],
    queryFn: () =>
      api
        .get<ApiResponse<ISupplierSuppliesResponse>>(`/suppliers/${id}/supplies`)
        .then((res) => res.data.data),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

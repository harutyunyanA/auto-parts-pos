import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import type { IClient, IClientPurchasesResponse } from "./types";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () =>
      api
        .get<ApiResponse<IClient[]>>("/clients")
        .then((res) => res.data.data ?? []),
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

export function useClientPurchases(id: number) {
  return useQuery({
    queryKey: ["clients", id, "purchases"],
    queryFn: () =>
      api
        .get<ApiResponse<IClientPurchasesResponse>>(`/clients/${id}/purchases`)
        .then((res) => res.data.data),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

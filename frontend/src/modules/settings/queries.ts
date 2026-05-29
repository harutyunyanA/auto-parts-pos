import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import type { ISetting } from "./types";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () =>
      api
        .get<ApiResponse<ISetting[]>>("/settings")
        .then((res) => res.data.data ?? []),
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

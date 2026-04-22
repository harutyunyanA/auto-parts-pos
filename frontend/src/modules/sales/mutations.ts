import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
import { message } from "antd";
import type { ApiResponse } from "../../types/api.types";
import type { ICartItem } from "./types";

interface UseCartMutationsProps {
  cartId: number;
  currentDate: string;
  setFocusTarget: (target: {
    id: number | "new";
    field: "code" | "quantity" | "price";
  }) => void;
}

export function useCartMutations({
  cartId,
  currentDate,
  setFocusTarget,
}: UseCartMutationsProps) {
  const queryClient = useQueryClient();

  const mutationAdd = useMutation({
    mutationFn: (code: string) =>
      api.post<ApiResponse<ICartItem>>(`/sale/${cartId}/item/${code}`),
    onSuccess: (res) => {
      const newItem = res.data.data;
      queryClient.invalidateQueries({ queryKey: ["carts", currentDate] });
      setFocusTarget({ id: newItem.id, field: "quantity" });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Failed to add item");
    },
  });

  const mutationQty = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      api.patch<ApiResponse<ICartItem>>(`/sale/quantity/${id}`, { quantity }),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      setFocusTarget({ id: variables.id, field: "price" });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Failed to update quantity");
    },
  });

  const mutationPrice = useMutation({
    mutationFn: ({ id, price }: { id: number; price: number }) =>
      api.patch<ApiResponse<ICartItem>>(`/sale/price/${id}`, { price }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      setFocusTarget({ id: "new", field: "code" });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Failed to update price");
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => api.delete(`/sale/${id}`),
  });

  const mutationStatusToggle = useMutation({
    mutationFn: (id: number) => api.patch(`/sale/${id}/change-status/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts", currentDate] });
      message.success("Status updated");
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Failed to update status");
    },
  });

  const mutationCardPayment = useMutation({
    // mutationFn: (id : number) => api.patch
  })

  return {
    mutationAdd,
    mutationQty,
    mutationPrice,
    mutationDelete,
    mutationStatusToggle,
  };
}

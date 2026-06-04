import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
import { message } from "antd";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const mutationAdd = useMutation({
    mutationFn: (code: string) =>
      api.post<ApiResponse<ICartItem>>(`/sale/${cartId}/item/${code}`),
    onSuccess: (res) => {
      const newItem = res.data.data;
      queryClient.invalidateQueries({ queryKey: ["carts", currentDate] });
      if (newItem) setFocusTarget({ id: newItem.id, field: "quantity" });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || t("toast.failedAddItem"));
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
      message.error(err.response?.data?.message || t("toast.failedUpdateQty"));
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
      message.error(err.response?.data?.message || t("toast.failedUpdatePrice"));
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => api.delete(`/sale/item/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts", currentDate] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || t("toast.failedDeleteItem"));
    },
  });

  const mutationStatusToggle = useMutation({
    mutationFn: (id: number) => api.patch(`/sale/${id}/change-status/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts", currentDate] });
      message.success(t("toast.statusUpdated"));
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || t("toast.failedUpdateStatus"));
    },
  });

  const mutationCardPayment = useMutation({
    mutationFn: (id: number) => api.patch(`/sale/${id}/card-payment`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts", currentDate] });
    },
    onError: (err: any) => {
      message.error(
        err.response?.data?.message || t("toast.failedCardPayment"),
      );
    },
  });

  return {
    mutationAdd,
    mutationQty,
    mutationPrice,
    mutationDelete,
    mutationStatusToggle,
    mutationCardPayment,
  };
}

export function useSetCartClient() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      cartId,
      clientId,
    }: {
      cartId: number;
      clientId: number | null;
    }) => api.patch(`/sale/${cartId}/client`, { clientId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || t("toast.failedSetClient"));
    },
  });
}

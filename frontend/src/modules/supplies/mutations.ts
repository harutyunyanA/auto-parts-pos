import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
import { message } from "antd";
import { useTranslation } from "react-i18next";

interface UseSupplyMutationsProps {
  supplyId: number | undefined;
  setFocusTarget: (target: {
    id: number | "new";
    field:
      | "code"
      | "quantity"
      | "purchasePriceUsd"
      | "usdRate"
      | "weight"
      | "tax"
      | "purchasePrice"
      | "salePrice"
      | "minQuantity";
  }) => void;
}

export function useSupplyMutations({
  supplyId,
  setFocusTarget,
}: UseSupplyMutationsProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const mutationAdd = useMutation({
    mutationFn: (productId: string) =>
      api.post(`/supplies/${supplyId}/item`, { productId: Number(productId) }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
      const newItem = res.data.data;
      setFocusTarget({ id: newItem.id, field: "quantity" });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || t("toast.failedAddItem"));
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.patch(`/supplies/${supplyId}/item/${id}`, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });

      const nextField: Record<
        string,
        | "quantity"
        | "purchasePriceUsd"
        | "weight"
        | "tax"
        | "purchasePrice"
        | "salePrice"
      > = {
        quantity: "purchasePrice",
        purchasePrice: "salePrice",
        purchasePriceUsd: "weight",
        weight: "tax",
        tax: "salePrice",
      };

      const currentField = Object.keys(variables.data)[0];
      const next = nextField[currentField];

      if (next) {
        setFocusTarget({ id: variables.id, field: next });
      } else {
        setFocusTarget({ id: "new", field: "code" });
      }
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || t("toast.failedUpdateItem"));
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => api.delete(`/supplies/${supplyId}/item/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || t("toast.failedDeleteItem"));
    },
  });

  const mutationStatusToggle = useMutation({
    mutationFn: (id: number) => api.patch(`/supplies/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || t("toast.failedUpdateStatus"));
    },
  });

  return {
    mutationAdd,
    mutationUpdate,
    mutationDelete,
    mutationStatusToggle,
  };
}

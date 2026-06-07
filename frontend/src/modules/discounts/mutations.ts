import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import { useSource } from "../../store/useAuthStore";
import type { IProduct } from "../products/types";
import type {
  IBulkDiscountResult,
  IBulkDiscountRule,
  IResetDiscountResult,
  ISetProductDiscountPayload,
} from "./types";

function errMessage(err: any, fallback: string) {
  return (
    err.response?.data?.error?.message ||
    err.response?.data?.message ||
    fallback
  );
}

// Set the discount on a single product (reuses PATCH /product).
export function useSetProductDiscount() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const source = useSource();

  return useMutation({
    mutationFn: ({ code, discount }: ISetProductDiscountPayload) =>
      api
        .patch<ApiResponse<IProduct>>(
          "/product",
          { discount },
          { params: { code, source } },
        )
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      message.success(t("toast.discountUpdated"));
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedUpdateDiscount")));
    },
  });
}

// Apply discount rules by profit range to every product of the current source.
export function useBulkDiscount() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (rules: IBulkDiscountRule[]) =>
      api
        .patch<ApiResponse<IBulkDiscountResult>>("/discounts/bulk", { rules })
        .then((res) => res.data.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      message.success(t("toast.discountApplied", { n: data?.updated ?? 0 }));
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedApplyDiscount")));
    },
  });
}

// Zero out every discount for the current source.
export function useResetAllDiscounts() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () =>
      api
        .patch<ApiResponse<IResetDiscountResult>>("/discounts/reset-all")
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      message.success(t("toast.discountReset"));
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedApplyDiscount")));
    },
  });
}

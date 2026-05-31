import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import type {
  ICreateSupplierPayload,
  ISupplier,
  IUpdateSupplierPayload,
} from "./types";

function errMessage(err: any, fallback: string) {
  return (
    err.response?.data?.error?.message ||
    err.response?.data?.message ||
    fallback
  );
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: ICreateSupplierPayload) =>
      api
        .post<ApiResponse<ISupplier>>("/suppliers", payload)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      message.success(t("toast.supplierCreated"));
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedCreateSupplier")));
    },
  });
}

export function useUpdateSupplier(id: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: IUpdateSupplierPayload) =>
      api
        .patch<ApiResponse<ISupplier>>(`/suppliers/${id}`, payload)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      message.success(t("toast.supplierUpdated"));
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedUpdateSupplier")));
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/suppliers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      message.success(t("toast.supplierDeleted"));
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedDeleteSupplier")));
    },
  });
}

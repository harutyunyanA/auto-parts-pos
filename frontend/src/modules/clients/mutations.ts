import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import type {
  ICreateClientPayload,
  IClient,
  IUpdateClientPayload,
} from "./types";

function errMessage(err: any, fallback: string) {
  return (
    err.response?.data?.error?.message ||
    err.response?.data?.message ||
    fallback
  );
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: ICreateClientPayload) =>
      api
        .post<ApiResponse<IClient>>("/clients", payload)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      message.success(t("toast.clientCreated"));
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedCreateClient")));
    },
  });
}

export function useUpdateClient(id: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: IUpdateClientPayload) =>
      api
        .patch<ApiResponse<IClient>>(`/clients/${id}`, payload)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      message.success(t("toast.clientUpdated"));
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedUpdateClient")));
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      message.success(t("toast.clientDeleted"));
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedDeleteClient")));
    },
  });
}

export function usePayAllBonus(id: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => api.post(`/clients/${id}/pay-bonus`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", id, "purchases"] });
      message.success(t("toast.bonusPaidOut"));
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedPayBonus")));
    },
  });
}

export function useToggleCartBonusPaid(id: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ cartId, bonusPaid }: { cartId: number; bonusPaid: boolean }) =>
      api.patch(`/clients/purchases/${cartId}/bonus-paid`, { bonusPaid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", id, "purchases"] });
    },
    onError: (err: any) => {
      message.error(errMessage(err, t("toast.failedUpdateBonus")));
    },
  });
}

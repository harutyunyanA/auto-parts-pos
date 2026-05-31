import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import type { ISetting, IUpdateSettingPayload } from "./types";

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: IUpdateSettingPayload) =>
      api
        .patch<ApiResponse<ISetting>>("/settings", payload)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      message.success(t("toast.settingsSaved"));
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || t("toast.failedSave"));
    },
  });
}

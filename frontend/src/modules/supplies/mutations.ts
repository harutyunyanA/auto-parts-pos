import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
import { message } from "antd";

interface UseSupplyMutationsProps {
  supplyId: number | undefined;
  setFocusTarget: (target: {
    id: number | "new";
    field: "code" | "quantity" | "purchasePrice" | "salePrice" | "minQuantity";
  }) => void;
}

export function useSupplyMutations({
  supplyId,
  setFocusTarget,
}: UseSupplyMutationsProps) {
  const queryClient = useQueryClient();

  const mutationAdd = useMutation({
    mutationFn: (code: string) =>
      api.post(`/supplies/${supplyId}/item`, { code: Number(code) }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
      const newItem = res.data.data;
      setFocusTarget({ id: newItem.id, field: "quantity" });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Failed to add item");
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.patch(`/supplies/${supplyId}/item/${id}`, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
      
      // Determine next field to focus
      const fields: ("quantity" | "purchasePrice" | "salePrice")[] = ["quantity", "purchasePrice", "salePrice"];
      const currentField = Object.keys(variables.data)[0] as any;
      const currentIndex = fields.indexOf(currentField);
      
      if (currentIndex !== -1 && currentIndex < fields.length - 1) {
        setFocusTarget({ id: variables.id, field: fields[currentIndex + 1] });
      } else {
        setFocusTarget({ id: "new", field: "code" });
      }
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Failed to update item");
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => api.delete(`/supplies/${supplyId}/item/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Failed to delete item");
    },
  });

  const mutationStatusToggle = useMutation({
    mutationFn: (id: number) => api.patch(`/supplies/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Failed to update status");
    },
  });

  return {
    mutationAdd,
    mutationUpdate,
    mutationDelete,
    mutationStatusToggle,
  };
}

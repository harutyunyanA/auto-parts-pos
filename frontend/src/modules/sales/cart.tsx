import { Input, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ICart, ICartItem } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
import { useState, useRef, useEffect } from "react";
import type { ApiResponse } from "../../types/api.types";
import { useCurrentDate } from "../../store/useDateStore";

interface CartProps {
  cart: ICart;
}

export function Cart({ cart }: CartProps) {
  const queryClient = useQueryClient();
  const currentDate = useCurrentDate();
  const [focusTarget, setFocusTarget] = useState<{
    id: number | "new";
    field: "code" | "quantity" | "price";
  }>({ id: "new", field: "code" });

  const inputRefs = useRef<Record<string, any>>({});

  const mutationAdd = useMutation({
    mutationFn: (code: string) =>
      api.post<ApiResponse<ICartItem>>(`/sale/${cart.id}/item/${code}`),
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

  const handleCodeChange = async (record: any, code: string) => {
    if (!code) return;
    if (record.isNew) {
      mutationAdd.mutate(code);
    } else {
      if (record.quantity > 0) {
        message.error("Cannot change code if quantity > 0");
        return;
      }
      try {
        await mutationDelete.mutateAsync(record.id);
        mutationAdd.mutate(code);
      } catch (e: any) {
        message.error(e.response?.data?.message || "Failed to replace item");
      }
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 70,
      align: "center",
      render: (text: any, record: any) => (
        <Input
          key={`${record.key}-code-${text}`}
          ref={(el) => {
            inputRefs.current[`${record.key}-code`] = el;
          }}
          defaultValue={text}
          onPressEnter={(e: any) => handleCodeChange(record, e.target.value)}
          variant="borderless"
          style={{ width: "100%", padding: "0" }}
        />
      ),
    },
    {
      title: "OEM",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 200,
    },
    { title: "WXQP", dataIndex: "WXQP", key: "WXQP", width: 200 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type", width: 70 },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 70,
      align: "center",
      render: (text: any, record: any) =>
        record.isNew ? null : (
          <Input
            key={`${record.id}-qty-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-quantity`] = el;
            }}
            defaultValue={text}
            onFocus={(e) => e.target.select()}
            onPressEnter={(e: any) =>
              mutationQty.mutate({
                id: record.id,
                quantity: Number(e.target.value),
              })
            }
            variant="borderless"
            style={{ width: "100%", padding: "0" }}
          />
        ),
    },
    {
      title: "Price",
      dataIndex: "priceAtSale",
      key: "priceAtSale",
      width: 100,
      align: "center",
      render: (text: any, record: any) =>
        record.isNew ? null : (
          <Input
            key={`${record.id}-price-${text}`}
            ref={(el) => {
              inputRefs.current[`${record.id}-price`] = el;
            }}
            defaultValue={text}
            onFocus={(e) => e.target.select()}
            onPressEnter={(e: any) =>
              mutationPrice.mutate({
                id: record.id,
                price: Number(e.target.value),
              })
            }
            variant="borderless"
            style={{ width: "100%", padding: "0" }}
          />
        ),
    },
    { title: "Total", dataIndex: "totalPrice", key: "totalPrice", width: 70 },
    {
      title: "Stock",
      dataIndex: "quantityAtStore",
      key: "quantityAtStore",
      width: 70,
    },
  ];

  const dataSource = [
    ...cart.items.map((item) => ({ ...item, key: item.id })),
    { key: "new", isNew: true, code: "" },
  ];

  useEffect(() => {
    const key =
      focusTarget.id === "new"
        ? "new-code"
        : `${focusTarget.id}-${focusTarget.field}`;

    // Small timeout to ensure input is mounted after data refresh
    const timer = setTimeout(() => {
      const input = inputRefs.current[key];
      if (input) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [focusTarget, cart.items.length]);

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey="key"
      size="small"
      bordered
    />
  );
}

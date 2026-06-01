import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  InputNumber,
  Result,
  Select,
  Typography,
  message,
} from "antd";
import { useTranslation } from "react-i18next";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import type { ISupplier } from "../suppliers/types";
import CarAutoComplete from "./CarAutoComplete";
import type {
  AddProductFormValues,
  AddProductPayload,
  AddProductProps,
  IProduct,
} from "./types";

export function AddProduct({ onClose }: AddProductProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<AddProductFormValues>();
  const enableMinQty = Form.useWatch("enable_minimum_quantity", form);
  const queryClient = useQueryClient();
  const [createdCode, setCreatedCode] = useState<number | null>(null);

  const { data: suppliers } = useQuery<ISupplier[]>({
    queryKey: ["suppliers"],
    queryFn: () =>
      api
        .get<ApiResponse<ISupplier[]>>("/suppliers")
        .then((res) => res.data.data ?? []),
    staleTime: 60 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: (payload: AddProductPayload) =>
      api.post<ApiResponse<IProduct>>("/product", payload),
    onSuccess: (res) => {
      const created = res.data.data;
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (created?.code != null) {
        setCreatedCode(created.code);
      }
      form.resetFields();
    },
    onError: (err: any) => {
      message.error(
        err.response?.data?.message || t("toast.failedCreateProduct"),
      );
    },
  });

  if (createdCode != null) {
    return (
      <Result
        status="success"
        title={t("addProduct.created")}
        subTitle={`${t("addProduct.codeLabel")}: ${createdCode}`}
        extra={
          <Button type="primary" onClick={onClose}>
            {t("common.close")}
          </Button>
        }
      />
    );
  }

  const onFinish = (values: AddProductFormValues) => {
    const { enable_minimum_quantity, minimum_quantity, ...rest } = values;
    const payload: AddProductPayload = {
      ...rest,
      minimum_quantity: enable_minimum_quantity ? minimum_quantity ?? 0 : null,
    };
    mutation.mutate(payload);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ quantity: 0, purchase_price: 0, sale_price: 0 }}
    >
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        {t("addProduct.basics")}
      </Typography.Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <Form.Item
          name="name"
          label={t("addProduct.productName")}
          rules={[{ required: true, message: t("addProduct.nameRequired") }]}
        >
          <CarAutoComplete />
        </Form.Item>
        <Form.Item name="type" label={t("columns.type")}>
          <CarAutoComplete />
        </Form.Item>
        <Form.Item name="oem" label={t("columns.oem")}>
          <Input />
        </Form.Item>
        <Form.Item name="WXQP" label={t("columns.wxqp")}>
          <Input />
        </Form.Item>
      </div>

      <Typography.Title level={5}>
        {t("addProduct.inventoryPricing")}
      </Typography.Title>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
        <Form.Item name="quantity" label={t("columns.quantity")}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="purchase_price" label={t("columns.purchasePrice")}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="sale_price" label={t("columns.salePrice")}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
        <Form.Item label={t("addProduct.minimumQuantity")}>
          <Flex gap="small" align="center">
            <Form.Item name="minimum_quantity" noStyle>
              <InputNumber
                min={0}
                disabled={!enableMinQty}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="enable_minimum_quantity"
              valuePropName="checked"
              noStyle
            >
              <Checkbox />
            </Form.Item>
          </Flex>
        </Form.Item>
      </div>

      <Typography.Title level={5}>{t("columns.supplier")}</Typography.Title>
      <Form.Item name="supplier_id" label={t("columns.supplier")}>
        <Select
          allowClear
          placeholder={t("addProduct.selectSupplier")}
          options={suppliers?.map((s) => ({ label: s.name, value: s.id }))}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Flex justify="end" gap="small">
          <Button onClick={onClose} disabled={mutation.isPending}>
            {t("common.cancel")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
          >
            {t("common.create")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}

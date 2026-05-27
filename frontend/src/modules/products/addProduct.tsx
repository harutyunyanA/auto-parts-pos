import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Result,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import api from "../../api/client";
import type { ApiResponse } from "../../types/api.types";
import type { ISupplier } from "../suppliers/types";
import type { IProduct } from "./types";

interface AddProductProps {
  onClose: () => void;
}

interface AddProductFormValues {
  name: string;
  type?: string;
  oem?: string;
  WXQP?: string;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  enable_minimum_quantity?: boolean;
  minimum_quantity?: number;
  supplier_id?: number;
}

interface AddProductPayload {
  name: string;
  type?: string;
  oem?: string | null;
  WXQP?: string | null;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  minimum_quantity: number | null;
  supplier_id?: number | null;
}

export function AddProduct({ onClose }: AddProductProps) {
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
      message.error(err.response?.data?.message || "Failed to create product");
    },
  });

  if (createdCode != null) {
    return (
      <Result
        status="success"
        title="Product created"
        subTitle={`Code: ${createdCode}`}
        extra={
          <Button type="primary" onClick={onClose}>
            Close
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
        Basics
      </Typography.Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="type" label="Type">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="oem" label="OEM">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="WXQP" label="WXQP">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Title level={5}>Inventory & Pricing</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="quantity" label="Quantity">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="purchase_price" label="Purchase Price">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="sale_price" label="Sale Price">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Minimum Quantity">
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
        </Col>
      </Row>

      <Typography.Title level={5}>Supplier</Typography.Title>
      <Form.Item name="supplier_id" label="Supplier">
        <Select
          allowClear
          placeholder="Select a supplier"
          options={suppliers?.map((s) => ({ label: s.name, value: s.id }))}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Flex justify="end" gap="small">
          <Button onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
          >
            Create
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}

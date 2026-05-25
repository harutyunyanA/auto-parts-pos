import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import { Button, Checkbox, Form, Input, InputNumber, Select } from "antd";

export function AddProduct() {
  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => api.get("/suppliers").then((res) => res.data.data),
    staleTime: 60 * 60 * 1000,
  });

  return (
    <>
      <Form>
        <Form.Item name="name" label="Product Name">
          <Input />
        </Form.Item>
        <Form.Item name="type" label="Type">
          <Input />
        </Form.Item>
        <Form.Item name="serial_number" label="Serial Number / OEM">
          <Input />
        </Form.Item>
        <Form.Item name="WXQP" label="WXQP">
          <Input />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity">
          <InputNumber />
        </Form.Item>
        <Form.Item name="purchase_price" label="Purchase Price">
          <InputNumber />
        </Form.Item>
        <Form.Item name="sale_price" label="Sale Price">
          <InputNumber />
        </Form.Item>
        <Form.Item name="enable_minimum_quantity" valuePropName="checked">
          <Checkbox>Enable Minimum Quantity Alert</Checkbox>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.enable_minimum_quantity !==
            currentValues.enable_minimum_quantity
          }
        >
          {({ getFieldValue }) => (
            <Form.Item name="minimum_quantity" label="Minimum Quantity">
              <InputNumber
                disabled={!getFieldValue("enable_minimum_quantity")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item name="supplier_id" label="Supplier">
          <Select
            options={suppliers?.map((supplier) => ({
              label: supplier.name,
              value: supplier.id,
            }))}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Product
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

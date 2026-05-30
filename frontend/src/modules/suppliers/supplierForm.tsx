import { Form, Input, Button, Flex } from "antd";
import { useCreateSupplier, useUpdateSupplier } from "./mutations";
import type { ICreateSupplierPayload, ISupplier } from "./types";

interface SupplierFormProps {
  supplier?: ISupplier | null;
  onClose: () => void;
}

export function SupplierForm({ supplier, onClose }: SupplierFormProps) {
  const [form] = Form.useForm<ICreateSupplierPayload>();
  const isEdit = !!supplier;

  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier(supplier?.id ?? 0);
  const mutation = isEdit ? updateMutation : createMutation;

  const onFinish = (values: ICreateSupplierPayload) => {
    const payload: ICreateSupplierPayload = {
      name: values.name.trim(),
      phone: values.phone?.trim() || null,
    };
    mutation.mutate(payload, { onSuccess: () => onClose() });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{
        name: supplier?.name ?? "",
        phone: supplier?.phone ?? "",
      }}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Name is required" }]}
      >
        <Input placeholder="Supplier name" />
      </Form.Item>

      <Form.Item name="phone" label="Phone">
        <Input placeholder="Phone (optional)" />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Flex justify="end" gap="small">
          <Button onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            {isEdit ? "Save" : "Create"}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}

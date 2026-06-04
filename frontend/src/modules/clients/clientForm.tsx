import { Form, Input, Button, Flex } from "antd";
import { useTranslation } from "react-i18next";
import { useCreateClient, useUpdateClient } from "./mutations";
import type { ICreateClientPayload, IClient } from "./types";

interface ClientFormProps {
  client?: IClient | null;
  onClose: () => void;
}

export function ClientForm({ client, onClose }: ClientFormProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<ICreateClientPayload>();
  const isEdit = !!client;

  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient(client?.id ?? 0);
  const mutation = isEdit ? updateMutation : createMutation;

  const onFinish = (values: ICreateClientPayload) => {
    const payload: ICreateClientPayload = {
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
        name: client?.name ?? "",
        phone: client?.phone ?? "",
      }}
    >
      <Form.Item
        name="name"
        label={t("columns.name")}
        rules={[{ required: true, message: t("clientForm.nameRequired") }]}
      >
        <Input placeholder={t("clientForm.namePlaceholder")} />
      </Form.Item>

      <Form.Item name="phone" label={t("columns.phone")}>
        <Input placeholder={t("clientForm.phonePlaceholder")} />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Flex justify="end" gap="small">
          <Button onClick={onClose} disabled={mutation.isPending}>
            {t("common.cancel")}
          </Button>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            {isEdit ? t("common.save") : t("common.create")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}

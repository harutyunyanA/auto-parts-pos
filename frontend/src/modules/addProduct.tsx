// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Button,
//   Card,
//   Space,
//   Typography,
//   message,
//   Row,
//   Col,
//   Divider,
// } from "antd";
// import {
//   PlusOutlined,
//   ArrowLeftOutlined,
//   SaveOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import api from "../api/client";
// // import { SuppliersList } from "../components/suppliersList";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { CodeSandboxCircleFilled } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, InputNumber, Select, Space } from "antd";

// const { Title } = Typography;

// export function AddProduct() {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { data: suppliers } = useQuery({
//     queryKey: ["suppliers"],
//     queryFn: () => api.get("/suppliers").then((res) => res.data),
//     staleTime: 60 * 60 * 1000,
//   });

//   const mutation = useMutation({
//     mutationFn: (values: any) => api.post("/products", values),
//     onSuccess: () => {
//       message.success("Product added successfully");
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//       form.resetFields();
//       // Optional: navigate back or keep on same page
//     },
//     onError: (error: any) => {
//       message.error(error.response?.data?.message || "Failed to add product");
//     },
//   });

//   const onFinish = (values: any) => {
//     // Convert undefined to null for optional fields if needed by backend
//     const payload = {
//       ...values,
//       type: values.type || "-",
//       serial_number: values.serial_number || null,
//       WXQP: values.WXQP || null,
//       minimum_quantity: values.minimum_quantity ?? null,
//       supplier_id: values.supplier_id ?? null,
//     };
//     mutation.mutate(payload);
//   };

//   return (
//     <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
//       <Space direction="vertical" size="large" style={{ width: "100%" }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Space align="center">
//             <Button
//               icon={<ArrowLeftOutlined />}
//               onClick={() => navigate(-1)}
//               type="text"
//             />
//             <Title level={2} style={{ margin: 0 }}>
//               Add New Product
//             </Title>
//           </Space>
//           <Button
//             type="primary"
//             icon={<SaveOutlined />}
//             onClick={() => form.submit()}
//             loading={mutation.isPending}
//           >
//             Save Product
//           </Button>
//         </div>

//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={onFinish}
//           initialValues={{
//             type: "-",
//             quantity: 0,
//             purchase_price: 0 as number,
//             sale_price: 0 as number,
//           }}
//         >
//           <Row gutter={24}>
//             <Col span={16}>
//               <Card title="General Information" variant="borderless">
//                 <Form.Item
//                   name="name"
//                   label="Product Name"
//                   rules={[
//                     { required: true, message: "Please enter product name" },
//                   ]}
//                 >
//                   <Input placeholder="Enter product name" size="large" />
//                 </Form.Item>

//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <Form.Item name="type" label="Type">
//                       <Input placeholder="e.g. Spare part, Oil" />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item name="code" label="Code (Internal)">
//                       <InputNumber
//                         placeholder="Leave empty for auto-gen"
//                         style={{ width: "100%" }}
//                       />
//                     </Form.Item>
//                   </Col>
//                 </Row>

//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <Form.Item name="serial_number" label="Serial Number / SKU">
//                       <Input placeholder="Enter serial number" />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item name="WXQP" label="WXQP">
//                       <Input placeholder="Enter WXQP code" />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </Card>

//               <div style={{ marginTop: 24 }}>
//                 <Card title="Inventory & Pricing" variant="borderless">
//                   <Row gutter={16}>
//                     <Col span={12}>
//                       <Form.Item
//                         name="quantity"
//                         label="Initial Quantity"
//                         rules={[{ required: true, message: "Enter quantity" }]}
//                       >
//                         <InputNumber min={0} style={{ width: "100%" }} />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item
//                         name="minimum_quantity"
//                         label="Minimum Quantity Alert"
//                       >
//                         <InputNumber
//                           min={0}
//                           style={{ width: "100%" }}
//                           placeholder="Optional"
//                         />
//                       </Form.Item>
//                     </Col>
//                   </Row>

//                   <Divider />

//                   <Row gutter={16}>
//                     <Col span={12}>
//                       <Form.Item
//                         name="purchase_price"
//                         label="Purchase Price"
//                         rules={[
//                           { required: true, message: "Enter purchase price" },
//                         ]}
//                       >
//                         <InputNumber
//                           min={0}
//                           style={{ width: "100%" }}
//                           formatter={(value) =>
//                             `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                           }
//                           parser={(value) =>
//                             value!.replace(/\$\s?|(,*)/g, "") as any
//                           }
//                         />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item
//                         name="sale_price"
//                         label="Sale Price"
//                         rules={[
//                           { required: true, message: "Enter sale price" },
//                         ]}
//                       >
//                         <InputNumber
//                           min={0}
//                           style={{ width: "100%" }}
//                           formatter={(value) =>
//                             `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                           }
//                           parser={(value) =>
//                             value!.replace(/\$\s?|(,*)/g, "") as any
//                           }
//                         />
//                       </Form.Item>
//                     </Col>
//                   </Row>
//                 </Card>
//               </div>
//             </Col>

//             <Col span={8}>
//               <Card title="Supplier" variant="borderless">
//                 <Form.Item name="supplier_id" label="Select Supplier">
//                   {/* <SuppliersList data={suppliers}/> */}
//                 </Form.Item>
//                 {/* <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
//                   Linking a product to a supplier helps in tracking inventory sources.
//                 </Typography.Text> */}
//               </Card>

//               <div style={{ marginTop: 24 }}>
//                 <Card title="Actions" variant="borderless">
//                   <Button
//                     type="primary"
//                     block
//                     size="large"
//                     icon={<PlusOutlined />}
//                     onClick={() => form.submit()}
//                     loading={mutation.isPending}
//                   >
//                     Create Product
//                   </Button>
//                   <Button
//                     block
//                     style={{ marginTop: 12 }}
//                     onClick={() => form.resetFields()}
//                   >
//                     Reset Form
//                   </Button>
//                 </Card>
//               </div>
//             </Col>
//           </Row>
//         </Form>
//       </Space>
//     </div>
//   );
// }
export function AddProduct() {
  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => api.get("/suppliers").then((res) => res.data.data),
    staleTime: 60 * 60 * 1000,
  });

  console.log(suppliers);

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
            prevValues.enable_minimum_quantity !== currentValues.enable_minimum_quantity
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

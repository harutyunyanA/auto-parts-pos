// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import api from "../api/client";
// import { Dropdown, Space, Input, Divider, theme, Button } from "antd";
// import { DownOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";

// const { useToken } = theme;

// interface Supplier {
//   id: number;
//   name: string;
//   phone?: string;
// }

// interface SuppliersListProps {
//   value?: number;
//   onChange?: (value: number | null) => void;
//   onSelectSupplier?: (supplier: Supplier | null) => void;
//   data: Supplier[];
// }

// export function SuppliersList({
//   value,
//   onChange,
//   onSelectSupplier,
// }: SuppliersListProps) {
//   const { token } = useToken();
//   const [searchValue, setSearchValue] = useState("");

//   const { data: suppliers } = useQuery({
//     queryKey: ["suppliers"],
//     queryFn: () => api.get("/suppliers").then((res) => res.data.data),
//     staleTime: 60 * 60 * 1000,
//   });
//   const selectedSupplier = suppliers?.find((s: Supplier) => s.id === value);

//   const handleSelect = (supplier: Supplier | null) => {
//     if (onChange) {
//       onChange(supplier ? supplier.id : null);
//     }
//     if (onSelectSupplier) {
//       onSelectSupplier(supplier);
//     }
//   };

//   const filteredSuppliers = suppliers?.filter((supplier: Supplier) =>
//     supplier.name.toLowerCase().includes(searchValue.toLowerCase()),
//   );

//   const supplierItems = [
//     {
//       key: "none",
//       label: (
//         <div onClick={() => handleSelect(null)}>
//           <Space>
//             <UserOutlined style={{ opacity: 0.5 }} />
//             <span style={{ color: token.colorTextDescription }}>None</span>
//           </Space>
//         </div>
//       ),
//     },
//     ...(filteredSuppliers?.map((supplier: Supplier) => ({
//       key: supplier.id.toString(),
//       label: (
//         <div onClick={() => handleSelect(supplier)}>
//           <Space>
//             <UserOutlined />
//             {supplier.name}
//             {supplier.phone && (
//               <span
//                 style={{ color: token.colorTextDescription, fontSize: "12px" }}
//               >
//                 ({supplier.phone})
//               </span>
//             )}
//           </Space>
//         </div>
//       ),
//     })) || []),
//   ];

//   return (
//     <Dropdown
//       menu={{ items: supplierItems }}
//       trigger={["click"]}
//       popupRender={(menu) => (
//         <div
//           style={{
//             backgroundColor: token.colorBgElevated,
//             borderRadius: token.borderRadiusLG,
//             boxShadow: token.boxShadowSecondary,
//           }}
//         >
//           <div style={{ padding: 8 }}>
//             <Input
//               placeholder="Search suppliers..."
//               prefix={<SearchOutlined />}
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               variant="filled"
//             />
//           </div>
//           <Divider style={{ margin: 0 }} />
//           <div style={{ maxHeight: "300px", overflowY: "auto" }}>{menu}</div>
//         </div>
//       )}
//     >
//       <Button
//         style={{ padding: "4px 12px", minWidth: "160px", textAlign: "left" }}
//       >
//         <Space style={{ width: "100%", justifyContent: "space-between" }}>
//           <Space>
//             <UserOutlined style={{ color: token.colorPrimary }} />
//             <span style={{ fontWeight: 500 }}>
//               {selectedSupplier ? selectedSupplier.name : "Select Supplier"}
//             </span>
//           </Space>
//           <DownOutlined style={{ fontSize: "10px", opacity: 0.5 }} />
//         </Space>
//       </Button>
//     </Dropdown>
//   );
// }

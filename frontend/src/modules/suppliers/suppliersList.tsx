import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
import { Dropdown, Space, Input, Divider, theme, Button } from "antd";
import { DownOutlined, ShopOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

const { useToken } = theme;

interface SuppliersListProps {
  currentSupply: any;
}

export function SuppliersList({ currentSupply }: SuppliersListProps) {
  const { token } = useToken();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");

  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => api.get("/suppliers").then((res) => res.data.data),
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  const updateSupplierMutation = useMutation({
    mutationFn: (supplierId: number) =>
      api.patch(`/supplies/${currentSupply?.id}/supplier`, { supplierId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
    },
  });

  const supplierItems = suppliers
    ?.filter((s: any) =>
      s.name.toLowerCase().includes(searchValue.toLowerCase()),
    )
    .map((s: any) => ({
      key: s.id.toString(),
      label: (
        <div onClick={() => updateSupplierMutation.mutate(s.id)}>
          <Space>
            <ShopOutlined />
            {s.name}
            {s.phone && (
              <span
                style={{ color: token.colorTextDescription, fontSize: "12px" }}
              >
                ({s.phone})
              </span>
            )}
          </Space>
        </div>
      ),
    }));

  const selectedSupplier = suppliers?.find(
    (s: any) => s.id === currentSupply?.supplierId,
  );

  return (
    <Dropdown
      menu={{ items: supplierItems }}
      trigger={["click"]}
      popupRender={(menu) => (
        <div
          style={{
            backgroundColor: token.colorBgElevated,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
            border: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            flexDirection: "column",
            maxHeight: "40vh",
          }}
        >
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Search suppliers..."
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              variant="filled"
            />
          </div>
          <Divider style={{ margin: 0 }} />
          <div style={{ overflowY: "auto", flex: 1 }}>{menu}</div>
        </div>
      )}
    >
      <Button
        type="text"
        style={{
          padding: "4px 12px",
          border: `1px solid ${token.colorBorderSecondary}`,
          backgroundColor: token.colorBgContainer,
          height: "32px",
        }}
      >
        <Space>
          <ShopOutlined style={{ color: token.colorPrimary }} />
          <span style={{ fontWeight: 500 }}>
            {selectedSupplier ? selectedSupplier.name : "Select Supplier"}
          </span>
          <DownOutlined style={{ fontSize: "10px", opacity: 0.5 }} />
        </Space>
      </Button>
    </Dropdown>
  );
}

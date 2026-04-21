import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { Dropdown, Space, Input, Divider, theme, Button } from "antd";
import { DownOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";

const { useToken } = theme;

export function ClientsList() {
  const { token } = useToken();
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");

  const { data } = useQuery({
    queryKey: ["clients"],
    queryFn: () => api.get("/clients").then((res) => res.data.data),
    staleTime: 60 * 60 * 1000,
  });

  // Set default client once data is loaded
  useEffect(() => {
    if (data && data.length > 0 && !selectedClient) {
      setSelectedClient(data[0]);
    }
  }, [data, selectedClient]);

  const clientItems = data
    ?.filter((client: any) =>
      client.name.toLowerCase().includes(searchValue.toLowerCase()),
    )
    .map((client: any) => ({
      key: client.id.toString(),
      label: (
        <div
          onClick={() => {
            setSelectedClient(client);
          }}
        >
          <Space>
            <UserOutlined />
            {client.name}
            {client.phone && (
              <span
                style={{ color: token.colorTextDescription, fontSize: "12px" }}
              >
                ({client.phone})
              </span>
            )}
          </Space>
        </div>
      ),
    }));

  return (
    <Dropdown
      menu={{ items: clientItems }}
      trigger={["click"]}
      popupRender={(menu) => (
        <div
          style={{
            backgroundColor: token.colorBgElevated,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
          }}
        >
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Search clients..."
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              variant="filled"
            />
          </div>
          <Divider style={{ margin: 0 }} />
          {menu}
        </div>
      )}
    >
      <Button type="text" style={{ padding: "4px 8px" }}>
        <Space>
          <UserOutlined style={{ color: token.colorPrimary }} />
          <span style={{ fontWeight: 500 }}>
            {selectedClient ? selectedClient.name : "Default"}
          </span>
          <DownOutlined style={{ fontSize: "10px", opacity: 0.5 }} />
        </Space>
      </Button>
    </Dropdown>
  );
}

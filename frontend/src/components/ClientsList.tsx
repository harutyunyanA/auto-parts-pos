import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { Dropdown, Space, Input, Divider, theme, Button } from "antd";
import { DownOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useSetCartClient } from "../modules/sales/mutations";
import type { ApiResponse } from "../types/api.types";
import type { ICart } from "../modules/sales/types";
import type { IClient } from "../modules/clients/types";

const { useToken } = theme;

interface ClientsListProps {
  cart: ICart | undefined;
}

export function ClientsList({ cart }: ClientsListProps) {
  const { t } = useTranslation();
  const { token } = useToken();
  const [searchValue, setSearchValue] = useState("");
  const setCartClient = useSetCartClient();

  const { data } = useQuery({
    queryKey: ["clients"],
    queryFn: () =>
      api
        .get<ApiResponse<IClient[]>>("/clients")
        .then((res) => res.data.data ?? []),
    staleTime: 60 * 60 * 1000,
  });

  const assign = (clientId: number | null) => {
    if (!cart) return;
    if (cart.clientId === clientId) return;
    setCartClient.mutate({ cartId: cart.id, clientId });
  };

  const filteredClients = (data ?? []).filter((client) =>
    client.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const clientItems = [
    {
      key: "none",
      label: (
        <div onClick={() => assign(null)}>
          <Space>
            <UserOutlined />
            {t("sales.noClient")}
          </Space>
        </div>
      ),
    },
    ...filteredClients.map((client) => ({
      key: client.id.toString(),
      label: (
        <div onClick={() => assign(client.id)}>
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
    })),
  ];

  const label = cart?.client?.name ?? t("sales.noClient");
  const isLocked = !cart || cart.status === "completed";

  return (
    <Dropdown
      disabled={isLocked}
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
              placeholder={t("sales.searchClients")}
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
      <Button type="text" style={{ padding: "4px 8px" }} loading={setCartClient.isPending}>
        <Space>
          <UserOutlined style={{ color: token.colorPrimary }} />
          <span style={{ fontWeight: 500 }}>{label}</span>
          <DownOutlined style={{ fontSize: "10px", opacity: 0.5 }} />
        </Space>
      </Button>
    </Dropdown>
  );
}

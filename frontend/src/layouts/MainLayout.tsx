import { useState } from "react";
import { Layout, Menu, Button, theme, Typography, DatePicker } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  CarOutlined,
  LogoutOutlined,
  UserOutlined,
  DatabaseOutlined,
  WarningOutlined,
  SettingOutlined,
  BarChartOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useSource, useClearSource } from "../store/useAuthStore";
import { useIsDarkMode } from "../store/useThemeStore";
import { useCurrentDate, useSetCurrentDate } from "../store/useDateStore";
import dayjs from "dayjs";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function MainLayout() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const source = useSource();
  const clearSource = useClearSource();
  const isDarkMode = useIsDarkMode();

  const currentISO = useCurrentDate();
  const currentDate = dayjs(currentISO);
  const setCurrentDate = useSetCurrentDate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <Link to="/">{t("menu.dashboard")}</Link>,
    },
    {
      key: "/base",
      icon: <DatabaseOutlined />,
      label: <Link to="/base">{t("menu.base")}</Link>,
    },
    {
      key: "/sales",
      icon: <ShoppingOutlined />,
      label: <Link to="/sales">{t("menu.sales")}</Link>,
    },
    {
      key: "/products",
      icon: <CarOutlined />,
      label: <Link to="/products">{t("menu.stock")}</Link>,
    },
    {
      key: "/deficit",
      icon: <WarningOutlined />,
      label: <Link to="/deficit">{t("menu.deficit")}</Link>,
    },
    {
      key: "/suppliers",
      icon: <ShopOutlined />,
      label: <Link to="/suppliers">{t("menu.suppliers")}</Link>,
    },
    {
      key: "/analytics",
      icon: <BarChartOutlined />,
      label: <Link to="/analytics">{t("menu.analytics")}</Link>,
    },
  ];

  const handleLogout = () => {
    queryClient.clear();
    clearSource();
    navigate("/selection");
  };

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={isDarkMode ? "dark" : "light"}
      >
        <div
          className="demo-logo-vertical"
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            strong
            style={{
              color: isDarkMode ? "#fff" : "#000",
              fontSize: collapsed ? 12 : 18,
            }}
          >
            {collapsed ? t("layout.appNameShort") : t("layout.appName")}
          </Text>
        </div>
        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={menuItems}
        />
        <div
          style={{
            position: "absolute",
            bottom: 16,
            width: "100%",
            padding: "0 16px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Button
            type="text"
            icon={<SettingOutlined />}
            block={!collapsed}
            onClick={() => navigate("/settings")}
          >
            {!collapsed && t("layout.settings")}
          </Button>
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            block={!collapsed}
            onClick={handleLogout}
          >
            {!collapsed && t("layout.logout")}
          </Button>
        </div>
      </Sider>
      <Layout style={{ height: "100%", overflow: "hidden" }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 24,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <DatePicker
              value={currentDate}
              onChange={(date) => date && setCurrentDate(date)}
              needConfirm
              maxDate={dayjs()}
              status={currentDate.isSame(dayjs(), "day") ? undefined : "error"}
              variant="filled"
            />

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  padding: "4px 12px",
                  background: isDarkMode ? "#1f1f1f" : "#f5f5f5",
                  borderRadius: 20,
                }}
              >
                <UserOutlined style={{ marginRight: 8 }} />
                <Text strong style={{ textTransform: "uppercase" }}>
                  {source || t("layout.guest")}
                </Text>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

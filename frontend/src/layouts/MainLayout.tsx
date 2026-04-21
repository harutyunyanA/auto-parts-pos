import { useState } from 'react';
import { Layout, Menu, Button, Switch, theme, Typography, DatePicker } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  CarOutlined,
  LogoutOutlined,
  BulbOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useSource, useClearSource } from '../store/useAuthStore';
import { useIsDarkMode, useToggleTheme } from '../store/useThemeStore';
import { useCurrentDate, useSetCurrentDate } from '../store/useDateStore';
import dayjs from 'dayjs';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const source = useSource();
  const clearSource = useClearSource();
  const isDarkMode = useIsDarkMode();
  const toggleTheme = useToggleTheme();
  
  const currentISO = useCurrentDate();
  const currentDate = dayjs(currentISO);
  const setCurrentDate = useSetCurrentDate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/sales',
      icon: <ShoppingOutlined />,
      label: <Link to="/sales">Sales</Link>,
    },
    {
      key: '/products',
      icon: <CarOutlined />,
      label: <Link to="/products">Stock</Link>,
    },
  ];

  const handleLogout = () => {
    clearSource();
    navigate('/selection');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme={isDarkMode ? 'dark' : 'light'}>
        <div className="demo-logo-vertical" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text strong style={{ color: isDarkMode ? '#fff' : '#000', fontSize: collapsed ? 12 : 18 }}>
            {collapsed ? 'POS' : 'AutoParts POS'}
          </Text>
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={menuItems}
        />
        <div style={{ position: 'absolute', bottom: 16, width: '100%', padding: '0 16px' }}>
          <Button 
            type="text" 
            danger 
            icon={<LogoutOutlined />} 
            block={!collapsed}
            onClick={handleLogout}
          >
            {!collapsed && 'Log Out'}
          </Button>
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <DatePicker 
              value={currentDate}
              onChange={(date) => date && setCurrentDate(date)}
              needConfirm
              maxDate={dayjs()}
              status={currentDate.isSame(dayjs(), 'day') ? undefined : 'error'}
              variant="filled"
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BulbOutlined />
                <Switch checked={isDarkMode} onChange={toggleTheme} size="small" />
              </div>
              
              <div style={{ padding: '4px 12px', background: isDarkMode ? '#1f1f1f' : '#f5f5f5', borderRadius: 20 }}>
                <UserOutlined style={{ marginRight: 8 }} />
                <Text strong style={{ textTransform: 'uppercase' }}>{source || 'Guest'}</Text>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

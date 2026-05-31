import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import enUS from 'antd/locale/en_US';
import hyAM from 'antd/locale/hy_AM';
import { useSource } from './store/useAuthStore';
import { useIsDarkMode } from './store/useThemeStore';
import { router } from './router/router';
import './App.css';

export default function App() {
  const source = useSource();
  const isDarkMode = useIsDarkMode();
  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={i18n.language.startsWith('hy') ? hyAM : enUS}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: source === 'import' ? '#1890ff' : '#52c41a',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

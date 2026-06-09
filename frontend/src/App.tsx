import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import enUS from 'antd/locale/en_US';
import hyAM from 'antd/locale/hy_AM';
import { useIsDarkMode } from './store/useThemeStore';
import { useCompact } from './hooks/useCompact';
import { router } from './router/router';
import './App.css';

export default function App() {
  const isDarkMode = useIsDarkMode();
  const compact = useCompact();
  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={i18n.language.startsWith('hy') ? hyAM : enUS}
      theme={{
        algorithm: [
          isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          ...(compact ? [theme.compactAlgorithm] : []),
        ],
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

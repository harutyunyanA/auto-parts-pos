import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { useSource } from './store/useAuthStore';
import { useIsDarkMode } from './store/useThemeStore';
import { router } from './router/router';
import './App.css';

export default function App() {
  const source = useSource();
  const isDarkMode = useIsDarkMode();

  return (
    <ConfigProvider
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

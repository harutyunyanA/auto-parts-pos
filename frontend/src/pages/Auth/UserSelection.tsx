import { Card, Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSetSource } from '../../store/useAuthStore';
import { useResetDate } from '../../store/useDateStore';
import { ShopOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Title} = Typography;

export default function UserSelection() {
  const { t } = useTranslation();
  const setSource = useSetSource();
  const resetDate = useResetDate();
  const navigate = useNavigate();

  const handleSelect = (source: 'import' | 'soviet') => {
    setSource(source);
    resetDate();
    navigate('/');
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Title level={2} style={{ marginBottom: 40 }}>{t('selection.title')}</Title>

      <Space size={40}>
        <Card
          hoverable
          style={{ width: 300, textAlign: 'center' }}
          cover={<ShopOutlined style={{ fontSize: 64, marginTop: 40, color: '#1890ff' }} />}
          onClick={() => handleSelect('import')}
        >
          <Card.Meta
            title={t('selection.desk1Title')}
            description={t('selection.desk1Desc')}
          />
          <Button type="primary" block style={{ marginTop: 20 }}>{t('selection.enter')}</Button>
        </Card>

        <Card
          hoverable
          style={{ width: 300, textAlign: 'center' }}
          cover={<DatabaseOutlined style={{ fontSize: 64, marginTop: 40, color: '#52c41a' }} />}
          onClick={() => handleSelect('soviet')}
        >
          <Card.Meta
            title={t('selection.desk2Title')}
            description={t('selection.desk2Desc')}
          />
          <Button type="primary" block style={{ marginTop: 20, backgroundColor: '#52c41a', borderColor: '#52c41a' }}>{t('selection.enter')}</Button>
        </Card>
      </Space>
    </div>
  );
}

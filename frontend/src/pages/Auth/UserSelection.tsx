import { Card, Button, Typography } from 'antd';
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
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{ background: '#f0f2f5' }}
    >
      <Title level={2} style={{ marginBottom: 40, textAlign: 'center' }}>{t('selection.title')}</Title>

      <div className="flex flex-wrap justify-center gap-10 w-full">
        <Card
          hoverable
          className="w-full max-w-75"
          style={{ textAlign: 'center' }}
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
          className="w-full max-w-75"
          style={{ textAlign: 'center' }}
          cover={<DatabaseOutlined style={{ fontSize: 64, marginTop: 40, color: '#52c41a' }} />}
          onClick={() => handleSelect('soviet')}
        >
          <Card.Meta
            title={t('selection.desk2Title')}
            description={t('selection.desk2Desc')}
          />
          <Button type="primary" block style={{ marginTop: 20, backgroundColor: '#52c41a', borderColor: '#52c41a' }}>{t('selection.enter')}</Button>
        </Card>
      </div>
    </div>
  );
}

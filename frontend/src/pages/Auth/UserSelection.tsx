import { Card, Button, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ShopOutlined } from '@ant-design/icons';
import api from '../../api/client';
import { useSetCashDesk } from '../../store/useAuthStore';
import { useResetDate } from '../../store/useDateStore';

const { Title } = Typography;

interface CashDesk {
  id: number;
  name: string;
  active: boolean;
}

export default function UserSelection() {
  const { t } = useTranslation();
  const setCashDesk = useSetCashDesk();
  const resetDate = useResetDate();
  const navigate = useNavigate();

  const { data: desks, isLoading } = useQuery({
    queryKey: ['cash-desks'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: CashDesk[] }>(
        '/cash-desks',
      );
      return res.data.data;
    },
  });

  const handleSelect = (desk: CashDesk) => {
    setCashDesk(desk.id, desk.name);
    resetDate();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{ background: '#f0f2f5' }}
    >
      <Title level={2} style={{ marginBottom: 40, textAlign: 'center' }}>
        {t('selection.title')}
      </Title>

      {isLoading ? (
        <Spin size="large" />
      ) : (
        <div className="flex flex-wrap justify-center gap-10 w-full">
          {(desks ?? []).map((desk) => (
            <Card
              key={desk.id}
              hoverable
              className="w-full max-w-75"
              style={{ textAlign: 'center' }}
              cover={
                <ShopOutlined
                  style={{ fontSize: 64, marginTop: 40, color: '#1890ff' }}
                />
              }
              onClick={() => handleSelect(desk)}
            >
              <Card.Meta title={desk.name} />
              <Button type="primary" block style={{ marginTop: 20 }}>
                {t('selection.enter')}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

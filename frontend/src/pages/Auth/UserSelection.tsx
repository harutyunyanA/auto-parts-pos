import { Card, Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSetSource } from '../../store/useAuthStore';
import { useResetDate } from '../../store/useDateStore';
import { ShopOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Title} = Typography;

export default function UserSelection() {
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
      <Title level={2} style={{ marginBottom: 40 }}>Select Cash Desk</Title>
      
      <Space size={40}>
        <Card 
          hoverable 
          style={{ width: 300, textAlign: 'center' }}
          cover={<ShopOutlined style={{ fontSize: 64, marginTop: 40, color: '#1890ff' }} />}
          onClick={() => handleSelect('import')}
        >
          <Card.Meta 
            title="Desk 1 (Import)" 
            description="Working with imported parts" 
          />
          <Button type="primary" block style={{ marginTop: 20 }}>Enter</Button>
        </Card>

        <Card 
          hoverable 
          style={{ width: 300, textAlign: 'center' }}
          cover={<DatabaseOutlined style={{ fontSize: 64, marginTop: 40, color: '#52c41a' }} />}
          onClick={() => handleSelect('soviet')}
        >
          <Card.Meta 
            title="Desk 2 (Soviet)" 
            description="Working with Soviet parts" 
          />
          <Button type="primary" block style={{ marginTop: 20, backgroundColor: '#52c41a', borderColor: '#52c41a' }}>Enter</Button>
        </Card>
      </Space>
    </div>
  );
}

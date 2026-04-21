import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

export default function Products() {
  return (
    <>
      <Title level={2}>Stock (Parts)</Title>
      <Paragraph>Manage your inventory of auto parts here.</Paragraph>
      <Card title="Inventory List" style={{ marginTop: 24 }}>
        <Paragraph>The product inventory table will be implemented soon.</Paragraph>
      </Card>
    </>
  );
}

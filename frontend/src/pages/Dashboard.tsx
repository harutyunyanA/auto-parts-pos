import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

export default function Dashboard() {
  return (
    <>
      <Title level={2}>Dashboard</Title>
      <Paragraph>Welcome to the AutoParts POS system. Here you can see an overview of your business.</Paragraph>
      <Card title="Quick Stats" style={{ marginTop: 24 }}>
        <Paragraph>Dashboard metrics will be implemented soon.</Paragraph>
      </Card>
    </>
  );
}

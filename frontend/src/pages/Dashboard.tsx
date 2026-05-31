import { Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

export default function Dashboard() {
  const { t } = useTranslation();
  return (
    <>
      <Title level={2}>{t("menu.dashboard")}</Title>
      <Paragraph>{t("dashboard.welcome")}</Paragraph>
    </>
  );
}

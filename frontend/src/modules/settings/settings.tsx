import { useEffect, useState } from "react";
import {
  Card,
  Switch,
  InputNumber,
  Button,
  Typography,
  Space,
  Divider,
  Segmented,
} from "antd";
import {
  BulbOutlined,
  DollarOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useIsDarkMode, useToggleTheme } from "../../store/useThemeStore";
import { useSettings } from "./queries";
import { useUpdateSetting } from "./mutations";
import { DEFAULT_USD_RATE_KEY } from "./types";

const { Title, Text } = Typography;

export function Settings() {
  const { t, i18n } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const toggleTheme = useToggleTheme();

  const { data: settings, isLoading } = useSettings();
  const updateSetting = useUpdateSetting();

  const [usdRate, setUsdRate] = useState<number | null>(null);

  const savedUsdRate = settings?.find(
    (s) => s.key === DEFAULT_USD_RATE_KEY,
  )?.value;

  // keep the input in sync once settings arrive (or are refetched)
  useEffect(() => {
    if (savedUsdRate !== undefined) {
      setUsdRate(Number(savedUsdRate));
    }
  }, [savedUsdRate]);

  const isDirty =
    usdRate !== null &&
    savedUsdRate !== undefined &&
    Number(savedUsdRate) !== usdRate;

  const handleSaveUsdRate = () => {
    if (usdRate === null) return;
    updateSetting.mutate({
      key: DEFAULT_USD_RATE_KEY,
      value: String(usdRate),
    });
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <Title level={3}>{t("settings.title")}</Title>

      <Card>
        <Space
          style={{ width: "100%", justifyContent: "space-between" }}
          align="center"
        >
          <Space>
            <BulbOutlined />
            <div>
              <Text strong>{t("settings.darkTheme")}</Text>
              <br />
              <Text type="secondary">{t("settings.storedLocally")}</Text>
            </div>
          </Space>
          <Switch checked={isDarkMode} onChange={toggleTheme} />
        </Space>

        <Divider />

        <Space
          style={{ width: "100%", justifyContent: "space-between" }}
          align="center"
        >
          <Space>
            <GlobalOutlined />
            <div>
              <Text strong>{t("settings.language")}</Text>
              <br />
              <Text type="secondary">{t("settings.languageHint")}</Text>
            </div>
          </Space>
          <Segmented
            value={i18n.language.startsWith("hy") ? "hy" : "en"}
            onChange={(val) => i18n.changeLanguage(val as string)}
            options={[
              { label: "EN", value: "en" },
              { label: "ՀԱՅ", value: "hy" },
            ]}
          />
        </Space>

        <Divider />

        <Space direction="vertical" style={{ width: "100%" }} size="small">
          <Space>
            <DollarOutlined />
            <div>
              <Text strong>{t("settings.defaultUsdRate")}</Text>
              <br />
              <Text type="secondary">{t("settings.sharedSetting")}</Text>
            </div>
          </Space>
          <Space>
            <InputNumber
              value={usdRate}
              onChange={setUsdRate}
              min={0}
              step={0.01}
              disabled={isLoading}
              style={{ width: 160 }}
            />
            <Button
              type="primary"
              onClick={handleSaveUsdRate}
              loading={updateSetting.isPending}
              disabled={!isDirty}
            >
              {t("common.save")}
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
}

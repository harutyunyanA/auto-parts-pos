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
  GiftOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useIsDarkMode, useToggleTheme } from "../../store/useThemeStore";
import { useSettings } from "./queries";
import { useUpdateSetting } from "./mutations";
import {
  DEFAULT_USD_RATE_KEY,
  BONUS_PERCENT_SOVIET_KEY,
  BONUS_PERCENT_IMPORT_KEY,
} from "./types";

const { Title, Text } = Typography;

interface BonusRowProps {
  settingKey: string;
  label: string;
}

function BonusRow({ settingKey, label }: BonusRowProps) {
  const { t } = useTranslation();
  const { data: settings, isLoading } = useSettings();
  const updateSetting = useUpdateSetting();

  const [value, setValue] = useState<number | null>(null);
  const saved = settings?.find((s) => s.key === settingKey)?.value;

  useEffect(() => {
    if (saved !== undefined) {
      setValue(Number(saved));
    }
  }, [saved]);

  const isDirty =
    value !== null && saved !== undefined && Number(saved) !== value;

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={4}>
      <Text strong>{label}</Text>
      <Space>
        <InputNumber
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={1}
          disabled={isLoading}
          style={{ width: 160 }}
        />
        <Button
          type="primary"
          loading={updateSetting.isPending}
          disabled={!isDirty}
          onClick={() => {
            if (value === null) return;
            updateSetting.mutate({ key: settingKey, value: String(value) });
          }}
        >
          {t("common.save")}
        </Button>
      </Space>
    </Space>
  );
}

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

        <Divider />

        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Space>
            <GiftOutlined />
            <div>
              <Text strong>{t("settings.bonusTitle")}</Text>
              <br />
              <Text type="secondary">{t("settings.bonusHint")}</Text>
            </div>
          </Space>
          <BonusRow
            settingKey={BONUS_PERCENT_SOVIET_KEY}
            label={t("settings.bonusPercentSoviet")}
          />
          <BonusRow
            settingKey={BONUS_PERCENT_IMPORT_KEY}
            label={t("settings.bonusPercentImport")}
          />
        </Space>
      </Card>
    </div>
  );
}

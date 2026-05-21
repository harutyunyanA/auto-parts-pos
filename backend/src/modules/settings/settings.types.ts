export const DEFAULT_USD_RATE_KEY = "default_usd_rate";
export const DEFAULT_TAX_KEY = "default_tax";

export const SETTINGS_DEFAULTS: Record<string, string> = {
  [DEFAULT_USD_RATE_KEY]: "1",
  [DEFAULT_TAX_KEY]: "0",
};

export type SettingType = {
  id: number;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
};

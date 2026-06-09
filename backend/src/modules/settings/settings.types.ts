export const DEFAULT_USD_RATE_KEY = "default_usd_rate";
export const DEFAULT_TAX_KEY = "default_tax";
// Single global bonus percent — no longer split per cash desk.
export const BONUS_PERCENT_KEY = "bonus_percent";

export const SETTINGS_DEFAULTS: Record<string, string> = {
  [DEFAULT_USD_RATE_KEY]: "1",
  [DEFAULT_TAX_KEY]: "0",
  [BONUS_PERCENT_KEY]: "10",
};

export type SettingType = {
  id: number;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
};

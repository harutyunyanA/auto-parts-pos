export const DEFAULT_USD_RATE_KEY = "default_usd_rate";
export const DEFAULT_TAX_KEY = "default_tax";
export const BONUS_PERCENT_SOVIET_KEY = "bonus_percent_soviet";
export const BONUS_PERCENT_IMPORT_KEY = "bonus_percent_import";

export const SETTINGS_DEFAULTS: Record<string, string> = {
  [DEFAULT_USD_RATE_KEY]: "1",
  [DEFAULT_TAX_KEY]: "0",
  [BONUS_PERCENT_SOVIET_KEY]: "10",
  [BONUS_PERCENT_IMPORT_KEY]: "10",
};

export function bonusPercentKey(source: string): string {
  return `bonus_percent_${source}`;
}

export type SettingType = {
  id: number;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
};

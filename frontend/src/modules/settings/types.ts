export interface ISetting {
  id: number;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_USD_RATE_KEY = "default_usd_rate";
export const BONUS_PERCENT_SOVIET_KEY = "bonus_percent_soviet";
export const BONUS_PERCENT_IMPORT_KEY = "bonus_percent_import";

export interface IUpdateSettingPayload {
  key: string;
  value: string;
}

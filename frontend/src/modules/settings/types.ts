export interface ISetting {
  id: number;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_USD_RATE_KEY = "default_usd_rate";

export interface IUpdateSettingPayload {
  key: string;
  value: string;
}

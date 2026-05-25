import { Setting } from "./settings.model.ts";
import { SETTINGS_DEFAULTS } from "./settings.types.ts";
import { NotFoundError } from "../../utils/errors.ts";

class SettingsService {
  async getAll() {
    return Setting.findAll({ order: [["key", "ASC"]] });
  }

  async getValue(key: string): Promise<string | null> {
    const row = await Setting.findOne({ where: { key } });
    return row ? row.value : null;
  }

  async getNumber(key: string): Promise<number | null> {
    const value = await this.getValue(key);
    if (value === null) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  async setValue(key: string, value: string) {
    const [row] = await Setting.findOrCreate({
      where: { key },
      defaults: { key, value },
    });
    if (row.value !== value) {
      row.value = value;
      await row.save();
    }
    return row;
  }

  async update(key: string, value: string) {
    const row = await Setting.findOne({ where: { key } });
    if (!row) throw new NotFoundError(`Setting "${key}" not found`);
    row.value = value;
    await row.save();
    return row;
  }

  async seedDefaults() {
    for (const [key, value] of Object.entries(SETTINGS_DEFAULTS)) {
      await Setting.findOrCreate({
        where: { key },
        defaults: { key, value },
      });
    }
  }
}

export default new SettingsService();

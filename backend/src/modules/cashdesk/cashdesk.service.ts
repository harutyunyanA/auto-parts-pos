import { CashDesk } from "./cashdesk.model.ts";
import { CASH_DESK_DEFAULTS } from "./cashdesk.types.ts";

class CashDeskService {
  async getActive() {
    return CashDesk.findAll({
      where: { active: true },
      order: [["id", "ASC"]],
    });
  }

  async exists(id: number): Promise<boolean> {
    const row = await CashDesk.findOne({ where: { id, active: true } });
    return !!row;
  }

  async seedDefaults() {
    for (const name of CASH_DESK_DEFAULTS) {
      await CashDesk.findOrCreate({ where: { name }, defaults: { name } });
    }
  }
}

export default new CashDeskService();

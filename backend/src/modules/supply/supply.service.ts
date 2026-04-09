import { Supply } from "./supply.model.ts";

class SupplyService {
  async createSupply(supplierId: number, source: string) {
    console.log(supplierId);
    const newSupply = (await Supply.create({ supplierId, source }));
    return { success: true, data: newSupply };
  }
}

export default new SupplyService();

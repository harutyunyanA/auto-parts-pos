import { Supplier } from "./supplier.model.ts";
import type { SupplierCreationType } from "./supplier.types.ts";
import { NotFoundError } from "../../utils/errors.ts";

class SupplierService {
  async getAll() {
    const suppliers = await Supplier.findAll({
      attributes: ["id", "name", "phone"],
      order: [["name", "ASC"]],
    });
    return suppliers;
  }

  async getById(id: number) {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new NotFoundError(`Supplier with id ${id} not found`);
    }
    return supplier;
  }

  async create(data: SupplierCreationType) {
    const supplier = await Supplier.create(data);
    return supplier;
  }

  async update(id: number, data: Partial<SupplierCreationType>) {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new NotFoundError(`Supplier with id ${id} not found`);
    }
    await supplier.update(data);
    return supplier;
  }

  async delete(id: number) {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new NotFoundError(`Supplier with id ${id} not found`);
    }
    await supplier.destroy();
    return { success: true };
  }
}

export default new SupplierService();

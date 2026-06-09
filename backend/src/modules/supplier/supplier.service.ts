import { Supplier } from "./supplier.model.ts";
import type { SupplierCreationType } from "./supplier.types.ts";
import { NotFoundError, BadRequestError } from "../../utils/errors.ts";
import { Supply, SupplyItem } from "../supply/supply.model.ts";
import { Product } from "../product/product.model.ts";

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

    const [productCount, supplyCount] = await Promise.all([
      Product.count({ where: { supplier_id: id } }),
      Supply.count({ where: { supplierId: id } }),
    ]);

    if (productCount > 0 || supplyCount > 0) {
      throw new BadRequestError(
        "Cannot delete supplier: it has linked products or supplies",
      );
    }

    await supplier.destroy();
    return { success: true };
  }

  async getSuppliesBySupplier(id: number) {
    const supplier = await this.getById(id);

    const supplies = await Supply.findAll({
      where: { supplierId: id },
      include: [
        {
          model: SupplyItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["name", "id", "type", "oem", "WXQP"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const plain = supplies.map((s) => s.toJSON() as any);

    const stats = {
      totalSupplies: plain.length,
      totalSpent: plain.reduce((sum, s) => sum + Number(s.totalCost ?? 0), 0),
      totalItems: plain.reduce(
        (sum, s) =>
          sum +
          (s.items ?? []).reduce(
            (q: number, i: any) => q + Number(i.quantity ?? 0),
            0,
          ),
        0,
      ),
      lastSupplyAt: plain.length ? plain[0].createdAt : null,
    };

    return { supplier, supplies: plain, stats };
  }
}

export default new SupplierService();

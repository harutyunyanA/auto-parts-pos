import type { sourceType } from "../../types/source.types.ts";
import { Product } from "./product.model.ts";
import { Supplier } from "../supplier/supplier.model.ts";
import type {
  paginationParams,
  ProductCreationType,
  searchParams,
} from "./product.types.ts";
import { NotFoundError } from "../../utils/errors.ts";

class ProductServices {
  async getProductByCode(code: number, source: sourceType) {
    const res = (
      await Product.findOne({
        where: { code, source },
      })
    )?.toJSON();

    if (!res) {
      throw new NotFoundError("Product not found");
    }
    return res;
  }

  async addProduct(productData: ProductCreationType) {
    const product = await Product.create(productData);
    return product.dataValues;
  }

  async deleteProduct(code: number, source: sourceType) {
    const res = await Product.destroy({
      where: { code: code, source: source },
    });
    return res;
  }

  async updateProduct(
    code: number,
    source: sourceType,
    productData: ProductCreationType,
  ) {
    const res = await Product.update(
      {},
      { where: { code: code, source: source } },
    );
  }

  async getAllProducts(
    source: sourceType,
    paginationParams: paginationParams,
    searchParams: searchParams,
  ) {
    const { page = 1, limit = 500 } = paginationParams;
    const offset = (page - 1) * limit;

    const where: Record<string, any> = {
      source: source,
    };

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const result = await Product.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Supplier,
          as: "supplier",
          attributes: ["id", "name"],
        },
      ],
    });
    return { items: result.rows, total: result.count };
  }
}

export default new ProductServices();

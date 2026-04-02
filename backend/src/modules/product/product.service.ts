import type { sourceType } from "../../types/source.types.ts";
import { throwError } from "../../utils/throwError.ts";
import { Product } from "./product.model.ts";
import type { ProductCreationAttributes } from "./product.types.ts";

class ProductServices {
  async getProductByCode(code: number, source: sourceType) {
    const res = await Product.findOne({
      where: { code: code, source: source },
    });

    if (!res) {
      throwError("product not found", "NOT_FOUND", 404);
    }
    return res?.dataValues;
  }

  async addProduct(productData: ProductCreationAttributes) {
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
    productData: ProductCreationAttributes,
  ) {
    const res = await Product.update(
      {},
      { where: { code: code, source: source } },
    );
  }
}

export default new ProductServices();

import type { sourceType } from "../../types/source.types.ts";
import { Product } from "./product.model.ts";
import type { ProductCreationType } from "./product.types.ts";
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
}

export default new ProductServices();

import { constrainedMemory } from "node:process";
import { Product } from "./product.model.ts";
import type { ProductCreationAttributes } from "./product.types.ts";

class ProductSrvices {
  async getProductByCode(code: number, source: string) {
    const res = await Product.findOne({
      where: { code: code, source: source },
    });
    return res;
  }

  async addProduct(productData: ProductCreationAttributes) {
    const product = await Product.create(productData);
    return product.dataValues;
  }

  async deleteProduct(code: number, source: string) {
    const res = await Product.destroy({
      where: { code: code, source: source },
    });
    console.log(res);
    return res;
  }
}

export default new ProductSrvices();

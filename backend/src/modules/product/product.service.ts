import { Product } from "./product.model.ts";

class ProductSrvices {
  async getProductByCode(code: number) {
    const res = await Product.findAll({ where: { code: code } });

    return res
  }
}

export default new ProductSrvices();

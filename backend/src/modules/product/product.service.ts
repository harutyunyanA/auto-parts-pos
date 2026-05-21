import type { sourceType } from "../../types/source.types.ts";
import { Product } from "./product.model.ts";
import { Supplier } from "../supplier/supplier.model.ts";
import type {
  paginationParams,
  ProductCreationType,
  SoldProductsHistoryRow,
  searchParams,
  SuppliedProductsHistoryRow,
} from "./product.types.ts";
import { NotFoundError } from "../../utils/errors.ts";
import { Op } from "sequelize";
import { CartItem } from "../sale/sale.model.ts";
import { SupplyItem } from "../supply/supply.model.ts";
import dayjs from "dayjs";

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
    productData: Partial<ProductCreationType>,
  ) {
    const product = await Product.findOne({ where: { code, source } });
    if (!product) throw new NotFoundError("Product not found");

    await product.update(productData);
    return product.toJSON();
  }

  async getAllProducts(
    source: sourceType,
    paginationParams: paginationParams,
    searchParams: searchParams,
  ) {
    const { page = 1, limit = 20 } = paginationParams;
    const offset = (page - 1) * limit;

    const where: Record<string, any> = {
      source: source,
    };

    if (searchParams.code) {
      where.code = searchParams.code;
    }

    if (searchParams.name) {
      where.name = { [Op.like]: `%${searchParams.name}%` };
    }

    if (searchParams.type) {
      where.type = { [Op.like]: `%${searchParams.type}%` };
    }

    if (searchParams.serial_number) {
      where.serial_number = { [Op.like]: `%${searchParams.serial_number}%` };
    }

    if (searchParams.WXQP) {
      where.WXQP = { [Op.like]: `%${searchParams.WXQP}%` };
    }

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

  async getProductHistory(
    code: number,
    oem: string,
    source: sourceType,
    from: string,
    to: string,
  ) {
    const soldProducts = (await CartItem.findAll({
      where: {
        ...(from || to
          ? {
              createdAt: {
                ...(from && { [Op.gte]: from }),
                ...(to && { [Op.lte]: to }),
              },
            }
          : {}),
      },
      attributes: [
        "id",
        "quantity",
        "priceAtSale",
        "cartId",
        "totalPrice",
        "createdAt",
      ],
      include: [
        {
          model: Product,
          as: "product",
          where: { code, source },
          attributes: ["code", "name", "serial_number", "type"],
          required: true,
        },
      ],
    })) as SoldProductsHistoryRow[];

    console.log("tooo", to);
    const newSupplies = (await SupplyItem.findAll({
      where: {
        ...(from || to
          ? {
              createdAt: {
                ...(from && { [Op.gte]: from }),
                ...(to && { [Op.lte]: to }),
              },
            }
          : {}),
      },
      attributes: [
        "id",
        "quantity",
        "supplyId",
        "purchasePrice",
        "totalCost",
        "createdAt",
      ],
      include: [
        {
          model: Product,
          as: "product",
          where: { code, source },
          attributes: ["code", "name", "serial_number", "type"],
          required: true,
        },
      ],
    })) as SuppliedProductsHistoryRow[];

    const transformedSoldData = soldProducts.map((i) => {
      return {
        id: i.id,
        cartId: i.cartId,
        quantity: i.quantity,
        priceAtSale: i.priceAtSale,
        totalPrice: i.totalPrice,
        operation: "OUT",
        product: {
          code: i.product?.code,
          name: i.product?.name,
          serial_number: i.product?.serial_number,
          type: i.product?.type,
        },
        createdAt: dayjs(i.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    const transformeSuppliesdData = newSupplies.map((i) => {
      return {
        id: i.id,
        supplyId: i.supplyId,
        quantity: i.quantity,
        purchasePrice: i.purchasePrice,
        totalCost: i.totalCost,
        createdAt: dayjs(i.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        product: {
          code: i.product?.code,
          name: i.product?.name,
          serial_number: i.product?.serial_number,
          type: i.product?.type,
        },
      };
    });

    const transformedData = [
      ...transformedSoldData,
      ...transformeSuppliesdData,
    ];

    return transformedData.length > 1
      ? transformedData.sort((a, b) => (b.createdAt > a.createdAt ? -1 : 1))
      : transformedData;

    // return transformedData.sort((a, b) => {
    // return b.createdAt.getTime() - a.createdAt.getTime();
    // });
  }
}

export default new ProductServices();

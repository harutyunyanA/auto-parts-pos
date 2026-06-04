import { Client } from "./clients.model.ts";
import type {
  ClientCreationType,
  ClientPurchase,
  ClientPurchasesResponse,
  ClientStats,
} from "./clients.types.ts";
import { NotFoundError, BadRequestError } from "../../utils/errors.ts";
import { Cart, CartItem } from "../sale/sale.model.ts";
import { Product } from "../product/product.model.ts";
import settingsService from "../settings/settings.service.ts";
import { bonusPercentKey } from "../settings/settings.types.ts";
import type { sourceType } from "../../types/source.types.ts";

class ClientsService {
  async getAll() {
    return Client.findAll({
      attributes: ["id", "name", "phone"],
      order: [["name", "ASC"]],
    });
  }

  async getById(id: number) {
    const client = await Client.findByPk(id);
    if (!client) {
      throw new NotFoundError(`Client with id ${id} not found`);
    }
    return client;
  }

  async create(data: ClientCreationType) {
    return Client.create(data);
  }

  async update(id: number, data: Partial<ClientCreationType>) {
    const client = await this.getById(id);
    await client.update(data);
    return client;
  }

  async delete(id: number) {
    const client = await this.getById(id);

    const cartCount = await Cart.count({ where: { clientId: id } });
    if (cartCount > 0) {
      throw new BadRequestError(
        "Cannot delete client: it has linked purchases",
      );
    }

    await client.destroy();
    return { success: true };
  }

  async getBonusPercent(source: sourceType): Promise<number> {
    const pct = await settingsService.getNumber(bonusPercentKey(source));
    return pct ?? 10;
  }

  async getPurchases(
    id: number,
    source: sourceType,
  ): Promise<ClientPurchasesResponse> {
    const client = await this.getById(id);
    const bonusPercent = await this.getBonusPercent(source);

    const carts = await Cart.findAll({
      where: { clientId: id, source, status: "completed" },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["code", "name", "type", "oem"],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const purchases: ClientPurchase[] = carts.map((cart) => {
      const plain = cart.get({ plain: true }) as any;
      const totalAmount = Number(plain.totalAmount ?? 0);
      const bonusAmount = Math.round((totalAmount * bonusPercent) / 100);

      return {
        id: plain.id,
        createdAt: plain.createdAt,
        totalAmount,
        bonusAmount,
        bonusPaid: !!plain.bonusPaid,
        items: (plain.items ?? []).map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          priceAtSale: item.priceAtSale,
          totalPrice: item.totalPrice,
          code: item.product?.code ?? null,
          name: item.product?.name ?? "—",
          type: item.product?.type ?? "—",
          oem: item.product?.oem ?? null,
        })),
      };
    });

    const stats: ClientStats = {
      totalPurchases: purchases.length,
      totalSpent: purchases.reduce((sum, p) => sum + p.totalAmount, 0),
      bonusPercent,
      bonusAccrued: purchases.reduce((sum, p) => sum + p.bonusAmount, 0),
      bonusOutstanding: purchases.reduce(
        (sum, p) => sum + (p.bonusPaid ? 0 : p.bonusAmount),
        0,
      ),
      bonusPaid: purchases.reduce(
        (sum, p) => sum + (p.bonusPaid ? p.bonusAmount : 0),
        0,
      ),
    };

    return { client, purchases, stats, source };
  }

  async payAllBonus(id: number, source: sourceType) {
    await this.getById(id);
    await Cart.update(
      { bonusPaid: true },
      {
        where: {
          clientId: id,
          source,
          status: "completed",
          bonusPaid: false,
        },
      },
    );
    return this.getPurchases(id, source);
  }

  async setCartBonusPaid(cartId: number, bonusPaid: boolean) {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      throw new NotFoundError(`Cart with id ${cartId} not found`);
    }
    cart.bonusPaid = bonusPaid;
    await cart.save();
    return cart;
  }
}

export default new ClientsService();

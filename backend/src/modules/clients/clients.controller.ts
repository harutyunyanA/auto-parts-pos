import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../../utils/response.ts";
import service from "./clients.service.ts";
import logger from "../../utils/logger.ts";

class ClientsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const clients = await service.getAll();
      return successResponse(res, clients);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated.params;
      const client = await service.getById(id);
      return successResponse(res, client);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone } = req.validated.body;
      const client = await service.create({ name, phone: phone ?? null });
      return successResponse(res, client, 201);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated.params;
      const { name, phone } = req.validated.body;
      const client = await service.update(id, { name, phone });
      return successResponse(res, client);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated.params;
      const result = await service.delete(id);
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async getPurchases(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated.params;
      const result = await service.getPurchases(id);
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async payAllBonus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated.params;
      const result = await service.payAllBonus(id);
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async setCartBonusPaid(req: Request, res: Response, next: NextFunction) {
    try {
      const { cartId } = req.validated.params;
      const { bonusPaid } = req.validated.body;
      const result = await service.setCartBonusPaid(cartId, bonusPaid);
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
}

export default new ClientsController();

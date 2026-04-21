import type { Request, Response, NextFunction } from "express";
import clientsService from "./clients.service.ts";
import { successResponse } from "../../utils/response.ts";

class ClientsController {
  async getAllClients(req: Request, res: Response, next: NextFunction) {
    try {
      const clients = await clientsService.getAllClients();
      return successResponse(res, clients);
    } catch (error) {
      next(error);
    }
  }
}

export default new ClientsController();

import { pinoHttp } from "pino-http";
import logger from "../utils/logger.ts";

export const httpLogger = pinoHttp({ logger });

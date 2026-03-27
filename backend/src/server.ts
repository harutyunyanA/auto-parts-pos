import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.ts";
import logger from "./utils/logger.ts";
import { setupGracefulShutdown } from "./utils/graceful-shutdown.ts";

const PORT = process.env.PORT || 4000;

function start() {
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    
  });

  setupGracefulShutdown(server);
}

start();
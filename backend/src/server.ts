import dotenv from "dotenv";
dotenv.config({ path: ".env.v2" });
import { app } from "./app.ts";
import logger from "./utils/logger.ts";
import { setupGracefulShutdown } from "./utils/graceful-shutdown.ts";
import { sequelize } from "./config/db.ts";
import settingsService from "./modules/settings/settings.service.ts";
import cashDeskService from "./modules/cashdesk/cashdesk.service.ts";

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    logger.info("DB connected");

    await sequelize.sync({ alter: true });
    logger.info("Tables are synchronized");

    await settingsService.seedDefaults();
    logger.info("Settings defaults seeded");

    await cashDeskService.seedDefaults();
    logger.info("Cash desks seeded");

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    setupGracefulShutdown(server);
  } catch (e) {
    logger.error(`db error: ${e}`);
  }
}

start();

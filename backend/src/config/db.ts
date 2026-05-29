import { Sequelize } from "sequelize";
import env from "./env.ts";

export const sequelize = new Sequelize(
  env.DB_NAME as string,
  env.DB_USER as string,
  env.DB_PASSWORD as string,
  {
    host: env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
);

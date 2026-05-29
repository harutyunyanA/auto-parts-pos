import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT!,
  DB_HOST: process.env.DB_HOST!,
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  NODE_ENV: process.env.NODE_ENV!,
};

for (let [k, v] of Object.entries(env)) {
  if (!v) {
    throw new Error(`${k} is required in .env`);
  }
}

export default env;

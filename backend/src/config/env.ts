import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT!,
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  NODE_ENV: process.env.NODE_ENV!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  CORE_BACKEND_URL: process.env.CORE_BACKEND_URL!,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY!,
  JWT_SECRET: process.env.JWT_SECRET!,
  COURESES_CACHE_TIME: process.env.COURESES_CACHE_TIME!,
  CATEGORIES_CACHE_TIME: process.env.CATEGORIES_CACHE_TIME!,
};

for (let [k, v] of Object.entries(env)) {
  if (!v) {
    throw new Error(`${k} is required in .env`);
  }
}

export default env;

import dotenv from "dotenv";

// v2 runs against its own database. Load .env.v2 (gitignored, branch-local)
// instead of the shared .env so this variant never points at the production DB.
dotenv.config({ path: ".env.v2" });

const env = {
  PORT: process.env.PORT!,
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  NODE_ENV: process.env.NODE_ENV!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
};

for (let [k, v] of Object.entries(env)) {
  if (!v) {
    throw new Error(`${k} is required in .env.v2`);
  }
}

// Safety guard: v2 must never boot against the production database.
if (env.DB_NAME === "my_store") {
  throw new Error(
    "Refusing to start: the v2 build must not use the production DB 'my_store'. " +
      "Set DB_NAME to a v2 database (e.g. my_store_v2) in backend/.env.v2.",
  );
}

export default env;

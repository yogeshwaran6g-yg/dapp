import dotenv from "dotenv";

dotenv.config();


const DB_CONFIG = {
  //
  CONNECTION_STRING: process.env.DATABASE_URL || null,
  HOST: process.env.DB_HOST || "localhost",
  PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "",
  NAME: process.env.DB_NAME || "blockchain",

  SSL: process.env.DB_SSL === "true",

  MAX_POOL: process.env.DB_MAX_POOL
    ? Number(process.env.DB_MAX_POOL)
    : 20,
};

const JWT_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET
}

export { DB_CONFIG, JWT_CONFIG };
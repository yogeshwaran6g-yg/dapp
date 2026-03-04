import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from the apps/server directory
dotenv.config({ path: path.join(__dirname, "../../.env") });


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
  get JWT_SECRET() {
    return process.env.JWT_SECRET;
  }
};

const NETWORK_TYPE = process.env.NETWORK_TYPE || "testnet";
console.log(`[Config] Network Type: ${NETWORK_TYPE}`);

export { DB_CONFIG, JWT_CONFIG, NETWORK_TYPE };
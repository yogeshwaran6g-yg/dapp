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
  STATEMENT_TIMEOUT: 10000, // 10 seconds limit
};

const JWT_CONFIG = {
  get JWT_SECRET() {
    return process.env.JWT_SECRET;
  }
};

const NETWORK_TYPE = process.env.NETWORK_TYPE || "testnet";

const NETWORK_CONFIG = {
  testnet: {
    RPC_URLS: [
      'https://rpc-amoy.polygon.technology',
      'https://polygon-amoy-bor-rpc.publicnode.com',
      'https://1rpc.io/amoy',
      'https://polygon-amoy.drpc.org'
    ],
    USDT_ADDRESS: '0xAB32EAed1B1c2afa890a354B6D7D8BA730AcA434',
    ADMIN_WALLET: '0xc5bbc1fdfc9c88d6253bbd072bf3b8252287faf0'
  },
  mainnet: {
    RPC_URLS: [
      'https://polygon-rpc.com',
      'https://polygon.llamarpc.com',
      'https://rpc.ankr.com/polygon'
    ],
    USDT_ADDRESS: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    ADMIN_WALLET: '0x71C21BF1D394539659A722830fF4e2A0'
  }
};

const ACTIVE_CONFIG = NETWORK_CONFIG[NETWORK_TYPE] || NETWORK_CONFIG.testnet;

export { DB_CONFIG, JWT_CONFIG, NETWORK_TYPE, ACTIVE_CONFIG };
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
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
      'https://bsc-testnet.publicnode.com',
      'https://data-seed-prebsc-2-s1.binance.org:8545/'
    ],
    USDT_ADDRESS: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    SLOT_ACTIVATION_ADDRESS: '0xd9145CCE52D386f254917e481eB44e9943F39138',
    ADMIN_WALLET: '0xc5bbc1fdfc9c88d6253bbd072bf3b8252287faf0'
  },
  mainnet: {
    RPC_URLS: [
      'https://bsc-dataseed.binance.org/',
      'https://rpc.ankr.com/bsc',
      'https://binance.llamarpc.com'
    ],
    USDT_ADDRESS: '0x55d398326f99059fF775485246999027B3197955',
    ADMIN_WALLET: '0x71C21BF1D394539659A722830fF4e2A0'
  }
};

const ACTIVE_CONFIG = NETWORK_CONFIG[NETWORK_TYPE] || NETWORK_CONFIG.testnet;

export { DB_CONFIG, JWT_CONFIG, NETWORK_TYPE, ACTIVE_CONFIG };
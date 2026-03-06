import pg from "pg";
import { DB_CONFIG } from "./constants.js";

const { Pool } = pg;


const poolConfig = DB_CONFIG.CONNECTION_STRING
  ? {
    connectionString: DB_CONFIG.CONNECTION_STRING,
    ssl: DB_CONFIG.SSL
      ? { rejectUnauthorized: false }
      : false,
    max: DB_CONFIG.MAX_POOL,
    statement_timeout: DB_CONFIG.STATEMENT_TIMEOUT,
  }
  : {
    host: DB_CONFIG.HOST,
    port: DB_CONFIG.PORT,
    user: DB_CONFIG.USER,
    password: DB_CONFIG.PASSWORD,
    database: DB_CONFIG.NAME,
    ssl: DB_CONFIG.SSL
      ? { rejectUnauthorized: false }
      : false,
    max: DB_CONFIG.MAX_POOL,
    statement_timeout: DB_CONFIG.STATEMENT_TIMEOUT,
  };

const pool = new Pool(poolConfig);


(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected successfully");
    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed!");
    console.error(`Reason: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.error("\n[Troubleshooting Tips]");
      console.error("1. Ensure PostgreSQL service is running.");
      console.error("   - Linux/CodeSandbox: sudo service postgresql start");
      console.error("   - Windows: Start 'postgresql' service in Task Manager > Services");
      console.error("2. Check if the port (5432) is correct in .env");
      console.error("3. Verify your DATABASE_URL or DB_HOST credentials.");
    }

    // We don't exit in dev mode to allow the server to start (even if DB is down)
    // and let users see the error in the console.
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();


export const queryRunner = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result.rows || null;
  } catch (error) {
    console.error("Query Error:", error.message);
    throw error;
  }
};


export const transactionRunner = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction Error:", error.message);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
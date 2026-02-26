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
    };

const pool = new Pool(poolConfig);


(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected");
    client.release();    
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error.message);
    process.exit(1);
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
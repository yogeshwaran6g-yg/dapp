import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

async function check() {
    try {
        console.log("--- All DB Sessions ---");
        const res = await pool.query(`
            SELECT pid, state, now() - xact_start AS xact_duration, query_start, now() - query_start AS query_duration, query 
            FROM pg_stat_activity 
            WHERE query NOT LIKE '%pg_stat_activity%'
            ORDER BY xact_duration DESC NULLS LAST;
        `);
        console.table(res.rows);

        console.log("\n--- Active Locks ---");
        const locks = await pool.query(`
            SELECT 
                COALESCE(blockingl.relation::regclass::text, blockingl.locktype) AS locked_item,
                now() - blockeda.query_start AS waiting_duration,
                blockeda.pid AS blocked_pid,
                blockeda.query AS blocked_query,
                blockinga.pid AS blocking_pid,
                blockinga.query AS blocking_query
            FROM pg_catalog.pg_locks blockedl
            JOIN pg_catalog.pg_stat_activity blockeda ON blockedl.pid = blockeda.pid
            JOIN pg_catalog.pg_locks blockingl ON 
                (blockingl.transactionid = blockedl.transactionid OR blockingl.relation = blockedl.relation)
                AND blockingl.pid != blockedl.pid
            JOIN pg_catalog.pg_stat_activity blockinga ON blockingl.pid = blockinga.pid
            WHERE NOT blockedl.granted;
        `);
        console.table(locks.rows);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

check();

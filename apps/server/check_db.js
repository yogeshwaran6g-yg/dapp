import pool from './src/config/db.js';

const check = async () => {
    try {
        const users = await pool.query('SELECT COUNT(*) FROM users');
        const logs = await pool.query('SELECT COUNT(*) FROM treasury_logs');
        console.log(`Database Check: ${users.rows[0].count} users, ${logs.rows[0].count} treasury logs.`);
        process.exit(0);
    } catch (err) {
        console.error('DB Error:', err.message);
        process.exit(1);
    }
};

check();

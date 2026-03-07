import pool from './src/config/db.js';
import crypto from 'crypto';

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

async function setupAdmin() {
    try {
        console.log('--- Admin Table Setup ---');
        
        // Create table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ admin_users table ensured.');

        // Seed default admin
        const username = 'admin';
        const password = 'admin123';
        const hashedPassword = hashPassword(password);

        const checkRes = await pool.query('SELECT id FROM admin_users WHERE username = $1', [username]);
        
        if (checkRes.rows.length === 0) {
            await pool.query(
                'INSERT INTO admin_users (username, password) VALUES ($1, $2)',
                [username, hashedPassword]
            );
            console.log(`✅ Default admin seeded: ${username} / ${password}`);
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

        console.log('--- Setup Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during setup:', err);
        process.exit(1);
    }
}

setupAdmin();

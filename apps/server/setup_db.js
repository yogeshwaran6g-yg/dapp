import pool from './db.js';

const setupDatabase = async () => {
    try {
        console.log('--- Database Setup Started ---');

        // Create table
        console.log('Step 1: Creating "users" table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100),
                email VARCHAR(255) UNIQUE,
                phone_number VARCHAR(20),
                dob DATE,
                city VARCHAR(100),
                wallet_address VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✓ Table "users" ready.');

        // Seed initial data
        console.log('Step 2: Checking for initial data...');
        const res = await pool.query('SELECT COUNT(*) FROM users');
        if (parseInt(res.rows[0].count) === 0) {
            console.log('Seeding initial user data...');
            await pool.query(`
                INSERT INTO users (username, email, phone_number, dob, city, wallet_address)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, ['Alex Rivera', 'alex@luxe.io', '+123456789', '1992-05-15', 'New York', '0x71C...4e2']);
            console.log('✓ Initial user seeded.');
        } else {
            console.log('✓ Data already exists, skipping seed.');
        }

        console.log('--- Database Setup Successful ---');
        process.exit(0);
    } catch (err) {
        console.error('ERROR during setup:', err.message);
        console.error('\nTips:');
        console.error('1. Ensure PostgreSQL is running.');
        console.error('2. Check DB_PASSWORD and other credentials in .env');
        console.error('3. Ensure the database "luxe_blockchain" exists.');
        process.exit(1);
    }
};

setupDatabase();

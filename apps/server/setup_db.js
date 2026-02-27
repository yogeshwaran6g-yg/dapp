import pool from './src/config/db.js';

const setupDatabase = async () => {
    try {
        console.log('--- Database Setup Started ---');

        // Create table
        console.log('Step 1: Creating "profile" table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS profile (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100),
                email VARCHAR(255) UNIQUE,
                phone_number VARCHAR(20),
                dob DATE,
                city VARCHAR(100),
                country VARCHAR(100),
                wallet_address VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✓ Table "profile" ready.');

        // Seed initial data
        console.log('Step 2: Checking for initial data...');
        const res = await pool.query('SELECT COUNT(*) FROM profile');
        if (parseInt(res.rows[0].count) === 0) {
            console.log('Seeding initial profile data...');
            await pool.query(`
                INSERT INTO profile (username, email, phone_number, dob, city, country, wallet_address)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, ['Alex Rivera', 'alex@luxe.io', '+123456789', '1992-05-15', 'New York', 'USA', '0x71C...4e2']);
            console.log('✓ Initial profile seeded.');
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

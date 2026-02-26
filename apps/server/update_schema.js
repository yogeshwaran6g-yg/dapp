import pool from './src/config/db.js';

const updateSchema = async () => {
    try {
        console.log('Adding "nonce" column to "profile" table...');
        await pool.query('ALTER TABLE profile ADD COLUMN IF NOT EXISTS nonce VARCHAR(255);');
        console.log('✓ Column "nonce" added successfully.');
        process.exit(0);
    } catch (err) {
        console.error('ERROR during schema update:', err.message);
        process.exit(1);
    }
};

updateSchema();

import pool from './src/config/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDatabase = async () => {
    try {
        console.log('--- Database Setup Started ---');

        // Step 1: Create tables from db.sql
        console.log('Step 1: Creating tables from db.sql...');
        const sqlPath = path.join(__dirname, 'db.sql');
        const schemaSql = await fs.readFile(sqlPath, 'utf8');
        await pool.query(schemaSql);
        console.log('✓ Tables from db.sql checked/created.');
        console.log('--- Database Setup Successful ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during database setup:', err.message);
        process.exit(1);
    }
};

setupDatabase();

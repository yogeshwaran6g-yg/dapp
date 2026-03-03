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
        console.log('Step 1: Creating/Updating tables from db.sql...');
        const sqlPath = path.join(__dirname, 'db.sql');
        const schemaSql = await fs.readFile(sqlPath, 'utf8');
        await pool.query(schemaSql);
        console.log('✓ Schema applied successfully.');

        // Step 2: Seed initial users
        console.log('Step 2: Seeding initial users...');
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        if (parseInt(userCount.rows[0].count) === 0) {
            const adminWallet = '0xf39Fd6e51aad88F6F4ce6aB8827219c761116117'; // Sample Hardhat address
            const referralCode = 'REF-ADMIN-01';

            const result = await pool.query(`
                INSERT INTO users (wallet_address, nonce, referral_code, role)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `, [adminWallet.toLowerCase(), '123456', referralCode, 'ADMIN']);

            const adminId = result.rows[0].id;
            console.log(`✓ Admin user created with ID: ${adminId}`);

            // Step 3: Seed Profile for the admin
            console.log('Step 3: Seeding profile...');
            await pool.query(`
                INSERT INTO profile (user_id, username, email, phone_number, dob, city, country)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [adminId, 'Super Admin', 'admin@dapp.io', '+100000000', '1990-01-01', 'Web3 City', 'Digital Realm']);
            console.log('✓ Admin profile seeded.');
        } else {
            console.log('✓ Users already exist, skipping user/profile seed.');
        }

        // Step 4: Seed initial levels
        console.log('Step 4: Seeding levels...');
        const levelCount = await pool.query('SELECT COUNT(*) FROM levels');
        if (parseInt(levelCount.rows[0].count) === 0) {
            // Seed levels for existing users
            const users = await pool.query('SELECT id FROM users');
            for (const user of users.rows) {
                await pool.query(`
                    INSERT INTO levels (id, current_level_id, total_xp)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (id) DO NOTHING
                `, [user.id, 1, 0]);
            }
            console.log('✓ Levels seeded.');
        } else {
            console.log('✓ Levels already exist.');
        }

        // Step 5: Seed initial wallets
        console.log('Step 5: Seeding wallets...');
        const walletCount = await pool.query('SELECT COUNT(*) FROM user_wallets');
        if (parseInt(walletCount.rows[0].count) === 0) {
            const users = await pool.query('SELECT id FROM users');
            for (const user of users.rows) {
                await pool.query(`
                    INSERT INTO user_wallets (user_id, energy_balance, reward_token_balance, locked_balance)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (user_id) DO NOTHING
                `, [user.id, 1000.50, 500.25, 100.00]);
            }
            console.log('✓ Wallets seeded.');
        } else {
            console.log('✓ Wallets already exist.');
        }

        // Step 6: Seed initial NFTs
        console.log('Step 6: Seeding NFTs...');
        const nftCount = await pool.query('SELECT COUNT(*) FROM user_nfts');
        if (parseInt(nftCount.rows[0].count) === 0) {
            const users = await pool.query('SELECT id FROM users');
            for (const user of users.rows) {
                await pool.query(`
                    INSERT INTO user_nfts (user_id, contract_address, token_id, metadata_uri, is_staked)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT DO NOTHING
                `, [user.id, '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', '1', 'https://metadata.example/1', false]);
            }
            console.log('✓ NFTs seeded.');
        } else {
            console.log('✓ NFTs already exist.');
        }

        console.log('--- Database Setup Successful ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR during setup:', err.message);
        console.error('\nTips:');
        console.error('1. Ensure PostgreSQL is running.');
        console.error('2. Check DB_PASSWORD and other credentials in .env');
        process.exit(1);
    }
};

setupDatabase();

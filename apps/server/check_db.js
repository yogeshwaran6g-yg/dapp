import { queryRunner } from './src/config/db.js';

async function checkDB() {
    try {
        const usersCount = await queryRunner('SELECT COUNT(*) as count FROM users');
        const swapsCount = await queryRunner('SELECT COUNT(*) as count FROM swap_history');
        const treasuryCount = await queryRunner('SELECT COUNT(*) as count FROM treasury_logs');
        const users = await queryRunner('SELECT id, wallet_address FROM users LIMIT 5');
        const swaps = await queryRunner('SELECT * FROM swap_history LIMIT 5');
        const treasury = await queryRunner('SELECT * FROM treasury_logs LIMIT 5');

        console.log('--- DB Check ---');
        console.log('Total Users:', usersCount[0].count);
        console.log('Total Swaps:', swapsCount[0].count);
        console.log('Total Treasury Logs:', treasuryCount[0].count);

        console.log('Sample Users:', JSON.stringify(users, null, 2));
        console.log('Sample Swaps:', JSON.stringify(swaps, null, 2));
        console.log('Sample Treasury:', JSON.stringify(treasury, null, 2));
        console.log('----------------');
    } catch (err) {
        console.error('DB Check Error:', err.message);
    } finally {
        process.exit();
    }
}

checkDB();

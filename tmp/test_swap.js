import { queryRunner } from '../apps/server/src/config/db.js';
import * as swapService from '../apps/server/src/services/swapService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../apps/server/.env') });

async function runTests() {
    console.log("🚀 Starting Token Swap Verification...");

    try {
        // 1. Get a test user
        const userRes = await queryRunner('SELECT id, wallet_address FROM users LIMIT 1');
        if (userRes.length === 0) {
            console.error("❌ No users found in database. Please run setup_db.js first.");
            return;
        }
        const userId = userRes[0].id;
        console.log(`👤 Using User ID: ${userId} (${userRes[0].wallet_address})`);

        // 2. Set initial balances
        console.log("💰 Setting initial balances: USDT=100, OWN=1000, ENERGY=500");
        await queryRunner(
            `INSERT INTO user_wallets (user_id, usdt_balance, own_token_balance, energy_balance)
             VALUES ($1, 100, 1000, 500)
             ON CONFLICT (user_id) DO UPDATE SET 
             usdt_balance = 100, own_token_balance = 1000, energy_balance = 500`,
            [userId]
        );

        // 3. Test USDT to OWN (1 USDT = 10 OWN)
        console.log("\n🧪 Testing USDT to OWN (10 USDT)...");
        const swap1 = await swapService.executeSwap(userId, 'USDT', 'OWN', 10);
        console.log(swap1.message, swap1.data);

        // 4. Test USDT to ENERGY (1 USDT = 20 ENERGY)
        console.log("\n🧪 Testing USDT to ENERGY (10 USDT)...");
        const swap2 = await swapService.executeSwap(userId, 'USDT', 'ENERGY', 10);
        console.log(swap2.message, swap2.data);

        // 5. Test OWN to USDT (1 OWN = 0.09 USDT)
        console.log("\n🧪 Testing OWN to USDT (100 OWN)...");
        const swap3 = await swapService.executeSwap(userId, 'OWN', 'USDT', 100);
        console.log(swap3.message, swap3.data);

        // 6. Test OWN to ENERGY (1 OWN = 1.8 ENERGY)
        console.log("\n🧪 Testing OWN to ENERGY (100 OWN)...");
        const swap4 = await swapService.executeSwap(userId, 'OWN', 'ENERGY', 100);
        console.log(swap4.message, swap4.data);

        // 7. Verify final balances
        const finalBalances = await queryRunner('SELECT usdt_balance, own_token_balance, energy_balance FROM user_wallets WHERE user_id = $1', [userId]);
        console.log("\n📊 Final Balances:", finalBalances[0]);

        // 8. Verify history
        const historyRes = await swapService.getUserSwapHistory(userId, 5);
        if (historyRes.status === 200) {
            console.log("\n📜 Recent Swap History (limit 5):");
            console.table(historyRes.data.map(h => ({
                type: h.swap_type,
                from: h.from_amount + ' ' + h.from_token,
                to: h.to_amount + ' ' + h.to_token,
                rate: h.rate
            })));
        } else {
            console.error("❌ Error fetching history:", historyRes.message);
        }

        console.log("\n✅ Verification Complete!");

    } catch (err) {
        console.error("❌ Error during verification:", err);
    }
}

runTests();

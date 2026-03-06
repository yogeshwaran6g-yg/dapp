import { distributeIncome } from '../services/incomeService.js';
import { updateSlotActivation } from '../services/slotActivationService.js';
import * as db from '../config/db.js';

// Mock DB for logic verification
const originalQuery = db.queryRunner;
let queries = [];

db.queryRunner = async (sql, params) => {
    queries.push({ sql: sql.trim().replace(/\s+/g, ' '), params });

    // Mocking some returns
    if (sql.includes('SELECT referred_by')) return [{ referred_by: params[0] === 1 ? null : params[0] - 1 }];
    if (sql.includes('SELECT id FROM users')) return [{ id: params[0] }];
    if (sql.includes('SELECT wallet_address')) return [{ wallet_address: '0x123' }];
    if (sql.includes('SELECT energy_balance')) return [{ energy_balance: 0, own_token: 0 }];

    return [];
};

async function runTest() {
    console.log("--- Testing Slot Activation (40 USDT) for User 2 ---");
    console.log("(User 2 is referred by User 1, User 1 has no referrer)");

    await updateSlotActivation(2, { current_level_id: 2, tx_hash: 'MOCK_USDT_PAYMENT' });

    console.log("\n--- Verification of DB Queries ---");

    // Check Commission distribution
    const commissions = queries.filter(q => q.sql.includes('income_logs') && q.params.includes('COMMISSION'));
    console.log(`\nReferral Commissions Found: ${commissions.length}`);
    commissions.forEach(c => {
        console.log(`- To User ${c.params[0]}: $${c.params[2]} (L${c.params[3]})`);
    });

    // Check Energy Credit
    const energyCredits = queries.filter(q => q.params.includes('ENERGY_CREDIT'));
    console.log(`\nEnergy Credits Found: ${energyCredits.length}`);
    energyCredits.forEach(c => {
        console.log(`- To User ${c.params[0]}: ${c.params[1]} NRG (Level ${c.params[2]})`);
    });

    // Check System Funds (Overflow verification)
    const systemFunds = queries.filter(q => q.sql.includes('UPDATE system_funds'));
    console.log(`\nSystem Fund Updates Found: ${systemFunds.length}`);
    systemFunds.forEach(c => {
        console.log(`- Fund ${c.params[1]}: +$${c.params[0]}`);
    });

    // Clean up
    db.queryRunner = originalQuery;
}

runTest().catch(console.error);

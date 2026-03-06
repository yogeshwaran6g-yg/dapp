import { queryRunner } from '../config/db.js';

/**
 * Fetch unified transaction history for a user
 * @param {number} userId 
 * @returns {Promise<Array>}
 */
export const getUserTransactions = async (userId) => {
    try {
        // 1. Get Commissions and Energy Credits
        const incomeLogs = await queryRunner(`
            SELECT 
                'Income' as type,
                type as subtype,
                amount,
                created_at as date,
                id as hash, -- Using ID as a placeholder for hash in internal logs
                level
            FROM income_logs
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 50
        `, [userId]);

        // 2. Get Staking History
        const stakeHistory = await queryRunner(`
            SELECT 
                'Stake' as type,
                type as subtype,
                amount,
                created_at as date,
                tx_hash as hash,
                NULL as level
            FROM stake_history
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 50
        `, [userId]);

        // 3. Get Yield/Rewards (If any specific ones exist)
        // ... (Skipping for now as they might be covered by logs or handled differently)

        // Combine and Sort
        const combined = [...incomeLogs, ...stakeHistory]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 50);

        return combined;
    } catch (err) {
        console.error(`[TransactionService] Error: ${err.message}`);
        throw err;
    }
};

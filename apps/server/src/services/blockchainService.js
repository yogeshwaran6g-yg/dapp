import { queryRunner } from '../config/db.js';

/**
 * Service to interact with the blockchain (Now simulated with Database)
 */
export const getWalletBalance = async (address) => {
    try {
        const wallet_address = address.toLowerCase();

        // Fetch simulated balance from DB
        const userResult = await queryRunner(
            'SELECT fake_eth_balance FROM users WHERE wallet_address = $1',
            [wallet_address]
        );

        if (userResult.length === 0) {
            return 0;
        }

        const balance = parseFloat(userResult[0].fake_eth_balance || '0');
        console.log(`[BlockchainService] Simulated Balance for ${wallet_address}: ${balance} ETH`);

        return balance;
    } catch (err) {
        console.error(`[BlockchainService] Error fetching simulated balance for ${address}: ${err.message}`);
        return 0;
    }
};

/**
 * Calculate the eligible level based on balance
 * @param {number} balance In ETH
 * @returns {number} Level ID (1-6)
 */
export const calculateEligibleLevel = (balance) => {
    if (balance >= 1280) return 7;
    if (balance >= 640) return 6;
    if (balance >= 320) return 5;
    if (balance >= 160) return 4;
    if (balance >= 80) return 3;
    if (balance >= 40) return 2;
    return 1;
};

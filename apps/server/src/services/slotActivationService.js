import { queryRunner } from '../config/db.js';
import { serviceResponse } from '../utils/helper.js';
import { getWalletBalance, calculateEligibleLevel } from './blockchainService.js';
import { distributeIncome } from './incomeService.js';

const SLOT_PRICES = {
    1: 20,
    2: 40,
    3: 80,
    4: 160,
    5: 320,
    6: 640,
    7: 1280
};

/**
 * Fetch slot activation/levels for a user
 * @param {string|number} userId 
 * @returns {Promise<Object>}
 */
export const getSlotActivation = async (userId) => {
    try {
        const result = await queryRunner(
            'SELECT * FROM levels WHERE id = $1',
            [userId]
        );

        if (result.length === 0) {
            // If not found, create a default entry
            await queryRunner(
                'INSERT INTO levels (id, current_level_id) VALUES ($1, 1)',
                [userId]
            );
            return serviceResponse(true, 200, 'Default slot activation created', { current_level_id: 1 });
        }

        return serviceResponse(true, 200, 'Slot activation fetched successfully', result[0]);
    } catch (err) {
        console.error(`[SlotActivationService] Error in getSlotActivation: ${err.message}`);
        return serviceResponse(false, 500, 'Error fetching slot activation', null, err.message);
    }
};

/**
 * Update slot activation/level for a user
 * @param {string|number} userId 
 * @param {number} currentLevelId 
 * @returns {Promise<Object>}
 */
export const updateSlotActivation = async (userId, currentLevelId) => {
    try {
        const price = SLOT_PRICES[currentLevelId];
        if (!price) {
            return serviceResponse(false, 400, 'Invalid slot level');
        }

        // Fetch user data
        const userResult = await queryRunner('SELECT wallet_address, fake_eth_balance FROM users WHERE id = $1', [userId]);
        if (userResult.length === 0) {
            return serviceResponse(false, 404, 'User not found');
        }
        const user = userResult[0];

        // 1. Balance Check
        if (parseFloat(user.fake_eth_balance) < price) {
            return serviceResponse(false, 403, `Insufficient Balance! You need $${price} for this slot. (Current: $${user.fake_eth_balance})`);
        }

        // 2. Execution & Distribution
        // Deduct price
        await queryRunner(
            'UPDATE users SET fake_eth_balance = fake_eth_balance - $1 WHERE id = $2',
            [price, userId]
        );

        // Distribute income
        await distributeIncome(userId, price);

        // Upgrade level
        await queryRunner(
            'UPDATE levels SET current_level_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [currentLevelId, userId]
        );

        // 3. Automate Energy Token Activation (As per spec)
        // Ensure wallet exists and increase energy balance slightly or set active status
        await queryRunner(`
            INSERT INTO user_wallets (user_id, energy_balance) 
            VALUES ($1, 100) 
            ON CONFLICT (user_id) DO UPDATE SET 
                energy_balance = user_wallets.energy_balance + 100,
                updated_at = CURRENT_TIMESTAMP
        `, [userId]);

        return serviceResponse(true, 200, `Slot Level ${currentLevelId} activated! Energy Token is now ACTIVE.`);
    } catch (err) {
        console.error(`[SlotActivationService] Error in updateSlotActivation: ${err.message}`);
        return serviceResponse(false, 500, 'Error updating slot activation', null, err.message);
    }
};

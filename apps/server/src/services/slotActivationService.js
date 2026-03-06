import { queryRunner } from '../config/db.js';
import { serviceResponse } from '../utils/helper.js';
import { ACTIVE_CONFIG } from '../config/constants.js';
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


export const updateSlotActivation = async (userId, { current_level_id: currentLevelId, tx_hash: txHash, payment_type: paymentType = 'USDT' }) => {
    try {
        const price = SLOT_PRICES[currentLevelId];
        if (!price) {
            return serviceResponse(false, 400, 'Invalid slot level');
        }

        // Fetch user data
        const userResult = await queryRunner('SELECT wallet_address FROM users WHERE id = $1', [userId]);
        if (userResult.length === 0) {
            return serviceResponse(false, 404, 'User not found');
        }
        const user = userResult[0];

        // 1. Payment Verification / Balance Check
        if (paymentType === 'OWN_TOKEN') {
            const walletRes = await queryRunner('SELECT own_token FROM user_wallets WHERE user_id = $1', [userId]);
            const ownTokenBalance = parseFloat(walletRes[0]?.own_token || '0');

            if (ownTokenBalance < price) {
                return serviceResponse(false, 403, `Insufficient Internal Token Balance! You need ${price} tokens for this slot. (Current: ${ownTokenBalance})`);
            }

            // Deduct balance
            await queryRunner(
                'UPDATE user_wallets SET own_token = own_token - $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
                [price, userId]
            );
            console.log(`[SlotActivationService] Activation via Internal Token. Deducting ${price} from user ${userId}`);
        } else {
            // Default USDT Payment
            if (txHash === 'MOCK_USDT_PAYMENT') {
                console.log(`[SlotActivationService] Activation via MOCK USDT PAYMENT for demo purposes. User: ${userId}`);
            } else if (!txHash) {
                const balances = await getWalletBalance(user.wallet_address);
                const usdtBalance = parseFloat(balances.usdtBalance || '0');

                if (usdtBalance < price) {
                    return serviceResponse(false, 403, `Insufficient USDT Balance! You need $${price} USDT for this slot. (Current: $${usdtBalance})`);
                }
            } else {
                console.log(`[SlotActivationService] Activation via USDT Received. Hash: ${txHash}`);
            }
        }

        // 2. Execution & Distribution
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
            VALUES ($1, $2) 
            ON CONFLICT (user_id) DO UPDATE SET 
                energy_balance = user_wallets.energy_balance + $2,
                updated_at = CURRENT_TIMESTAMP
        `, [userId, price]);

        return serviceResponse(true, 200, `Slot Level ${currentLevelId} activated! Energy Token is now ACTIVE.`);
    } catch (err) {
        console.error(`[SlotActivationService] Error in updateSlotActivation: ${err.message}`);
        return serviceResponse(false, 500, 'Error updating slot activation', null, err.message);
    }
};

/**
 * Returns the configured admin wallet/treasury address
 * @returns {Promise<Object>}
 */
export const getAdminWallet = async () => {
    try {
        return serviceResponse(true, 200, 'Admin wallet fetched successfully', { address: ACTIVE_CONFIG.ADMIN_WALLET });
    } catch (err) {
        return serviceResponse(false, 500, 'Error fetching admin wallet', null, err.message);
    }
};

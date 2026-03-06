import { queryRunner, transactionRunner } from '../config/db.js';
import { serviceResponse } from '../utils/helper.js';

/**
 * Exchange rates for each swap pair
 */
const SWAP_RATES = {
    USDT_TO_OWN: 10,       // 1 USDT = 10 OWN
    USDT_TO_ENERGY: 20,    // 1 USDT = 20 ENERGY
    OWN_TO_USDT: 0.09,     // 1 OWN = 0.09 USDT
    OWN_TO_ENERGY: 1.8,    // 1 OWN = 1.8 ENERGY
};

/**
 * Pair configuration mapping swap_type to DB columns
 */
const SWAP_PAIRS = {
    USDT_TO_OWN: {
        fromColumn: 'usdt_balance',
        toColumn: 'own_token_balance',
        fromToken: 'USDT',
        toToken: 'OWN',
    },
    USDT_TO_ENERGY: {
        fromColumn: 'usdt_balance',
        toColumn: 'energy_balance',
        fromToken: 'USDT',
        toToken: 'ENERGY',
    },
    OWN_TO_USDT: {
        fromColumn: 'own_token_balance',
        toColumn: 'usdt_balance',
        fromToken: 'OWN',
        toToken: 'USDT',
    },
    OWN_TO_ENERGY: {
        fromColumn: 'own_token_balance',
        toColumn: 'energy_balance',
        fromToken: 'OWN',
        toToken: 'ENERGY',
    },
};

/**
 * Execute a token swap for a user
 * @param {number} userId
 * @param {string} swapType - one of USDT_TO_OWN, USDT_TO_ENERGY, OWN_TO_USDT, OWN_TO_ENERGY
 * @param {number} fromAmount - amount of the source token to swap
 * @returns {Promise<Object>}
 */
export const executeSwap = async (userId, swapType, fromAmount) => {
    try {
        const pair = SWAP_PAIRS[swapType];
        if (!pair) {
            return serviceResponse(false, 400, `Invalid swap type: ${swapType}`);
        }

        const rate = SWAP_RATES[swapType];
        if (!rate) {
            return serviceResponse(false, 400, `No rate configured for: ${swapType}`);
        }

        if (!fromAmount || isNaN(parseFloat(fromAmount)) || parseFloat(fromAmount) <= 0) {
            return serviceResponse(false, 400, 'Swap amount must be greater than 0');
        }

        const amount = parseFloat(fromAmount);
        const toAmount = parseFloat((amount * rate).toFixed(6));

        return await transactionRunner(async (client) => {
            // 1. Check balance
            const balanceRes = await client.query(
                `SELECT ${pair.fromColumn} FROM user_wallets WHERE user_id = $1 FOR UPDATE`,
                [userId]
            );

            if (balanceRes.rows.length === 0) {
                return serviceResponse(false, 400, 'Wallet not found. Please ensure your wallet is initialized.');
            }

            const currentBalance = parseFloat(balanceRes.rows[0][pair.fromColumn]);
            if (currentBalance < amount) {
                return serviceResponse(false, 400, `Insufficient ${pair.fromToken} balance. Available: ${currentBalance}, Required: ${amount}`);
            }

            // 2. Deduct from-token and credit to-token atomically
            await client.query(
                `UPDATE user_wallets 
                 SET ${pair.fromColumn} = ${pair.fromColumn} - $1,
                     ${pair.toColumn} = ${pair.toColumn} + $2,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE user_id = $3`,
                [amount, toAmount, userId]
            );

            // 3. Record the swap in the swaps table
            await client.query(
                `INSERT INTO swaps (user_id, swap_type, from_token, to_token, from_amount, to_amount, rate, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'COMPLETED')`,
                [userId, swapType, pair.fromToken, pair.toToken, amount, toAmount, rate]
            );

            return serviceResponse(true, 200, 'Swap executed successfully', {
                swapType,
                fromToken: pair.fromToken,
                toToken: pair.toToken,
                fromAmount: amount,
                toAmount,
                rate,
            });
        });
    } catch (err) {
        console.error(`[SwapService] Error in executeSwap: ${err.message}`);
        return serviceResponse(false, 500, 'Error executing swap', null, err.message);
    }
};

/**
 * Get swap history for a user
 * @param {number} userId
 * @returns {Promise<Object>}
 */
export const getSwapHistory = async (userId) => {
    try {
        const swaps = await queryRunner(
            `SELECT id, swap_type, from_token, to_token, from_amount, to_amount, rate, status, created_at
             FROM swaps WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
            [userId]
        );
        return serviceResponse(true, 200, 'Swap history fetched successfully', swaps);
    } catch (err) {
        console.error(`[SwapService] Error in getSwapHistory: ${err.message}`);
        return serviceResponse(false, 500, 'Error fetching swap history', null, err.message);
    }
};

/**
 * Get all swap rates
 * @returns {Object}
 */
export const getSwapRates = () => {
    return serviceResponse(true, 200, 'Swap rates fetched successfully', SWAP_RATES);
};

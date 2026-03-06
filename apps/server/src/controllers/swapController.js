import * as swapService from '../services/swapService.js';
import { rtnRes } from '../utils/helper.js';

/**
 * Execute a token swap
 * POST /api/v1/swap/execute
 * Body: { swapType: string, amount: number }
 */
export const executeSwap = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { swapType, amount } = req.body;

        if (!userId) {
            return rtnRes(res, 400, 'User ID not found in session');
        }

        if (!swapType) {
            return rtnRes(res, 400, 'Swap type is required');
        }

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return rtnRes(res, 400, 'Valid swap amount is required');
        }

        const result = await swapService.executeSwap(userId, swapType, parseFloat(amount));
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error('Error from executeSwap controller:', err);
        return rtnRes(res, 500, 'Internal Error executing swap');
    }
};

/**
 * Get swap history for the authenticated user
 * GET /api/v1/swap/history
 */
export const getSwapHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return rtnRes(res, 400, 'User ID not found in session');
        }

        const result = await swapService.getSwapHistory(userId);
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error('Error from getSwapHistory controller:', err);
        return rtnRes(res, 500, 'Internal Error fetching swap history');
    }
};

/**
 * Get swap rates
 * GET /api/v1/swap/rates
 */
export const getSwapRates = async (req, res) => {
    try {
        const result = swapService.getSwapRates();
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error('Error from getSwapRates controller:', err);
        return rtnRes(res, 500, 'Internal Error fetching swap rates');
    }
};

import * as blockchainService from '../services/blockchainService.js';
import * as walletService from '../services/walletService.js';
import { rtnRes } from '../utils/helper.js';

/**
 * Get the real on-chain balance for the authenticated user
 * @param {Object} req 
 * @param {Object} res 
 */
export const getWalletBalance = async (req, res) => {
    try {
        // req.user is populated by authMiddleware
        const address = req.user?.wallet_address;

        if (!address) {
            return rtnRes(res, 400, "Wallet address not found in user session");
        }

        const balances = await blockchainService.getWalletBalance(address);

        return rtnRes(res, 200, "Wallet balance fetched successfully", {
            address,
            ethBalance: balances.ethBalance,
            usdtBalance: balances.usdtBalance
        });
    } catch (err) {
        console.error("Error from getWalletBalance controller:", err);
        return rtnRes(res, 500, "Internal Error fetching balance");
    }
};

/**
 * Add test ETH to the user's simulated account (Faucet)
 * @param {Object} req 
 * @param {Object} res 
 */
export const getTestEth = async (req, res) => {
    try {
        // Faucet logic for fake balance removed per user request
        return rtnRes(res, 200, "The internal faucet is currently disabled. Please use an official Polygon Amoy faucet for testnet POL/USDT.");
    } catch (err) {
        console.error("Error from getTestEth controller:", err);
        return rtnRes(res, 500, "Internal Error in faucet");
    }
};

/**
 * Record a successful on-chain staking transaction
 * @param {Object} req 
 * @param {Object} res 
 */
export const recordStake = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { amount, txHash } = req.body;

        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        if (!amount || !txHash) {
            return rtnRes(res, 400, "Amount and Transaction Hash are required");
        }

        const result = await walletService.recordStakingTransaction(userId, amount, txHash);

        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from recordStake controller:", err);
        return rtnRes(res, 500, "Internal Error recording stake");
    }
};

/**
 * Stake internal tokens
 * @param {Object} req 
 * @param {Object} res 
 */
export const stakeInternal = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { amount } = req.body;

        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return rtnRes(res, 400, "Valid stake amount is required");
        }

        const result = await walletService.stakeInternalToken(userId, parseFloat(amount));

        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from stakeInternal controller:", err);
        return rtnRes(res, 500, "Internal Error staking tokens");
    }
};

/**
 * Get internal wallet balances (energy, rewards, staked)
 * @param {Object} req 
 * @param {Object} res 
 */
export const getWalletInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        const result = await walletService.getWalletInfo(userId);
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from getWalletInfo controller:", err);
        return rtnRes(res, 500, "Internal Error fetching wallet info");
    }
};

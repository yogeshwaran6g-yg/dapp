import * as blockchainService from '../services/blockchainService.js';
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

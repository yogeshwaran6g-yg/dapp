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

        const ethBalance = await blockchainService.getWalletBalance(address);

        return rtnRes(res, 200, "Wallet balance fetched successfully", {
            address,
            ethBalance: ethBalance.toString()
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
        const { queryRunner } = await import('../config/db.js');
        const userId = req.user?.id;
        const { amount: bodyAmount } = req.body;
        const amount = parseFloat(bodyAmount) || 5.0; // Use body amount or default to 5.0

        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        if (isNaN(amount) || amount <= 0) {
            return rtnRes(res, 400, "Invalid amount provided");
        }

        await queryRunner(
            'UPDATE users SET fake_eth_balance = fake_eth_balance + $1 WHERE id = $2',
            [amount, userId]
        );

        return rtnRes(res, 200, `Successfully added $${amount} Test ETH to your account!`);
    } catch (err) {
        console.error("Error from getTestEth controller:", err);
        return rtnRes(res, 500, "Internal Error in faucet");
    }
};

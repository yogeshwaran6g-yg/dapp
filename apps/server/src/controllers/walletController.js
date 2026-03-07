import * as blockchainService from '../services/blockchainService.js';
import * as walletService from '../services/walletService.js';
import * as transactionService from '../services/transactionService.js';
import { rtnRes } from '../utils/helper.js';


export const getWalletBalance = async (req, res) => {
    try {
        const address = req.user?.wallet_address;

        if (!address) {
            return rtnRes(res, 400, "Wallet address not found in user session");
        }

        const balances = await blockchainService.getWalletBalance(address);
        const internalInfo = await walletService.getWalletInfo(req.user.id);

        const responseData = {
            address,
            bnbBalance: balances.bnbBalance,
            usdtBalance: balances.usdtBalance,
            own_token: internalInfo.data?.own_token || 0,
            energyBalance: internalInfo.data?.energy_balance || 0,
            lockedBalance: internalInfo.data?.locked_balance || 0
        };

        return rtnRes(res, 200, "Wallet balance fetched successfully", responseData);
    } catch (err) {
        console.error("Error from getWalletBalance controller:", err);
        return rtnRes(res, 500, "Internal Error fetching balance");
    }
};


export const getFaucet = async (req, res) => {
    try {
        return rtnRes(res, 200, "The internal faucet is currently disabled. Please use an official BNB Smart Chain faucet for testnet BNB/USDT.");
    } catch (err) {
        console.error("Error from getFaucet controller:", err);
        return rtnRes(res, 500, "Internal Error in faucet");
    }
};


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


export const claimRewards = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { amount } = req.body;

        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        if (!amount || isNaN(parseFloat(amount))) {
            return rtnRes(res, 400, "Valid reward amount is required");
        }

        const result = await walletService.claimRewards(userId, parseFloat(amount));
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from claimRewards controller:", err);
        return rtnRes(res, 500, "Internal Error claiming rewards");
    }
};


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


export const getStakeHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        const result = await walletService.getStakeHistory(userId);
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from getStakeHistory controller:", err);
        return rtnRes(res, 500, "Internal Error fetching stake history");
    }
};


export const topUpInternal = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { amount } = req.body;

        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        const topUpAmount = parseFloat(amount || 1000);
        const result = await walletService.topUpInternalToken(userId, topUpAmount);
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from topUpInternal controller:", err);
        return rtnRes(res, 500, "Internal Error topping up tokens");
    }
};


export const updateBalance = async (req, res) => {
    // ... (existing updateBalance implementation)
    try {
        const userId = req.user?.id;
        const { type, amount } = req.body;

        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        if (!type || !['NRG', 'DB'].includes(type.toUpperCase())) {
            return rtnRes(res, 400, "Valid token type (NRG or DB) is required");
        }

        const newAmount = parseFloat(amount);
        if (isNaN(newAmount) || newAmount < 0) {
            return rtnRes(res, 400, "Valid non-negative amount is required");
        }

        const result = await walletService.updateWalletBalance(userId, type.toUpperCase(), newAmount);
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from updateBalance controller:", err);
        return rtnRes(res, 500, "Internal Error updating balance");
    }
};

export const getTransactions = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return rtnRes(res, 400, "User ID not found in session");
        }

        const transactions = await transactionService.getUserTransactions(userId);
        return rtnRes(res, 200, "Transactions fetched successfully", transactions);
    } catch (err) {
        console.error("Error from getTransactions controller:", err);
        return rtnRes(res, 500, "Internal Error fetching transactions");
    }
};

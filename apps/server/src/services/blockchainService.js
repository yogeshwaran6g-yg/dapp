import { ethers } from 'ethers';

const RPC_URL = 'https://polygon-rpc.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

/**
 * Service to interact with the blockchain (Real on-chain balance)
 */
export const getWalletBalance = async (address) => {
    try {
        if (!address) return { ethBalance: '0.00', usdtBalance: '0.00' };

        const balanceWei = await provider.getBalance(wallet_address);
        const balance = parseFloat(ethers.formatEther(balanceWei));

        console.log(`[BlockchainService] Real Balance for ${wallet_address}: ${balance} POL`);

        console.log(`[BlockchainService] Final: ${ethBalance} POL, ${usdtBalance} USDT`);
        return { ethBalance, usdtBalance };
    } catch (err) {
        console.error(`[BlockchainService] Error fetching real balance for ${address}: ${err.message}`);
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

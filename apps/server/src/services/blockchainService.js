import { NETWORK_TYPE, ACTIVE_CONFIG } from '../config/constants.js';
import { ethers } from 'ethers';

/**
 * Service to interact with the blockchain
 */

const RPC_URLS = ACTIVE_CONFIG.RPC_URLS;

const TOKEN_ADDRESSES = {
    usdt: [ACTIVE_CONFIG.USDT_ADDRESS]
};

const MINIMAL_ERC20_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
];

// Initialize provider using multiple RPCs for fallbacks
let cachedProvider = null;
let lastProviderCheck = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getBestProvider = async () => {
    const now = Date.now();
    if (cachedProvider && (now - lastProviderCheck < CACHE_DURATION)) {
        return cachedProvider;
    }

    const urls = RPC_URLS;
    for (const url of urls) {
        try {
            const p = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: true });
            await p.getBlockNumber(); // Test connection
            console.log(`[BlockchainService] Using RPC: ${url}`);
            cachedProvider = p;
            lastProviderCheck = now;
            return p;
        } catch (e) {
            console.warn(`[BlockchainService] RPC failed: ${url}`);
        }
    }

    if (cachedProvider) return cachedProvider; // Fallback to old if all new fail
    throw new Error("All RPC endpoints failed");
};


export const getWalletBalance = async (address) => {
    try {
        if (!address) return { polBalance: '0.00', usdtBalance: '0.00' };

        const activeProvider = await getBestProvider();
        console.log(`[BlockchainService] Scanning balances for ${address} on ${NETWORK_TYPE}...`);

        // Native POL
        let polBalance = '0.00';
        try {
            const nativeBalance = await activeProvider.getBalance(address);
            polBalance = parseFloat(ethers.formatEther(nativeBalance)).toFixed(4);
        } catch (e) {
            console.error(`[BlockchainService] Native balance error: ${e.message}`);
        }

        // USDT - Scan multiple candidate addresses
        let usdtBalance = '0.00';
        const usdtAddresses = TOKEN_ADDRESSES.usdt;

        for (const usdtAddress of usdtAddresses) {
            try {
                if (!ethers.isAddress(usdtAddress)) continue;

                const usdtContract = new ethers.Contract(usdtAddress, MINIMAL_ERC20_ABI, activeProvider);

                const balancePromise = usdtContract.balanceOf(address);
                const decimalsPromise = usdtContract.decimals().catch(() => 6);

                const [balance, decimals] = await Promise.all([balancePromise, decimalsPromise]);

                if (balance > 0n) {
                    const formatted = parseFloat(ethers.formatUnits(balance, decimals)).toFixed(2);
                    if (parseFloat(formatted) > 0) {
                        usdtBalance = formatted;
                        console.log(`[BlockchainService] FOUND USDT: ${usdtBalance} at ${usdtAddress}`);
                        break;
                    }
                }
            } catch (tokenErr) {
                // Skip
            }
        }

        console.log(`[BlockchainService] Final: ${polBalance} POL, ${usdtBalance} USDT`);
        return { polBalance, usdtBalance };
    } catch (err) {
        console.error(`[BlockchainService] Error: ${err.message}`);
        return { polBalance: '0.00', usdtBalance: '0.00' };
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
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
        if (!address) return { bnbBalance: '0.00', usdtBalance: '0.00' };

        const activeProvider = await getBestProvider();
        console.log(`[BlockchainService] Scanning balances for ${address} on ${NETWORK_TYPE}...`);

        // Native BNB
        let bnbBalance = '0.00';
        try {
            const nativeBalance = await activeProvider.getBalance(address);
            bnbBalance = parseFloat(ethers.formatEther(nativeBalance)).toFixed(4);
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

        console.log(`[BlockchainService] Final: ${bnbBalance} BNB, ${usdtBalance} USDT`);
        return { bnbBalance, usdtBalance };
    } catch (err) {
        console.error(`[BlockchainService] Error: ${err.message}`);
        return { bnbBalance: '0.00', usdtBalance: '0.00' };
    }
};

/**
 * Calculate the eligible level based on balance
 * @param {number} balance In USDT
 * @returns {number} Level ID (1-7)
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

/**
 * Verify a transaction on-chain
 * @param {string} txHash 
 * @param {string} expectedUserAddress 
 * @param {number} expectedAmount 
 * @returns {Promise<boolean>}
 */
export const verifyTransaction = async (txHash, expectedUserAddress, expectedAmount) => {
    try {
        const activeProvider = await getBestProvider();
        console.log(`[BlockchainService] Verifying transaction: ${txHash}`);

        // Wait for at least 1 confirmation
        const receipt = await activeProvider.waitForTransaction(txHash, 1, 15000); // 15s timeout
        if (!receipt || receipt.status !== 1) return false;

        // Verify it was sent to the SlotActivation contract
        const contractAddress = ACTIVE_CONFIG.SLOT_ACTIVATION_ADDRESS.toLowerCase();
        if (receipt.to.toLowerCase() !== contractAddress) {
            console.warn(`[BlockchainService] Transaction target mismatch. Target: ${receipt.to}, Expected: ${contractAddress}`);
            return false;
        }

        // Verify the sender
        if (receipt.from.toLowerCase() !== expectedUserAddress.toLowerCase()) {
            console.warn(`[BlockchainService] Transaction sender mismatch. Sender: ${receipt.from}, Expected: ${expectedUserAddress}`);
            return false;
        }

        return true;
    } catch (err) {
        console.error(`[BlockchainService] Transaction verification failed: ${err.message}`);
        return false;
    }
};
import { NETWORK_TYPE } from '../config/constants.js';
import { ethers } from 'ethers';

/**
 * Service to interact with the blockchain
 */

const RPC_URLS = {
    mainnet: [
        'https://polygon-rpc.com',
        'https://polygon.llamarpc.com',
        'https://rpc.ankr.com/polygon'
    ],
    testnet: [
        'https://rpc-amoy.polygon.technology',
        'https://polygon-amoy-bor-rpc.publicnode.com',
        'https://1rpc.io/amoy',
        'https://polygon-amoy.drpc.org'
    ]
};

const TOKEN_ADDRESSES = {
    usdt: {
        mainnet: ['0xc2132D059Ac9E4cd988EEdC7C9E7978ABbCe48b0'],
        testnet: [
            '0xAB32EAed1B1c2afa890a354B6D7D8BA730AcA434', // Verified Amoy USDT
            '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582', // Standard Amoy PoS USDT
            '0xAcC1945e0f5Ce9DE2dc27112aeeF09f96F4f6867', // Standard Mock
            '0x1fdE0ECC61D4C092cc9CCB715C81eaD1C59842f1', // Mock USDT
            '0xF6243A3060879e5822269dBa912d357f6629A24a', // Common Mirror
            '0x522d64571A11756281734313B0E68868Aca0A34F',
            '0x4c9327f566CE856F0a12d56037db653c6FBcAF72'
        ]
    }
};

const MINIMAL_ERC20_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
];

// Initialize provider using multiple RPCs for fallbacks
const getBestProvider = async () => {
    const urls = RPC_URLS[NETWORK_TYPE] || RPC_URLS.testnet;
    for (const url of urls) {
        try {
            const p = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: true });
            await p.getBlockNumber(); // Test connection
            console.log(`[BlockchainService] Using RPC: ${url}`);
            return p;
        } catch (e) {
            console.warn(`[BlockchainService] RPC failed: ${url}`);
        }
    }
    throw new Error("All RPC endpoints failed");
};

/**
 * Fetch the real on-chain balance from the blockchain
 * @param {string} address - Wallet address
 * @returns {Promise<Object>} Balances object
 */
export const getWalletBalance = async (address) => {
    try {
        if (!address) return { ethBalance: '0.00', usdtBalance: '0.00' };

        const activeProvider = await getBestProvider();
        console.log(`[BlockchainService] Scanning balances for ${address} on ${NETWORK_TYPE}...`);

        // Native POL
        let ethBalance = '0.00';
        try {
            const nativeBalance = await activeProvider.getBalance(address);
            ethBalance = parseFloat(ethers.formatEther(nativeBalance)).toFixed(4);
        } catch (e) {
            console.error(`[BlockchainService] Native balance error: ${e.message}`);
        }

        // USDT - Scan multiple candidate addresses
        let usdtBalance = '0.00';
        const usdtAddresses = TOKEN_ADDRESSES.usdt[NETWORK_TYPE] || TOKEN_ADDRESSES.usdt.testnet;

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

        console.log(`[BlockchainService] Final: ${ethBalance} POL, ${usdtBalance} USDT`);
        return { ethBalance, usdtBalance };
    } catch (err) {
        console.error(`[BlockchainService] Error: ${err.message}`);
        return { ethBalance: '0.00', usdtBalance: '0.00' };
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

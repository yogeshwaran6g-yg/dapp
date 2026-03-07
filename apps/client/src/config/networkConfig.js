import { bsc, bscTestnet } from "wagmi/chains";

/**
 * Global Network Configuration
 * Centralizes RPC URLs, contract addresses, and network settings for Testnet and Mainnet.
 */

export const NETWORKS = {
    mainnet: {
        chain: bsc,
        additionalChains: [],
        usdtAddress: '0x55d398326f99059fF775485246999027B3197955', // USDT-BEP20
        adminWallet: '0x71C21BF1D394539659A722830fF4e2A0',
        rpcUrls: [
            'https://bsc-dataseed.binance.org/',
            'https://rpc.ankr.com/bsc',
            'https://binance.llamarpc.com'
        ]
    },
    testnet: {
        chain: bscTestnet,
        additionalChains: [],
        usdtAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', // BSC Testnet USDT
        slotActivationAddress: '0xd9145CCE52D386f254917e481eB44e9943F39138', // User needs to redeploy this on BSC
        adminWallet: '0xc5bbc1fdfc9c88d6253bbd072bf3b8252287faf0',
        rpcUrls: [
            'https://data-seed-prebsc-1-s1.binance.org:8545/',
            'https://bsc-testnet.publicnode.com',
            'https://data-seed-prebsc-2-s1.binance.org:8545/'
        ]
    }
};

export const getActiveNetwork = () => {
    const networkType = import.meta.env.VITE_NETWORK || 'testnet';
    return NETWORKS[networkType] || NETWORKS.testnet;
};

import { mainnet, polygon, arbitrum, polygonAmoy } from "wagmi/chains";

/**
 * Global Network Configuration
 * Centralizes RPC URLs, contract addresses, and network settings for Testnet and Mainnet.
 */

export const NETWORKS = {
    mainnet: {
        chain: polygon,
        additionalChains: [mainnet, arbitrum],
        usdtAddress: '0xc2132D059Ac9E4cd988EEdC7C9E7978ABbCe48b0',
        adminWallet: '0x71C21BF1D394539659A722830fF4e2A0', // Updated from constants.js
        rpcUrls: [
            'https://polygon-rpc.com',
            'https://polygon.llamarpc.com',
            'https://rpc.ankr.com/polygon'
        ]
    },
    testnet: {
        chain: polygonAmoy,
        additionalChains: [],
        usdtAddress: '0xAB32EAed1B1c2afa890a354B6D7D8BA730AcA434',
        adminWallet: '0xc5bbc1fdfc9c88d6253bbd072bf3b8252287faf0', // From server .env
        rpcUrls: [
            'https://rpc-amoy.polygon.technology',
            'https://polygon-amoy-bor-rpc.publicnode.com',
            'https://1rpc.io/amoy',
            'https://polygon-amoy.drpc.org'
        ]
    }
};

export const getActiveNetwork = () => {
    const networkType = import.meta.env.VITE_NETWORK || 'testnet';
    return NETWORKS[networkType] || NETWORKS.testnet;
};

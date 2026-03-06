import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { useAccount, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { getActiveNetwork } from '../config/networkConfig'


const projectId = import.meta.env.VITE_PROJECT_ID;

// 2. Create Wagmi Adapter
const activeNetwork = getActiveNetwork();
const networks = [activeNetwork.chain, ...activeNetwork.additionalChains];

const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks
})

// 3. Configure AppKit
createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata: {
        name: 'BMIN Token',
        description: 'BMIN Token - Institutional DeFi Platform',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: ['https://avatars.githubusercontent.com/u/17922993']
    },
    features: {
        analytics: true,
        email: false,
        socials: false,
        swaps: true
    },
    themeMode: 'dark',
    themeVariables: {
        '--w3m-accent': '#D4AF37',
        '--w3m-background-color': '#0b0b0f',
        '--w3m-font-family': "'Orbitron', sans-serif",
        '--w3m-border-radius-master': '12px',
        '--w3m-z-index': '9999',
        '--w3m-color-mix': '#D4AF37',
        '--w3m-color-mix-strength': 15
    },
    featuredWalletIds: ['c56bb33596c31666907a5d3b7fd72197']
})

const queryClient = new QueryClient()

export function Web3Provider({ children }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

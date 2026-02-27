import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, arbitrum } from "wagmi/chains";
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'


const projectId = '3a8170812b534d0ff9d794f19a901d64'

// 2. Create Wagmi Adapter
const networks = [mainnet, polygon, arbitrum]

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
        '--w3m-accent': '#d4af37',
        '--w3m-background-color': '#000000',
        '--w3m-border-radius-master': '0px',
        '--w3m-z-index': '9999'
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

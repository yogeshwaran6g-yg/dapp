import React from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useBalance } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Wallet, Loader2 } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'
import { useWalletBalance } from '../../hooks/useWallet'
import { API_ENDPOINTS } from '../../utils/endpoints'
import { useQueryClient } from '@tanstack/react-query'

export default function Navbar({ onConnectClick }) {
    const { address, isConnected } = useAccount()
    const queryClient = useQueryClient();
    const { data: walletData, isLoading: isBalanceLoading } = useWalletBalance()
    const { isAuthenticated } = useAuthContext();
    const [isOpen, setIsOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const [faucetAmount, setFaucetAmount] = React.useState('10')

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-black-pure/90 backdrop-blur-xl border-b border-gold/15 shadow-lg shadow-black/50'
                : 'bg-transparent border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-linear-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(198,163,79,0.25)]">
                            <span className="text-black font-black text-xl font-display">B</span>
                        </div>
                        <span className="text-white font-display font-bold text-2xl tracking-tighter">
                            BMIN<span className="text-gold">TOKEN</span>
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-1">
                            {['Home', 'Ecosystem', 'Roadmap', 'Whitepaper'].map((item, i) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="text-gray-300 hover:text-gold px-4 py-2 text-sm font-medium transition-colors duration-300 relative group"
                                >
                                    {item}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-6 transition-all duration-300" />
                                </motion.a>
                            ))}
                            <div className="flex flex-col items-end">
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 }}
                                    onClick={onConnectClick}
                                    className="ml-4 bg-transparent border border-gold/50 hover:border-gold hover:bg-gold/10 text-gold px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 text-sm"
                                >
                                    <Wallet size={16} />
                                    {isConnected
                                        ? (isAuthenticated ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Sign to Login')
                                        : 'Connect Wallet'}
                                </motion.button>
                                {isConnected && (
                                    <div className="flex items-center gap-3 px-6 mt-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Test Balance:</span>
                                            <span className="text-[11px] font-black text-white italic">
                                                {isBalanceLoading ? (
                                                    <Loader2 size={10} className="animate-spin" />
                                                ) : (
                                                    `$${walletData?.ethBalance || '0.00'}`
                                                )}
                                            </span>
                                        </div>
                                        {isAuthenticated && (
                                            <div className="flex items-center bg-white/5 border border-gold/30 rounded-lg overflow-hidden ml-2 transition-all hover:border-gold">
                                                <input
                                                    type="number"
                                                    value={faucetAmount}
                                                    onChange={(e) => setFaucetAmount(e.target.value)}
                                                    className="w-12 bg-transparent text-[10px] font-black text-white px-2 py-1 outline-none border-r border-gold/30"
                                                    placeholder="Amount"
                                                />
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try {
                                                            const { default: axios } = await import('../../services/axios');
                                                            await axios.post(API_ENDPOINTS.WALLET.FAUCET, { amount: parseFloat(faucetAmount) });
                                                            queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
                                                        } catch (e) {
                                                            console.error('Faucet error', e);
                                                        }
                                                    }}
                                                    className="px-2 py-1 text-[9px] font-black text-gold hover:bg-gold/10 transition-all uppercase"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-gold transition-colors p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black-soft/95 backdrop-blur-xl border-b border-gold/10 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {['Home', 'Ecosystem', 'Roadmap', 'Whitepaper'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-300 hover:text-gold block px-3 py-3 text-base font-medium transition-colors border-b border-white/5"
                                >
                                    {item}
                                </a>
                            ))}
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        onConnectClick();
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-center bg-gold/10 border border-gold/30 text-gold px-3 py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2"
                                >
                                    <Wallet size={18} />
                                    {isConnected
                                        ? (isAuthenticated ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Sign to Login')
                                        : 'Connect Wallet'}
                                </button>
                                {isConnected && (
                                    <div className="flex flex-col items-center gap-3 px-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Test Balance:</span>
                                            <span className="text-sm font-black text-white italic">
                                                {isBalanceLoading ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    `$${walletData?.ethBalance || '0.00'}`
                                                )}
                                            </span>
                                        </div>
                                        {isAuthenticated && (
                                            <div className="flex flex-col items-center gap-3 w-full">
                                                <div className="flex items-center bg-white/5 border border-gold/30 rounded-lg overflow-hidden w-full transition-all hover:border-gold">
                                                    <input
                                                        type="number"
                                                        value={faucetAmount}
                                                        onChange={(e) => setFaucetAmount(e.target.value)}
                                                        className="flex-1 bg-transparent text-sm font-black text-white px-4 py-3 outline-none border-r border-gold/30"
                                                        placeholder="Amount"
                                                    />
                                                    <button
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            try {
                                                                const { default: axios } = await import('../../services/axios');
                                                                await axios.post(API_ENDPOINTS.WALLET.FAUCET, { amount: parseFloat(faucetAmount) });
                                                                window.location.reload();
                                                            } catch (e) {
                                                                console.error('Faucet error', e);
                                                            }
                                                        }}
                                                        className="px-6 py-3 text-xs font-black text-gold hover:bg-gold/10 transition-all uppercase"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

import React from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { Menu, X, Wallet } from 'lucide-react'

export default function Navbar() {
    const { open } = useAppKit()
    const { address, isConnected } = useAccount()
    const [isOpen, setIsOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)

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
                        <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(198,163,79,0.25)]">
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
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 }}
                                onClick={() => open()}
                                className="ml-4 bg-transparent border border-gold/50 hover:border-gold hover:bg-gold/10 text-gold px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 text-sm"
                            >
                                <Wallet size={16} />
                                {isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
                            </motion.button>
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
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-black-soft/95 backdrop-blur-xl border-b border-gold/10"
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
                        <button
                            onClick={() => { open(); setIsOpen(false); }}
                            className="w-full text-center bg-gold/10 border border-gold/30 text-gold px-3 py-3 rounded-lg text-base font-semibold mt-3 flex items-center justify-center gap-2"
                        >
                            <Wallet size={18} />
                            {isConnected ? 'Disconnect' : 'Connect Wallet'}
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    )
}

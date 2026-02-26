import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Wallet } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import ConstellationBackground from './ConstellationBackground'
import SignupView from './SignupView'

export default function Hero() {
    const { open } = useAppKit()
    const { address, isConnected } = useAccount()
    const [isSignupViewOpen, setIsSignupViewOpen] = useState(false)

    const handleConnectClick = () => {
        if (isConnected) {
            open()
        } else {
            setIsSignupViewOpen(true)
        }
    }
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-32 sm:pt-40 overflow-hidden bg-black-pure">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src="/crypto-bg.png" alt="Crypto Background" className="w-full h-full object-cover opacity-60 object-center mix-blend-screen" />
                <div className="absolute inset-0 bg-linear-to-b from-black-pure/40 via-black-pure/60 to-black-pure" />
            </div>

            {/* Floating Coins */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Coin 1 - Top Left */}
                <motion.img
                    src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
                    alt="Bitcoin"
                    className="absolute w-24 h-24 lg:w-32 lg:h-32 opacity-20 filter blur-[2px]"
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{ top: '15%', left: '10%' }}
                />

                {/* Coin 2 - Bottom Right */}
                <motion.img
                    src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                    alt="Ethereum"
                    className="absolute w-32 h-32 lg:w-48 lg:h-48 opacity-15 filter blur-[3px]"
                    animate={{
                        y: [30, -30, 30],
                        x: [20, -20, 20],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{ bottom: '20%', right: '8%' }}
                />

                {/* Coin 3 - Top Right (smaller) */}
                <motion.img
                    src="https://cryptologos.cc/logos/solana-sol-logo.png"
                    alt="Solana"
                    className="absolute w-16 h-16 lg:w-20 lg:h-20 opacity-25 filter blur-[1px]"
                    animate={{
                        y: [-15, 15, -15],
                        x: [15, -15, 15],
                        rotate: [0, -180, -360],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{ top: '25%', right: '25%' }}
                />

                {/* Coin 4 - Middle Left (hidden on mobile) */}
                <motion.img
                    src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
                    alt="BNB"
                    className="hidden md:block absolute w-20 h-20 opacity-20 filter blur-[2px]"
                    animate={{
                        y: [25, -25, 25],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{ top: '50%', left: '20%' }}
                />
            </div>

            {/* Constellation Background */}
            <div className="absolute inset-0 z-0 w-full h-full mix-blend-screen opacity-60 pointer-events-none">
                <ConstellationBackground />
            </div>

            {/* Radial glow overlays */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-linear-to-t from-gold/10 via-gold/5 to-transparent blur-[80px]" />
            </div>

            {/* Bottom golden horizon glow */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-gold/8 via-gold/3 to-transparent pointer-events-none z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">


                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white mb-6 md:mb-8 tracking-tight leading-[1.05]"
                >
                    <span className="block">UNLEASH THE <span className="text-gold italic">BMIN</span></span>
                    <span className="block text-white">POWER OF <span className="text-gold">TOKEN</span></span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 leading-relaxed font-sans"
                >
                    BMIN Token is your gateway to the next generation of decentralized
                    infrastructure. Join the elite community of institutional-grade DeFi explorers.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-4 md:mt-6"
                >
                    <button
                        onClick={handleConnectClick}
                        className="group w-full sm:w-auto bg-gold hover:bg-gold-light text-black px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(198,163,79,0.3)] flex items-center justify-center gap-3"
                    >
                        <Wallet size={24} />
                        {isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
                        <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </motion.div>

                {/* Statistics Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {[
                        { label: 'Total Volume', value: '$2.4B+' },
                        { label: 'Community', value: '150K+' },
                        { label: 'Partners', value: '85+' },
                        { label: 'TVL Locked', value: '$840M' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 + i * 0.15, duration: 0.5 }}
                            className="text-center p-4 border-l border-gold/20 hover:border-gold/50 transition-colors"
                        >
                            <div className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight font-display">{stat.value}</div>
                            <div className="text-xs uppercase tracking-widest text-gold/60 font-semibold">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <SignupView
                isOpen={isSignupViewOpen}
                onClose={() => setIsSignupViewOpen(false)}
                onConnect={() => {
                    setIsSignupViewOpen(false);
                    open();
                }}
            />
        </section>
    )
}

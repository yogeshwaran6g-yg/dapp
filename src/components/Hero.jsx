import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import ConstellationBackground from './ConstellationBackground'

export default function Hero() {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black-pure">
            {/* Constellation Background */}
            <ConstellationBackground />

            {/* Radial glow overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-gradient-to-t from-gold/10 via-gold/5 to-transparent blur-[80px]" />
            </div>

            {/* Bottom golden horizon glow */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gold/8 via-gold/3 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gold/30 bg-gold/5 text-gold-light text-sm font-semibold backdrop-blur-md animate-float">
                        <Sparkles size={16} className="text-gold" />
                        BUILDING THE FUTURE OF WEB3
                    </div>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-white mb-8 tracking-tight leading-[1.05]"
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
                    className="flex flex-col sm:flex-row items-center justify-center gap-5"
                >
                    <button className="group w-full sm:w-auto bg-gold hover:bg-gold-light text-black px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(198,163,79,0.3)] flex items-center justify-center gap-2">
                        Launch App
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>
                    <button className="group w-full sm:w-auto bg-transparent border-2 border-gold/40 hover:border-gold text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-gold/5 flex items-center justify-center gap-2">
                        Explore Ecosystem
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
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
        </section>
    )
}

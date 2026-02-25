import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black-pure">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] animate-pulse" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 text-gold-light text-sm font-semibold mb-8 backdrop-blur-sm">
                        <Sparkles size={16} />
                        BUILDING THE FUTURE OF WEB3
                    </div>

                    <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tighter">
                        UNLEASH THE <span className="text-gold italic">BMIN</span><br />
                        <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_auto] animate-gradient text-transparent bg-clip-text">POWER OF TOKEN</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
                        BMIN Token is your gateway to the next generation of decentralized infrastructure. Join the elite community of institutional-grade DeFi explorers.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="w-full sm:w-auto bg-gold hover:bg-gold-light text-black px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                            Launch App
                            <ArrowRight size={20} />
                        </button>
                        <button className="w-full sm:w-auto bg-transparent border border-gray-700 hover:border-gold text-white px-10 py-4 rounded-full font-bold text-lg transition-all">
                            Explore Ecosystem
                        </button>
                    </div>
                </motion.div>

                {/* Statistics Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {[
                        { label: 'Total Volume', value: '$2.4B+' },
                        { label: 'Community', value: '150K+' },
                        { label: 'Partners', value: '85+' },
                        { label: 'TVL Locked', value: '$840M' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center p-4 border-l border-gold/20">
                            <div className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                            <div className="text-xs uppercase tracking-widest text-gold/60 font-semibold">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

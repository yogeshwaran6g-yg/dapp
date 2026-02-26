import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Globe, Zap, Database } from 'lucide-react'

const features = [
    {
        title: 'B-DEX Exchange',
        desc: 'Institutional liquidity for BMIN Token ecosystem with lightning-fast swaps.',
        icon: <Zap className="text-gold" size={24} />,
    },
    {
        title: 'BMIN Metaverse',
        desc: 'The next frontier of virtual commerce and interaction in Web3.',
        icon: <Globe className="text-gold" size={24} />,
    },
    {
        title: 'BMIN Security',
        desc: 'End-to-end encryption and multi-sig protection for your digital assets.',
        icon: <Shield className="text-gold" size={24} />,
    },
    {
        title: 'BMIN-Chain',
        desc: 'Proof-of-Stake infrastructure built for the BMIN economy at scale.',
        icon: <Database className="text-gold" size={24} />,
    }
]

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
    }
}

export default function Ecosystem() {
    return (
        <section id="ecosystem" className="py-28 bg-black-soft relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-gold font-bold tracking-[0.25em] text-sm mb-4 uppercase">Ecosystem</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">INTEGRATED WEB3 POWER</h3>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="p-8 rounded-2xl bg-black-elevated/50 border border-white/5 hover:border-gold/30 transition-all duration-500 backdrop-blur-sm group cursor-pointer"
                        >
                            <div className="bg-gold/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/20 group-hover:shadow-[0_0_20px_rgba(198,163,79,0.15)] transition-all duration-300">
                                {f.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3 font-display">{f.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Globe, Zap, Database } from 'lucide-react'

const features = [
    {
        title: 'B-DEX Exchange',
        desc: 'Institutional liquidity for BMIN Token ecosystem.',
        icon: <Zap className="text-gold" />,
        color: 'from-gold/20'
    },
    {
        title: 'BMIN Metaverse',
        desc: 'The next frontier of virtual commerce and interaction.',
        icon: <Globe className="text-gold" />,
        color: 'from-gold/20'
    },
    {
        title: 'BMIN Security',
        desc: 'End-to-end encryption for your digital assets.',
        icon: <Shield className="text-gold" />,
        color: 'from-gold/20'
    },
    {
        title: 'BMIN-Chain',
        desc: 'Proof-of-Stake infrastructure built for the BMIN economy.',
        icon: <Database className="text-gold" />,
        color: 'from-gold/20'
    }
]

export default function Ecosystem() {
    return (
        <section id="ecosystem" className="py-24 bg-black-soft relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-gold font-bold tracking-widest text-sm mb-4 uppercase">Ecosystem</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-bold text-white">INTEGRATED WEB3 POWER</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className={`p-8 rounded-3xl bg-black-elevated border border-white/5 hover:border-gold/30 transition-all duration-300 bg-gradient-to-br ${f.color} to-transparent`}
                        >
                            <div className="bg-black-soft w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                                {f.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{f.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

const roadmap = [
    {
        phase: 'Phase 1: Genesis',
        title: 'Platform Launch',
        items: ['B-DEX Mainnet Launch', 'Governance Token Deployment', 'Initial Liquidity Mining'],
        status: 'completed'
    },
    {
        phase: 'Phase 2: Expansion',
        title: 'Ecosystem Growth',
        items: ['NFT Bridge Integration', 'Mobile App Beta', 'Partnership Expansion'],
        status: 'in-progress'
    },
    {
        phase: 'Phase 3: Evolution',
        title: 'Institutional Layer',
        items: ['Cross-Chain Protocol', 'Staking v2.0', 'DAO Governance Activation'],
        status: 'upcoming'
    },
    {
        phase: 'Phase 4: Frontier',
        title: 'Metaverse Integration',
        items: ['BMIN Metaverse Launch', 'Virtual Asset Marketplace', 'Global Identity System'],
        status: 'upcoming'
    }
]

export default function Roadmap() {
    return (
        <section id="roadmap" className="py-28 bg-black-pure relative overflow-hidden">
            {/* Background subtle line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-gold font-bold tracking-[0.25em] text-sm mb-4 uppercase">Timeline</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">Roadmap to the Future</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roadmap.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="p-8 rounded-2xl bg-black-soft/50 border border-gold/10 hover:border-gold/30 transition-all duration-500 relative overflow-hidden group backdrop-blur-sm"
                        >
                            {/* Status glow for in-progress */}
                            {item.status === 'in-progress' && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                            )}
                            {item.status === 'completed' && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gold/40" />
                            )}

                            <div className="absolute top-0 right-0 p-4">
                                {item.status === 'completed' ? (
                                    <CheckCircle2 className="text-gold" size={20} />
                                ) : item.status === 'in-progress' ? (
                                    <Circle className="text-gold animate-pulse" size={20} />
                                ) : (
                                    <Circle className="text-gray-700" size={20} />
                                )}
                            </div>

                            <div className="text-xs font-bold text-gold/60 uppercase mb-4 tracking-[0.2em]">{item.phase}</div>
                            <h4 className="text-xl font-bold text-white mb-6 uppercase tracking-tight font-display">{item.title}</h4>

                            <ul className="space-y-4">
                                {item.items.map((line, j) => (
                                    <li key={j} className="text-gray-400 text-sm flex items-start gap-3 group-hover:text-gray-300 transition-colors">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold/40 mt-1.5 shrink-0 group-hover:bg-gold/70 transition-colors" />
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-center"
                >
                    <button className="bg-gold hover:bg-gold-light text-black px-10 py-3.5 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(198,163,79,0.15)] uppercase tracking-wider text-sm">
                        VIEW FULL WHITEPAPER
                    </button>
                </motion.div>
            </div>
        </section>
    )
}

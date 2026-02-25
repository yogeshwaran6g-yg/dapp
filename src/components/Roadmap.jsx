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
        <section id="roadmap" className="py-24 bg-black-pure relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-gold font-bold tracking-widest text-sm mb-4 uppercase">Timeline</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">Roadmap to the Future</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {roadmap.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-black-soft border border-gold/10 hover:border-gold/30 transition-all relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                {item.status === 'completed' ? (
                                    <CheckCircle2 className="text-gold" size={20} />
                                ) : item.status === 'in-progress' ? (
                                    <Circle className="text-gold animate-pulse" size={20} />
                                ) : (
                                    <Circle className="text-gray-700" size={20} />
                                )}
                            </div>

                            <div className="text-xs font-bold text-gold/60 uppercase mb-4 tracking-widest">{item.phase}</div>
                            <h4 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">{item.title}</h4>

                            <ul className="space-y-4">
                                {item.items.map((line, j) => (
                                    <li key={j} className="text-gray-400 text-sm flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold/40 mt-1.5 shrink-0" />
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <button className="bg-green-accent hover:bg-green-accent text-black px-10 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,255,136,0.1)]">
                        VIEW FULL WHITEPAPER
                    </button>
                </div>
            </div>
        </section>
    )
}

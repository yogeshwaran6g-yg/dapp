import React from 'react'
import { Github, Twitter, MessageCircle, Send } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-black-pure border-t border-gold/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                                <span className="text-black font-bold text-sm font-display">B</span>
                            </div>
                            <span className="text-white font-display font-bold text-xl uppercase tracking-tighter">
                                BMIN<span className="text-gold">TOKEN</span>
                            </span>
                        </div>
                        <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                            BMIN Token is a decentralized platform for Web3 enthusiasts. Join the BMIN community and explore the future of blockchain technology with institutional-grade tools.
                        </p>
                        <div className="flex space-x-4">
                            {[Twitter, Github, MessageCircle, Send].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-black-elevated border border-white/5 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold/30 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-4 text-gray-500 text-sm">
                            <li><a href="#" className="hover:text-gold transition-colors">Ecosystem</a></li>
                            <li><a href="#" className="hover:text-gold transition-colors">B-DEX</a></li>
                            <li><a href="#" className="hover:text-gold transition-colors">NFT Marketplace</a></li>
                            <li><a href="#" className="hover:text-gold transition-colors">BMIN Academy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-gray-500 text-sm">
                            <li><a href="#" className="hover:text-gold transition-colors">Whitepaper</a></li>
                            <li><a href="#" className="hover:text-gold transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-gold transition-colors">Brand Assets</a></li>
                            <li><a href="#" className="hover:text-gold transition-colors">Support</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:row items-center justify-between gap-4">
                    <p className="text-gray-600 text-xs">
                        © 2026 BMIN Token Ecosystem. All rights reserved. Built on Polygon.
                    </p>
                    <div className="flex space-x-6 text-gray-600 text-xs">
                        <a href="#" className="hover:text-gray-400">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-400">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

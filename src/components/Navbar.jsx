import React from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { Menu, X, Wallet } from 'lucide-react'

export default function Navbar() {
    const { open } = useAppKit()
    const { address, isConnected } = useAccount()
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <nav className="fixed w-full z-50 bg-black-pure/80 backdrop-blur-md border-b border-gold/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            <span className="text-black font-bold text-xl font-display">B</span>
                        </div>
                        <span className="text-white font-display font-bold text-2xl tracking-tighter">
                            BMIN<span className="text-gold">TOKEN</span>
                        </span>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-8">
                            {['Home', 'Ecosystem', 'Roadmap', 'Whitepaper'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-gray-300 hover:text-gold px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                            <button
                                onClick={() => open()}
                                className="bg-gold hover:bg-gold-light text-black px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 flex items-center gap-2"
                            >
                                <Wallet size={18} />
                                {isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
                            </button>
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-white"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-black-soft border-b border-gold/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['Home', 'Ecosystem', 'Roadmap', 'Whitepaper'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-gray-300 hover:text-gold block px-3 py-2 text-base font-medium"
                            >
                                {item}
                            </a>
                        ))}
                        <button
                            onClick={() => open()}
                            className="w-full text-left bg-gold text-black px-3 py-2 rounded-md text-base font-semibold mt-4"
                        >
                            {isConnected ? 'Disconnect' : 'Connect Wallet'}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

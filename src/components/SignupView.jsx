import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';

export default function SignupView({ isOpen, onClose, onConnect }) {
    const [agreed, setAgreed] = useState(false);

    // Reset state when modal opens or closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setAgreed(false);
            }, 300); // Wait for exit animation
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-3xl overflow-y-auto"
                >
                    <div className="w-full h-full min-h-screen grid grid-cols-1 lg:grid-cols-2 relative">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 md:top-6 md:right-6 z-50 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-md"
                        >
                            <X size={20} className="md:w-6 md:h-6" />
                        </button>

                        {/* Left Side: Image / Brand */}
                        <div className="hidden lg:block relative w-full h-full bg-zinc-900 overflow-hidden">
                            <img
                                src="/crypto-bg.png"
                                alt="Decentralized Finance Aesthetics"
                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-black/20 to-black/95" />

                            <div className="absolute bottom-12 left-8 md:bottom-16 md:left-12 lg:left-16 max-w-sm md:max-w-md">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-gold to-gold-dark rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-[0_0_30px_rgba(198,163,79,0.3)]">
                                        <span className="text-black font-black text-2xl md:text-3xl font-display">B</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 md:mb-4 leading-tight">
                                        The Future of <span className="text-gold">Institutional DeFi</span>
                                    </h2>
                                    <p className="text-gray-400 text-sm md:text-base lg:text-lg">
                                        Join the BMIN ecosystem and secure your position in the next generation of digital finance.
                                    </p>
                                </motion.div>
                            </div>
                        </div>

                        {/* Right Side: Dynamic Content */}
                        <div className="flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-10 lg:py-0 relative overflow-hidden">
                            {/* Mobile Logo Only */}
                            <div className="lg:hidden flex justify-center mb-8 md:mb-12">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-gold to-gold-dark rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(198,163,79,0.3)]">
                                    <span className="text-black font-black text-2xl md:text-3xl font-display">B</span>
                                </div>
                            </div>

                            <div className="w-full max-w-sm md:max-w-md mx-auto relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key="signup"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="mb-8 md:mb-10 text-center lg:text-left">
                                            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-2 md:mb-3 font-display tracking-tight">
                                                Create Account
                                            </h1>
                                            <p className="text-gray-400 text-sm md:text-base">
                                                Please agree to the terms to complete your registration.
                                            </p>
                                        </div>

                                        <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
                                            {/* Terms Checkbox */}
                                            <div className="flex items-start gap-3 md:gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setAgreed(!agreed)}
                                                    className={`mt-1 md:mt-0.5 shrink-0 w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center transition-all duration-200 ${agreed
                                                        ? 'bg-gold border-none shadow-[0_0_15px_rgba(198,163,79,0.4)]'
                                                        : 'bg-zinc-900 border border-white/20 hover:border-gold/50'
                                                        }`}
                                                >
                                                    <ShieldCheck
                                                        size={14}
                                                        className={`text-black transition-opacity duration-200 md:w-4 md:h-4 ${agreed ? 'opacity-100' : 'opacity-0'}`}
                                                    />
                                                </button>
                                                <div className="text-xs md:text-sm">
                                                    <label className="text-gray-400 cursor-pointer block leading-relaxed" onClick={() => setAgreed(!agreed)}>
                                                        I have read and agree to the{' '}
                                                        <span className="text-gold hover:text-gold-light transition-colors">Terms of Use</span>{' '}
                                                        and acknowledge the risks associated with decentralized networks.
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                onClick={onConnect}
                                                disabled={!agreed}
                                                className={`w-full group relative overflow-hidden rounded-xl py-3 px-5 md:py-4 md:px-6 flex items-center justify-center gap-2 md:gap-3 font-bold text-base md:text-lg transition-all duration-300 ${agreed
                                                    ? 'bg-linear-to-r from-gold to-[#e5c15e] text-black hover:opacity-95 hover:shadow-[0_0_30px_rgba(198,163,79,0.3)]'
                                                    : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                <span>Connect</span>
                                                <ArrowRight
                                                    size={18}
                                                    className={`transition-transform duration-300 md:w-5 md:h-5 ${agreed ? 'group-hover:translate-x-1' : ''}`}
                                                />
                                            </button>
                                        </form>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <p className="mt-8 text-center text-[10px] md:text-xs text-gray-500 font-medium absolute bottom-6 md:bottom-8 left-0 right-0 px-4">
                                By continuing, you naturally accept the wallet connection request.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

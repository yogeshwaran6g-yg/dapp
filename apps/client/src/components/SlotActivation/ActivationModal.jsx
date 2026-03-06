import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, ShieldCheck, AlertCircle } from 'lucide-react';

const ActivationModal = ({ isOpen, onClose, onConfirm, level, cost, usdtBalance, dbBalance, isPending }) => {
    const [selectedMethod, setSelectedMethod] = useState(null);

    const hasUsdt = parseFloat(usdtBalance || '0') >= cost;
    const hasDb = parseFloat(dbBalance || '0') >= cost;
    const canActivate = hasUsdt || hasDb;

    const handleConfirm = () => {
        if (selectedMethod) {
            onConfirm(selectedMethod);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-linear-to-b from-[#3d2b24] to-[#1a0f0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/5">
                            <div>
                                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
                                    Activate Level 0{level}
                                </h2>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">
                                    Secure your node infrastructure
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-8">
                            {/* Cost Info */}
                            <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/60 text-sm font-bold">Total Activation Cost</span>
                                    <span className="text-3xl font-display font-black text-gold tracking-tight">{cost}$</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className="text-green-500/60 text-[10px] font-black uppercase tracking-widest">Energy Reward</span>
                                    <span className="text-green-500 font-display font-black text-sm">+{cost} NRG</span>
                                </div>
                            </div>

                            {!canActivate ? (
                                <div className="space-y-4 text-center py-4 px-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <div className="flex justify-center text-red-500 mb-2">
                                        <AlertCircle size={48} />
                                    </div>
                                    <h3 className="text-red-500 font-bold uppercase tracking-widest text-sm">Insufficient Token</h3>
                                    <p className="text-white/60 text-xs leading-relaxed">
                                        You don't have enough funds in either wallet to activate this level.
                                        Please top up your USDT or internal OWN TOKEN balance.
                                    </p>
                                    <div className="flex flex-col gap-2 pt-2">
                                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                                            <span className="text-white/40">Required:</span>
                                            <span className="text-white">{cost} $ / OWN</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                                            <span className="text-white/40">USDT Wallet:</span>
                                            <span className="text-red-400">{usdtBalance} USDT</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                                            <span className="text-white/40">OWN Internal:</span>
                                            <span className="text-red-400">{dbBalance} OWN</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Select Payment Method</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* USDT Card */}
                                        <button
                                            disabled={!hasUsdt}
                                            onClick={() => setSelectedMethod('USDT')}
                                            className={`
                                                relative p-5 rounded-2xl border transition-all text-left flex flex-col gap-3 group
                                                ${!hasUsdt ? 'opacity-40 grayscale cursor-not-allowed border-white/5 bg-[#2a1a15]/20' :
                                                    selectedMethod === 'USDT' ? 'border-[#FF4500] bg-[#FF4500]/10 shadow-[0_0_20px_rgba(255,69,0,0.15)]' :
                                                        'border-white/10 bg-white/5 hover:border-white/20'}
                                            `}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className={`p-2 rounded-lg ${selectedMethod === 'USDT' ? 'bg-[#FF4500] text-white' : 'bg-white/10 text-white/40 group-hover:text-white'}`}>
                                                    <Wallet size={20} />
                                                </div>
                                                {selectedMethod === 'USDT' && (
                                                    <div className="text-[#FF4500]">
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-xs font-black text-white uppercase tracking-widest block">USDT Wallet</span>
                                                <span className={`${hasUsdt ? 'text-[#FF4500]' : 'text-red-500'} text-[10px] font-bold mt-0.5 block uppercase tracking-tight`}>
                                                    {hasUsdt ? `${usdtBalance} Available` : 'Insufficient Funds'}
                                                </span>
                                            </div>
                                        </button>

                                        {/* OWN Wallet Card */}
                                        <button
                                            disabled={!hasDb}
                                            onClick={() => setSelectedMethod('OWN_TOKEN')}
                                            className={`
                                                relative p-5 rounded-2xl border transition-all text-left flex flex-col gap-3 group
                                                ${!hasDb ? 'opacity-40 grayscale cursor-not-allowed border-white/5 bg-[#2a1a15]/20' :
                                                    selectedMethod === 'OWN_TOKEN' ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]' :
                                                        'border-white/10 bg-white/5 hover:border-white/20'}
                                            `}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className={`p-2 rounded-lg ${selectedMethod === 'OWN_TOKEN' ? 'bg-gold text-black' : 'bg-white/10 text-white/40 group-hover:text-white'}`}>
                                                    <ShieldCheck size={20} />
                                                </div>
                                                {selectedMethod === 'OWN_TOKEN' && (
                                                    <div className="text-gold">
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-xs font-black text-white uppercase tracking-widest block">OWN TOKEN</span>
                                                <span className={`${hasDb ? 'text-gold' : 'text-red-500'} text-[10px] font-bold mt-0.5 block uppercase tracking-tight`}>
                                                    {hasDb ? `${dbBalance} Available` : 'Insufficient Funds'}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-[#2a1a15]/10 border-t border-white/5 flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 px-6 rounded-2xl text-white/40 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                                disabled={isPending}
                            >
                                {canActivate ? 'Cancel' : 'Close'}
                            </button>
                            {canActivate && (
                                <button
                                    onClick={handleConfirm}
                                    disabled={!selectedMethod || isPending}
                                    className={`
                                        flex-1 py-4 px-6 rounded-2xl font-display font-black uppercase tracking-widest text-xs transition-all
                                        ${!selectedMethod || isPending ? 'bg-[#2a1a15] text-[#6d4b3b] cursor-not-allowed' : 'bg-linear-to-r from-gold via-[#f7d581] to-[#8a6d3b] text-black shadow-lg hover:scale-[1.02]'}
                                    `}
                                >
                                    {isPending ? 'Processing...' : 'Confirm Activation'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ActivationModal;

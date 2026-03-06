import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../../context/WalletContext';

const StatsCards = () => {
    const { stakedAmount, ownBalance, accumulatedRewards } = useWallet();
    const rewardRef = useRef(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Your Staked USDT */}
            <div className="glass-panel p-4 sm:p-6 rounded-xl border-l-4 border-l-accent-gold staking-gold-border-glow">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <span className="text-white/60 text-xs sm:text-sm font-medium">Your Staked Amount</span>
                    <span className="material-symbols-outlined text-accent-gold text-lg sm:text-xl">lock</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight">{stakedAmount.toFixed(2)} TOKENS</span>
                    <span className="text-green-400 text-[10px] sm:text-xs mt-1 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] sm:text-xs">trending_up</span> Active Staking
                    </span>
                </div>
            </div>

            {/* Available to Stake */}
            <div className="glass-panel p-4 sm:p-6 rounded-xl border-l-4 border-l-accent-gold/40">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <span className="text-white/60 text-xs sm:text-sm font-medium">Available Token</span>
                    <span className="material-symbols-outlined text-accent-gold/60 text-lg sm:text-xl">account_balance_wallet</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight">{ownBalance} TOKENS</span>
                    <span className="text-accent-gold text-[10px] sm:text-xs mt-1 font-bold">Ready to stake</span>
                </div>
            </div>

            {/* Live Rewards Counter */}
            <div className="glass-panel p-4 sm:p-6 rounded-xl border border-accent-gold/20 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-gold/10 blur-3xl rounded-full"></div>
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <span className="text-white/60 text-xs sm:text-sm font-medium">Accumulated Rewards</span>
                    <span className="material-symbols-outlined text-accent-gold animate-pulse text-lg sm:text-xl">stars</span>
                </div>
                <div className="flex flex-col">
                    <span
                        ref={rewardRef}
                        className="text-2xl sm:text-3xl font-black tracking-tight text-accent-gold staking-gold-glow font-mono"
                    >
                        {accumulatedRewards.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                    </span>
                    <span className="text-white/40 text-[10px] sm:text-xs mt-1 font-medium italic">Ticking live...</span>
                </div>
            </div>
        </div>
    );
};

export default StatsCards;

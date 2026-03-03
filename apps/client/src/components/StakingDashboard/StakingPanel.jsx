import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';

const StakingPanel = () => {
    const { usdtBalance, stakedAmount, stakeUSDT, unstakeUSDT, claimRewards, isLoading, accumulatedRewards } = useWallet();
    const [activeTab, setActiveTab] = useState('stake');
    const [stakeAmount, setStakeAmount] = useState('');

    const handleMaxClick = () => {
        if (activeTab === 'stake') {
            setStakeAmount(usdtBalance);
        } else {
            setStakeAmount(stakedAmount.toString());
        }
    };

    const handleAction = () => {
        if (activeTab === 'stake') {
            const success = stakeUSDT(stakeAmount);
            if (success) {
                setStakeAmount('');
            }
        } else {
            const success = unstakeUSDT(stakeAmount);
            if (success) {
                setStakeAmount('');
            }
        }
    };

    const handleClaim = () => {
        claimRewards();
    };

    return (
        <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Stake / Unstake Card */}
            <div className="glass-panel rounded-xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('stake')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'stake'
                            ? 'border-b-2 border-accent-gold text-accent-gold'
                            : 'text-white/40 hover:text-white'
                            }`}
                    >
                        Stake Tokens
                    </button>
                    <button
                        onClick={() => setActiveTab('unstake')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'unstake'
                            ? 'border-b-2 border-accent-gold text-accent-gold'
                            : 'text-white/40 hover:text-white'
                            }`}
                    >
                        Unstake Tokens
                    </button>
                </div>

                <div className="p-4 sm:p-8">
                    <div className="flex justify-between items-end mb-4">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                            {activeTab === 'stake' ? 'Amount to Stake' : 'Amount to Unstake'}
                        </label>
                        <span className="text-xs text-white/60">
                            Balance: <span className="text-white">{isLoading ? 'Loading...' : `${usdtBalance} USDT`}</span>
                        </span>
                    </div>
                    <div className="relative mb-8">
                        <input
                            className="w-full bg-primary/50 border border-white/10 rounded-lg px-5 py-4 text-2xl font-bold focus:outline-none focus:border-accent-gold/50 transition-all text-white"
                            placeholder="0.00"
                            type="number"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                        />
                        <button
                            onClick={handleMaxClick}
                            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-bold bg-accent-gold/10 text-accent-gold rounded-md border border-accent-gold/20 hover:bg-accent-gold/20 transition-colors"
                        >
                            MAX
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Estimated Weekly</p>
                            <p className="text-lg font-bold">1.2% USDT</p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Lock-up Period</p>
                            <p className="text-lg font-bold">Flexible</p>
                        </div>
                    </div>
                    <button
                        onClick={handleAction}
                        className="w-full py-4 staking-button-gold rounded-lg text-primary font-black uppercase tracking-widest shadow-lg"
                    >
                        {activeTab === 'stake' ? 'Stake Now' : 'Unstake Now'}
                    </button>
                </div>
            </div>

            {/* Rewards Claim Card */}
            <div className="glass-panel rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between border border-accent-gold/20 gap-4">
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl">payments</span>
                    </div>
                    <div>
                        <p className="text-white/50 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Ready to Claim</p>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                            {accumulatedRewards.toFixed(4)} <span className="text-accent-gold text-xs sm:text-sm ml-1">GOLD</span>
                        </h3>
                    </div>
                </div>
                <button
                    onClick={handleClaim}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white/5 border border-white/10 hover:bg-accent-gold/10 hover:border-accent-gold/40 transition-all rounded-lg text-sm font-bold text-white"
                >
                    Claim Rewards
                </button>
            </div>
        </div>
    );
};

export default StakingPanel;

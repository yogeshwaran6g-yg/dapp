import React, { useState, useEffect, useRef } from 'react';

const StakingDashboard = () => {
    const [activeTab, setActiveTab] = useState('stake');
    const [stakeAmount, setStakeAmount] = useState('');
    const [rewardCount, setRewardCount] = useState(1248.4219);
    const rewardRef = useRef(null);

    // Live ticking rewards counter
    useEffect(() => {
        const interval = setInterval(() => {
            setRewardCount(prev => {
                const increment = (Math.random() * 0.002 + 0.001);
                return parseFloat((prev + increment).toFixed(4));
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleMaxClick = () => {
        setStakeAmount('12450.00');
    };

    return (
        <div className="space-y-8">
            {/* Hero Title */}
            <div className="mb-2">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-1">Staking Dashboard</h2>
                <p className="text-white/50 text-xs sm:text-sm max-w-xl">
                    Maximize yield with institutional security and real-time distribution.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Value Locked */}
                <div className="glass-panel p-4 sm:p-6 rounded-xl border-l-4 border-l-accent-gold staking-gold-border-glow">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <span className="text-white/60 text-xs sm:text-sm font-medium">Total Value Locked</span>
                        <span className="material-symbols-outlined text-accent-gold text-lg sm:text-xl">lock_open</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl sm:text-3xl font-black tracking-tight">$42,890,124.00</span>
                        <span className="text-green-400 text-[10px] sm:text-xs mt-1 font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px] sm:text-xs">trending_up</span> +12.4% Monthly
                        </span>
                    </div>
                </div>

                {/* Daily ROI */}
                <div className="glass-panel p-4 sm:p-6 rounded-xl border-l-4 border-l-accent-gold/40">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <span className="text-white/60 text-xs sm:text-sm font-medium">Daily ROI %</span>
                        <span className="material-symbols-outlined text-accent-gold/60 text-lg sm:text-xl">monitoring</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl sm:text-3xl font-black tracking-tight">1.82%</span>
                        <span className="text-accent-gold text-[10px] sm:text-xs mt-1 font-bold">Estimated 664% APR</span>
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
                            {rewardCount.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                        </span>
                        <span className="text-white/40 text-[10px] sm:text-xs mt-1 font-medium italic">Ticking live...</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Staking Interaction Panel */}
                <div className="lg:col-span-7 flex flex-col gap-6">
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
                                    Balance: <span className="text-white">12,450.00 GOLD</span>
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
                                    <p className="text-lg font-bold">142.50 GOLD</p>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Lock-up Period</p>
                                    <p className="text-lg font-bold">Flexible</p>
                                </div>
                            </div>
                            <button className="w-full py-4 staking-button-gold rounded-lg text-primary font-black uppercase tracking-widest shadow-lg">
                                {activeTab === 'stake' ? 'Stake Now' : 'Unstake Now'}
                            </button>
                        </div>
                    </div>

                    {/* Rewards Card */}
                    <div className="glass-panel rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between border border-accent-gold/20 gap-4">
                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold flex-shrink-0">
                                <span className="material-symbols-outlined text-2xl sm:text-3xl">payments</span>
                            </div>
                            <div>
                                <p className="text-white/50 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Ready to Claim</p>
                                <h3 className="text-xl sm:text-2xl font-black text-white">
                                    $452.12 <span className="text-accent-gold text-xs sm:text-sm ml-1">GOLD</span>
                                </h3>
                            </div>
                        </div>
                        <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white/5 border border-white/10 hover:bg-accent-gold/10 hover:border-accent-gold/40 transition-all rounded-lg text-sm font-bold text-white">
                            Claim Rewards
                        </button>
                    </div>
                </div>

                {/* Right Sidebar: Info & History */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Yield Projection */}
                    <div className="glass-panel rounded-xl p-6">
                        <h4 className="font-black text-lg mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-accent-gold">analytics</span>
                            Yield Projection
                        </h4>
                        {/* Visual chart bars */}
                        <div className="h-32 w-full flex items-end gap-1.5 mb-6 px-2">
                            <div className="flex-1 bg-accent-gold/10 rounded-t-sm h-1/4 transition-all hover:bg-accent-gold/20"></div>
                            <div className="flex-1 bg-accent-gold/20 rounded-t-sm h-1/3 transition-all hover:bg-accent-gold/30"></div>
                            <div className="flex-1 bg-accent-gold/30 rounded-t-sm h-1/2 transition-all hover:bg-accent-gold/40"></div>
                            <div className="flex-1 bg-accent-gold/40 rounded-t-sm h-2/3 transition-all hover:bg-accent-gold/50"></div>
                            <div className="flex-1 bg-accent-gold/60 rounded-t-sm h-3/4 transition-all hover:bg-accent-gold/70"></div>
                            <div className="flex-1 bg-accent-gold/80 rounded-t-sm h-4/5 transition-all hover:bg-accent-gold/90"></div>
                            <div className="flex-1 bg-accent-gold rounded-t-sm h-full shadow-[0_0_10px_rgba(255,215,0,0.4)] transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/40">Total Staked</span>
                                <span className="font-bold">14,200.00 GOLD</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/40">Share of Pool</span>
                                <span className="font-bold">0.034%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/40">Total Earned</span>
                                <span className="font-bold text-accent-gold">2,410.15 GOLD</span>
                            </div>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-white/5 flex items-start gap-4">
                        <span className="material-symbols-outlined text-accent-gold p-2 bg-accent-gold/10 rounded-lg flex-shrink-0">verified_user</span>
                        <div>
                            <p className="font-bold text-sm mb-1">Audited Protocol</p>
                            <p className="text-xs text-white/40 leading-relaxed">
                                Smart contracts audited by CertiK and PeckShield. Funds are secured via multi-signature vault architecture.
                            </p>
                        </div>
                    </div>

                    {/* Mini Transaction History */}
                    <div className="glass-panel rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-black text-sm uppercase tracking-widest">Recent Activity</h4>
                            <button className="text-[10px] text-accent-gold font-bold hover:underline">VIEW ALL</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500">
                                        <span className="material-symbols-outlined text-sm">south_west</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Staked GOLD</p>
                                        <p className="text-[10px] text-white/30">2 hours ago</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold">+500.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-accent-gold/10 flex items-center justify-center text-accent-gold">
                                        <span className="material-symbols-outlined text-sm">celebration</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Claimed Reward</p>
                                        <p className="text-[10px] text-white/30">1 day ago</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-accent-gold">+12.45</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                                        <span className="material-symbols-outlined text-sm">north_east</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Unstaked GOLD</p>
                                        <p className="text-[10px] text-white/30">3 days ago</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-red-400">-200.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StakingDashboard;

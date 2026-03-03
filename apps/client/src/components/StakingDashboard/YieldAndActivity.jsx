import React from 'react';
import { useWallet } from '../../context/WalletContext';

const YieldAndActivity = () => {
    const { usdtBalance, stakedAmount } = useWallet();

    return (
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
                        <span className="text-white/40">Your Staked</span>
                        <span className="font-bold">{stakedAmount.toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Available to Stake</span>
                        <span className="font-bold">{usdtBalance} USDT</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Total Earned</span>
                        <span className="font-bold text-accent-gold">0.00 USDT</span>
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

            {/* Recent Activity */}
            <div className="glass-panel rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-black text-sm uppercase tracking-widest">Recent Activity</h4>
                    <button className="text-[10px] text-accent-gold font-bold hover:underline">VIEW ALL</button>
                </div>
                <div className="space-y-4">
                    {stakedAmount > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500">
                                    <span className="material-symbols-outlined text-sm">south_west</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Staked USDT</p>
                                    <p className="text-[10px] text-white/30">Just now</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold">+{stakedAmount.toFixed(2)}</span>
                        </div>
                    )}
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
                        <span className="text-sm font-bold text-accent-gold">+0.00</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YieldAndActivity;

import React from 'react';
import { useQuery } from '@tanstack/react-query';

const TreasuryMetrics = () => {
    const { data: metricsData, isLoading } = useQuery({
        queryKey: ['treasuryMetrics'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/treasury/metrics');
            if (!response.ok) throw new Error('Failed to fetch treasury metrics');
            const data = await response.json();
            return data.data;
        }
    });

    const metrics = metricsData || {
        total_balance: 0,
        eth_balance: 0,
        usdc_balance: 0,
        usdt_balance: 0
    };

    return (
        <>
            {/* Hero Metrics */}
            <div className="mb-2 lg:mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {/* Royalty Card */}
                    <div className="bg-card-dark border border-white/5 p-3 lg:p-4 rounded-xl hover:border-yellow-400/50 transition-all shadow-xl shadow-yellow-400/5 relative group">
                        <div className="absolute top-4 right-4 text-yellow-400 opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="material-symbols-outlined">content_copy</span>
                        </div>
                        <div className="flex flex-col gap-2 lg:gap-3">
                            <div className="size-7 lg:size-9 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                                <span className="material-symbols-outlined text-base lg:text-lg">payments</span>
                            </div>
                            <div>
                                <p className="text-[8px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Total Treasury</p>
                                <h3 className="text-lg lg:text-xl font-black tracking-tight text-white">
                                    ${parseFloat(metrics.total_balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                                <p className="text-[9px] lg:text-xs font-medium text-yellow-400">{parseFloat(metrics.eth_balance).toFixed(2)} ETH</p>
                            </div>
                        </div>
                    </div>
                    {/* USDC Fund */}
                    <div className="bg-card-dark border border-white/5 p-4 lg:p-6 rounded-xl hover:border-slate-400/50 transition-all group relative">
                        <div className="absolute top-4 right-4 text-slate-400 opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                        </div>
                        <div className="flex flex-col gap-2 lg:gap-3">
                            <div className="size-7 lg:size-9 rounded-lg bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
                                <span className="material-symbols-outlined text-base lg:text-lg">monetization_on</span>
                            </div>
                            <div>
                                <p className="text-[8px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">USDC Balance</p>
                                <h3 className="text-lg lg:text-xl font-black tracking-tight text-white">
                                    ${parseFloat(metrics.usdc_balance).toLocaleString()}
                                </h3>
                                <p className="text-[9px] lg:text-xs font-medium text-slate-400">Stable Reserves</p>
                            </div>
                        </div>
                    </div>
                    {/* USDT Fund */}
                    <div className="bg-card-dark border border-white/5 p-3 lg:p-4 rounded-xl hover:border-slate-400/50 transition-all group relative">
                        <div className="absolute top-3 right-3 text-slate-400 opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="material-symbols-outlined text-xs">content_copy</span>
                        </div>
                        <div className="flex flex-col gap-2 lg:gap-3">
                            <div className="size-7 lg:size-9 rounded-lg bg-green-400/10 border border-green-400/20 flex items-center justify-center text-green-400">
                                <span className="material-symbols-outlined text-base lg:text-lg">account_balance_wallet</span>
                            </div>
                            <div>
                                <p className="text-[8px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">USDT Balance</p>
                                <h3 className="text-lg lg:text-xl font-black tracking-tight text-white">
                                    ${parseFloat(metrics.usdt_balance).toLocaleString()}
                                </h3>
                                <p className="text-[9px] lg:text-xs font-medium text-slate-400">Operational Liquidity</p>
                            </div>
                        </div>
                    </div>
                    {/* Assets Count */}
                    <div className="bg-card-dark border border-white/5 p-3 lg:p-4 rounded-xl hover:border-slate-400/50 transition-all group relative">
                        <div className="flex flex-col gap-2 lg:gap-3">
                            <div className="size-7 lg:size-9 rounded-lg bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400">
                                <span className="material-symbols-outlined text-base lg:text-lg">token</span>
                            </div>
                            <div>
                                <p className="text-[8px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Active Assets</p>
                                <h3 className="text-lg lg:text-xl font-black tracking-tight text-white">3 Types</h3>
                                <p className="text-[9px] lg:text-xs font-medium text-slate-400">Multi-chain Ready</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Info Section */}
            <div className="mt-2 lg:mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
                <div className="lg:col-span-2 bg-card-dark border border-white/5 rounded-xl p-3 lg:p-4 shadow-2xl">
                    <h4 className="text-[9px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 lg:mb-4">Alloc Breakdown</h4>
                    <div className="flex items-end gap-1 h-14 lg:h-20 mb-3 lg:mb-4">
                        <div className="flex-1 bg-yellow-400/40 rounded-t h-[90%] group relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card-dark border border-yellow-400 px-2 py-1 rounded text-[10px] font-bold text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">ETH: 58%</div>
                        </div>
                        <div className="flex-1 bg-slate-400/40 rounded-t h-[65%] group relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card-dark border border-slate-400 px-2 py-1 rounded text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">USDC: 22%</div>
                        </div>
                        <div className="flex-1 bg-slate-500/30 rounded-t h-[45%] group relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card-dark border border-white/5 px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">USDT: 15%</div>
                        </div>
                        <div className="flex-1 bg-slate-600/10 rounded-t h-[15%] group relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card-dark border border-white/5 px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">Other: 5%</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 pt-3 lg:pt-4 border-t border-white/5">
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Ethereum</p>
                            <p className="text-xs font-bold text-white">${parseFloat(metrics.eth_balance * 2600).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">USDC</p>
                            <p className="text-xs font-bold text-white">${parseFloat(metrics.usdc_balance).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">USDT</p>
                            <p className="text-xs font-bold text-white">${parseFloat(metrics.usdt_balance).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Others</p>
                            <p className="text-xs font-bold text-white">$0.00</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card-dark border border-white/5 rounded-xl p-3 lg:p-4 shadow-2xl">
                    <h4 className="text-[9px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 lg:mb-4">Security & Multisig</h4>
                    <div className="space-y-2 lg:space-y-3">
                        <div className="flex items-center justify-between p-2 lg:p-2.5 bg-background-dark/50 rounded-lg border border-white/5">
                            <div className="flex items-center gap-2 lg:gap-3">
                                <span className="material-symbols-outlined text-yellow-400 text-base lg:text-lg">security</span>
                                <div>
                                    <p className="text-[10px] lg:text-xs font-bold text-white">Threshold</p>
                                    <p className="text-[8px] lg:text-[10px] text-slate-500 font-bold">3 of 5 Owners</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-green-500 text-xs lg:text-sm">verified</span>
                        </div>
                        <div className="flex items-center justify-between p-2 lg:p-2.5 bg-background-dark/50 rounded-lg border border-white/5">
                            <div className="flex items-center gap-2 lg:gap-3">
                                <span className="material-symbols-outlined text-slate-400 text-base lg:text-lg">history_edu</span>
                                <div>
                                    <p className="text-[10px] lg:text-xs font-bold text-white">Proposals</p>
                                    <p className="text-[8px] lg:text-[10px] text-slate-500 font-bold">2 active</p>
                                </div>
                            </div>
                            <div className="px-1.5 py-0.5 rounded bg-yellow-400 text-black text-[8px] lg:text-[9px] font-black tracking-tighter">2 NEW</div>
                        </div>
                        <button className="w-full py-2 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-colors mt-2">
                            Manage
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TreasuryMetrics;

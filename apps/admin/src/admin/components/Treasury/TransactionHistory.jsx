import React from 'react';

const TransactionHistory = () => {
    return (
        <div className="bg-card-dark border border-white/5 rounded-xl overflow-hidden shadow-2xl mt-4 lg:mt-8">
            <div className="p-3 lg:p-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 lg:gap-4">
                    <h3 className="text-sm lg:text-lg font-bold text-white tracking-tight">Logs</h3>
                    <div className="flex gap-0.5 lg:gap-1 bg-background-dark p-0.5 lg:p-1 rounded-lg border border-white/5">
                        <button className="px-2 lg:px-3 py-1 lg:py-1.5 text-[8px] lg:text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white rounded shadow-sm">All</button>
                        <button className="px-2 lg:px-3 py-1 lg:py-1.5 text-[8px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors">Inflows</button>
                        <button className="px-2 lg:px-3 py-1 lg:py-1.5 text-[8px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors">Outflows</button>
                    </div>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-xs lg:text-sm text-slate-500">search</span>
                    <input className="bg-background-dark border border-white/5 rounded-lg pl-8 lg:pl-9 pr-4 py-1.5 lg:py-2 text-[10px] lg:text-xs text-white focus:ring-1 focus:ring-yellow-400/50 outline-none w-48 lg:w-64 transition-all" placeholder="Tx Hash..." type="text" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-background-dark/50 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="px-4 lg:px-6 py-2.5 lg:py-4">Type</th>
                            <th className="px-4 lg:px-6 py-2.5 lg:py-4">Asset</th>
                            <th className="px-4 lg:px-6 py-2.5 lg:py-4">Amount</th>
                            <th className="px-4 lg:px-6 py-2.5 lg:py-4">Hash</th>
                            <th className="px-4 lg:px-6 py-2.5 lg:py-4 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {/* Tx Item 1 */}
                        <tr className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-4 lg:px-6 py-2 lg:py-3">
                                <div className="flex items-center gap-2">
                                    <div className="size-5 lg:size-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                        <span className="material-symbols-outlined text-[10px] lg:text-xs">south_west</span>
                                    </div>
                                    <span className="text-[9px] lg:text-[10px] font-bold text-white">Inflow</span>
                                </div>
                            </td>
                            <td className="px-4 lg:px-6 py-2 lg:py-3">
                                <div className="flex items-center gap-2 text-slate-200">
                                    <div className="size-4 lg:size-5 rounded-full bg-background-dark flex items-center justify-center overflow-hidden border border-white/5">
                                        <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-[8px] font-bold text-blue-400">Ξ</div>
                                    </div>
                                    <span className="text-[9px] lg:text-[10px] font-medium">ETH</span>
                                </div>
                            </td>
                            <td className="px-4 lg:px-6 py-2 lg:py-3">
                                <span className="text-[9px] lg:text-[10px] font-bold text-white tracking-tight">+12.50</span>
                                <p className="text-[7px] lg:text-[8px] text-slate-500 font-bold">$33,450</p>
                            </td>
                            <td className="px-4 lg:px-6 py-2 lg:py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] lg:text-[10px] font-mono text-slate-400 font-bold">0x8a9...3fc</span>
                                </div>
                            </td>
                            <td className="px-4 lg:px-6 py-2 lg:py-3 text-right">
                                <p className="text-[9px] lg:text-[10px] font-medium text-white">2m ago</p>
                            </td>
                        </tr>
                        {/* Tx Item 2 */}
                        <tr className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-4 lg:px-6 py-2 lg:py-3">
                                <div className="flex items-center gap-2">
                                    <div className="size-5 lg:size-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                        <span className="material-symbols-outlined text-[10px] lg:text-sm">north_east</span>
                                    </div>
                                    <span className="text-[9px] lg:text-[10px] font-bold text-white">Payout</span>
                                </div>
                            </td>
                            <td className="px-4 lg:px-6 py-2 lg:py-3">
                                <div className="flex items-center gap-2 text-slate-200">
                                    <div className="size-4 lg:size-5 rounded-full bg-background-dark flex items-center justify-center overflow-hidden border border-white/5">
                                        <div className="w-full h-full bg-green-500/20 flex items-center justify-center text-[8px] font-bold text-green-400">$</div>
                                    </div>
                                    <span className="text-[9px] lg:text-[10px] font-medium">USDC</span>
                                </div>
                            </td>
                            <td className="px-4 lg:px-6 py-2 lg:py-3">
                                <span className="text-[9px] lg:text-[10px] font-bold text-white tracking-tight">-5,000.00 USDC</span>
                                <p className="text-[7px] lg:text-[8px] text-slate-500 font-bold">$5,000.00</p>
                            </td>
                            <td className="px-4 lg:px-6 py-2 lg:py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] lg:text-[10px] font-mono text-slate-400 font-bold">0x14b9...f822</span>
                                    <span className="material-symbols-outlined text-xs text-slate-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">open_in_new</span>
                                </div>
                            </td>
                            <td className="px-4 lg:px-6 py-2 lg:py-3 text-right">
                                <p className="text-[9px] lg:text-[10px] font-medium text-white">15 mins ago</p>
                                <p className="text-[7px] lg:text-[8px] text-slate-500 font-bold">Oct 24, 2023 14:09:45</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="p-3 lg:p-4 bg-background-dark/30 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-widest">Showing 1-10 of 4,821 logs</span>
                <div className="flex gap-1 lg:gap-2">
                    <button className="w-7 h-7 lg:w-8 lg:h-8 rounded border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-xs lg:text-sm text-slate-500">chevron_left</span>
                    </button>
                    <button className="w-7 h-7 lg:w-8 lg:h-8 rounded border border-white/5 flex items-center justify-center bg-white/10 text-[10px] lg:text-xs font-bold text-white">1</button>
                    <button className="w-7 h-7 lg:w-8 lg:h-8 rounded border border-white/5 flex items-center justify-center text-[10px] lg:text-xs font-bold text-slate-400 hover:bg-white/5 transition-colors">2</button>
                    <button className="w-7 h-7 lg:w-8 lg:h-8 rounded border border-white/5 flex items-center justify-center text-[10px] lg:text-xs font-bold text-slate-400 hover:bg-white/5 transition-colors">3</button>
                    <button className="w-7 h-7 lg:w-8 lg:h-8 rounded border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-xs lg:text-sm text-slate-500">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;

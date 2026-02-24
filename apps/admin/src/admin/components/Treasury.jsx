import React from 'react';

const Treasury = () => {
    return (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {/* Hero Metrics */}
            <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Royalty Card */}
                    <div className="bg-card-dark border border-white/5 p-6 rounded-xl hover:border-yellow-400/50 transition-all shadow-xl shadow-yellow-400/5 relative group">
                        <div className="absolute top-4 right-4 text-yellow-400 opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="material-symbols-outlined">content_copy</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="w-10 h-10 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Royalty Wallet</p>
                                <h3 className="text-2xl font-black tracking-tight text-white">$1,200,500.45</h3>
                                <p className="text-sm font-medium text-yellow-400 mt-1">450.22 ETH</p>
                            </div>
                        </div>
                    </div>
                    {/* Dev Fund */}
                    <div className="bg-card-dark border border-white/5 p-6 rounded-xl hover:border-slate-400/50 transition-all group relative">
                        <div className="absolute top-4 right-4 text-slate-400 opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="material-symbols-outlined">content_copy</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-400/10 border border-slate-400/20 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined">code</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Dev Fund Wallet</p>
                                <h3 className="text-2xl font-black tracking-tight text-white">$850,000.00</h3>
                                <p className="text-sm font-medium text-slate-400 mt-1">320k USDC</p>
                            </div>
                        </div>
                    </div>
                    {/* Product Fund */}
                    <div className="bg-card-dark border border-white/5 p-6 rounded-xl hover:border-slate-400/50 transition-all group relative">
                        <div className="absolute top-4 right-4 text-slate-400 opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="material-symbols-outlined">content_copy</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-400/10 border border-slate-400/20 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined">rocket_launch</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Product Fund</p>
                                <h3 className="text-2xl font-black tracking-tight text-white">$1,500,000.00</h3>
                                <p className="text-sm font-medium text-slate-400 mt-1">560.10 ETH</p>
                            </div>
                        </div>
                    </div>
                    {/* Expense Fund */}
                    <div className="bg-card-dark border border-white/5 p-6 rounded-xl hover:border-slate-400/50 transition-all group relative">
                        <div className="absolute top-4 right-4 text-slate-400 opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="material-symbols-outlined">content_copy</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-400/10 border border-slate-400/20 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined">receipt_long</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Expense Fund</p>
                                <h3 className="text-2xl font-black tracking-tight text-white">$699,500.00</h3>
                                <p className="text-sm font-medium text-slate-400 mt-1">260k USDT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-card-dark border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-bold text-white tracking-tight">Transaction History Logs</h3>
                        <div className="flex gap-1 ml-4 bg-background-dark p-1 rounded-lg border border-white/5">
                            <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white rounded shadow-sm">All</button>
                            <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors">Inflows</button>
                            <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors">Outflows</button>
                        </div>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">search</span>
                        <input className="bg-background-dark border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:ring-1 focus:ring-yellow-400/50 outline-none w-64 transition-all" placeholder="Search by Tx Hash..." type="text" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-background-dark/50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Asset</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Tx Hash</th>
                                <th className="px-6 py-4 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Tx Item 1 */}
                            <tr className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                            <span className="material-symbols-outlined text-sm">south_west</span>
                                        </div>
                                        <span className="text-xs font-bold text-white">Inflow</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-slate-200">
                                        <div className="w-5 h-5 rounded-full bg-background-dark flex items-center justify-center overflow-hidden border border-white/5">
                                            <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">Ξ</div>
                                        </div>
                                        <span className="text-xs font-medium">Ethereum</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-xs font-bold text-white tracking-tight">+12.50 ETH</span>
                                    <p className="text-[10px] text-slate-500 font-bold">$33,450.00</p>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-mono text-slate-400 font-bold">0x8a92...32fc</span>
                                        <span className="material-symbols-outlined text-xs text-slate-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">open_in_new</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <p className="text-xs font-medium text-white">2 mins ago</p>
                                    <p className="text-[10px] text-slate-500 font-bold">Oct 24, 2023 14:22:10</p>
                                </td>
                            </tr>
                            {/* Tx Item 2 */}
                            <tr className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                            <span className="material-symbols-outlined text-sm">north_east</span>
                                        </div>
                                        <span className="text-xs font-bold text-white">Payout</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-slate-200">
                                        <div className="w-5 h-5 rounded-full bg-background-dark flex items-center justify-center overflow-hidden border border-white/5">
                                            <div className="w-full h-full bg-green-500/20 flex items-center justify-center text-[10px] font-bold text-green-400">$</div>
                                        </div>
                                        <span className="text-xs font-medium">USDC</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-xs font-bold text-white tracking-tight">-5,000.00 USDC</span>
                                    <p className="text-[10px] text-slate-500 font-bold">$5,000.00</p>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-mono text-slate-400 font-bold">0x14b9...f822</span>
                                        <span className="material-symbols-outlined text-xs text-slate-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">open_in_new</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <p className="text-xs font-medium text-white">15 mins ago</p>
                                    <p className="text-[10px] text-slate-500 font-bold">Oct 24, 2023 14:09:45</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-background-dark/30 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Showing 1-10 of 4,821 logs</span>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-sm text-slate-500">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 rounded border border-white/5 flex items-center justify-center bg-white/10 text-xs font-bold text-white">1</button>
                        <button className="w-8 h-8 rounded border border-white/5 flex items-center justify-center text-xs font-bold text-slate-400 hover:bg-white/5 transition-colors">2</button>
                        <button className="w-8 h-8 rounded border border-white/5 flex items-center justify-center text-xs font-bold text-slate-400 hover:bg-white/5 transition-colors">3</button>
                        <button className="w-8 h-8 rounded border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-sm text-slate-500">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Secondary Info Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card-dark border border-white/5 rounded-xl p-6 shadow-2xl">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Asset Allocation Breakdown</h4>
                    <div className="flex items-end gap-1 h-32 mb-6">
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
                    <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Ethereum</p>
                            <p className="text-xs font-bold text-white">$2,465,500.45</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">USDC</p>
                            <p className="text-xs font-bold text-white">$935,000.00</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">USDT</p>
                            <p className="text-xs font-bold text-white">$637,500.00</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Others</p>
                            <p className="text-xs font-bold text-white">$212,000.00</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card-dark border border-white/5 rounded-xl p-6 shadow-2xl">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Security & Multisig</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-background-dark/50 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-yellow-400">security</span>
                                <div>
                                    <p className="text-xs font-bold text-white">Multisig Threshold</p>
                                    <p className="text-[10px] text-slate-500 font-bold">3 of 5 Owners</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-green-500 text-sm">verified</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background-dark/50 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">history_edu</span>
                                <div>
                                    <p className="text-xs font-bold text-white">Pending Signatures</p>
                                    <p className="text-[10px] text-slate-500 font-bold">2 active proposals</p>
                                </div>
                            </div>
                            <div className="px-2 py-0.5 rounded bg-yellow-400 text-black text-[9px] font-black tracking-tighter">2 NEW</div>
                        </div>
                        <button className="w-full py-3 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-colors mt-4">
                            Manage Signatories
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Treasury;

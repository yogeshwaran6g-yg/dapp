import React from 'react';
import TokenIcon from './TokenIcon';
import StatusBadge from './StatusBadge';

const RecentTransactions = ({ transactions }) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#D4AF37]">history</span>
                    Recent Transactions
                </h3>
                <button className="text-xs font-bold text-[#D4AF37] hover:underline">View All</button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/3">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Asset Pair</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Time</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((swap, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-all">
                                    {/* Asset Pair */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                <TokenIcon
                                                    icon={swap.fromIcon}
                                                    iconStyle={swap.fromIconStyle}
                                                    iconClass={swap.fromIconClass}
                                                    size="w-6 h-6"
                                                    textSize="text-[12px]"
                                                />
                                                <TokenIcon
                                                    icon={swap.toIcon}
                                                    iconStyle={swap.toIconStyle}
                                                    iconClass={swap.toIconClass}
                                                    size="w-6 h-6"
                                                    textSize="text-[12px]"
                                                />
                                            </div>
                                            <span className="text-sm font-bold ml-2">
                                                {swap.from} → {swap.to}
                                            </span>
                                        </div>
                                    </td>
                                    {/* Amount */}
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{swap.fromAmount}</span>
                                            <span className="text-[10px] text-white/40">{swap.toAmount}</span>
                                        </div>
                                    </td>
                                    {/* Status */}
                                    <td className="px-6 py-5">
                                        <StatusBadge status={swap.status} />
                                    </td>
                                    {/* Time */}
                                    <td className="px-6 py-5 text-xs text-white/50">{swap.time}</td>
                                    {/* Action */}
                                    <td className="px-6 py-5">
                                        <a href="#" className="text-[#D4AF37] hover:text-[#F9E498] transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">{swap.actionIcon}</span>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecentTransactions;

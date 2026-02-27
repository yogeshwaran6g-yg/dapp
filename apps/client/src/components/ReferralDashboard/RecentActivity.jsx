import React from 'react';

const RecentActivity = () => {
    return (
        <div className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden mt-4 lg:mt-6">
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm sm:text-lg font-bold">Network Activity</h3>
                <button className="text-[9px] sm:text-xs text-silver/60 hover:text-gold-start transition-colors font-bold uppercase tracking-widest flex items-center gap-2 shrink-0">
                    VIEW ALL
                    <span className="material-symbols-outlined text-[10px] sm:text-sm">arrow_forward</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="text-left text-[10px] text-silver/40 uppercase tracking-[0.2em] bg-white/[0.02]">
                            <th className="px-4 sm:px-8 py-4 font-black">Wallet Address</th>
                            <th className="px-4 sm:px-8 py-4 font-black">Tier Level</th>
                            <th className="px-4 sm:px-8 py-4 font-black">Status</th>
                            <th className="px-4 sm:px-8 py-4 font-black">Date Joined</th>
                            <th className="px-4 sm:px-8 py-4 font-black text-right">Potential APY</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {[
                            { address: '0x8a2...3b1f', level: 'LEVEL 1', status: 'ACTIVE', color: 'gold-start', date: '2 mins ago', apy: '14.2%' },
                            { address: '0x1c4...e892', level: 'LEVEL 2', status: 'ACTIVE', color: 'silver', date: '1 hour ago', apy: '8.5%' },
                            { address: '0x5f2...a1c9', level: 'LEVEL 3', status: 'INACTIVE', color: 'gray-700', date: '5 hours ago', apy: '--' }
                        ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                                <td className="px-4 sm:px-8 py-4 lg:py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-8 rounded-full bg-gradient-to-br from-${row.color} to-transparent opacity-30 shrink-0`}></div>
                                        <span className="text-xs sm:text-sm font-mono text-silver group-hover:text-white transition-colors">{row.address}</span>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-8 py-4 lg:py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.level === 'LEVEL 1' ? 'bg-gold-start/10 text-gold-start border border-gold-start/20' : 'bg-white/5 text-silver border border-white/10'}`}>
                                        {row.level}
                                    </span>
                                </td>
                                <td className="px-4 sm:px-8 py-4 lg:py-5">
                                    <span className={`flex items-center gap-2 text-[10px] font-bold ${row.status === 'ACTIVE' ? 'text-green-400' : 'text-silver/40'}`}>
                                        <span className={`size-1.5 rounded-full ${row.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-silver/20'}`}></span>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-4 sm:px-8 py-4 lg:py-5 text-[10px] sm:text-xs text-silver/60 font-medium">{row.date}</td>
                                <td className="px-4 sm:px-8 py-4 lg:py-5 text-right font-bold text-white text-xs sm:text-sm">{row.apy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivity;

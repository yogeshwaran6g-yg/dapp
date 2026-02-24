import React from 'react';

const ReferralDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-gold-start/10 transition-colors">
                        <span className="material-symbols-outlined !text-6xl">person_add</span>
                    </div>
                    <p className="text-silver/60 text-xs font-medium uppercase tracking-wider">Total Direct Referrals</p>
                    <div className="mt-4 flex items-end gap-3">
                        <h3 className="text-3xl font-black">124</h3>
                        <span className="text-green-400 text-xs font-bold mb-1">+12%</span>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-gold-start/10 transition-colors">
                        <span className="material-symbols-outlined !text-6xl">groups_3</span>
                    </div>
                    <p className="text-silver/60 text-xs font-medium uppercase tracking-wider">Total Team Size</p>
                    <div className="mt-4 flex items-end gap-3">
                        <h3 className="text-3xl font-black">1,450</h3>
                        <span className="text-green-400 text-xs font-bold mb-1">+5%</span>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-gold-start/10 transition-colors">
                        <span className="material-symbols-outlined !text-6xl">bolt</span>
                    </div>
                    <p className="text-silver/60 text-xs font-medium uppercase tracking-wider">Referral Earnings</p>
                    <div className="mt-4 flex items-end gap-3">
                        <h3 className="text-3xl font-black gold-gradient-text">12,850.50</h3>
                        <span className="text-silver text-[10px] font-bold mb-1.5 ml-1">NRJ</span>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border-gold-start/20 flex flex-col justify-between">
                    <div>
                        <p className="text-silver/60 text-xs font-medium uppercase tracking-wider">Your Referral Link</p>
                        <p className="mt-2 text-sm font-mono text-silver truncate">refer.network/user/0x71c...4f92</p>
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText('refer.network/user/0x71c...4f92')}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gold-start/30 text-gold-start text-xs font-bold hover:bg-gold-start hover:text-primary transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                        Copy Link
                    </button>
                </div>
            </div>

            {/* Orbital Section */}
            <div className="glass-card rounded-3xl p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                        <span className="material-symbols-outlined text-gold-start">star</span>
                        REFERRAL NETWORK ARCHITECTURE
                    </h2>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-silver border border-white/10 uppercase tracking-widest font-bold">Real-time Visualization</span>
                    </div>
                </div>

                <div className="orbit-container">
                    {/* Orbit Rings */}
                    <div className="orbit-ring w-[180px] h-[180px]"></div>
                    <div className="orbit-ring w-[320px] h-[320px]"></div>
                    <div className="orbit-ring w-[460px] h-[460px]"></div>

                    {/* Level 3 Planets */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="size-6 bg-silver rounded-full planet-glow border-2 border-primary"></div>
                        <span className="mt-2 text-[10px] font-bold text-silver/60">L3: 1,306 Users (2%)</span>
                    </div>

                    {/* Level 2 Planets */}
                    <div className="absolute top-1/4 left-20 flex flex-col items-center">
                        <div className="size-10 bg-silver/60 rounded-full planet-glow border-2 border-primary"></div>
                        <span className="mt-2 text-[10px] font-bold text-silver/80">L2: 120 Users (5%)</span>
                    </div>
                    <div className="absolute bottom-1/4 right-24 flex flex-col items-center">
                        <div className="size-10 bg-silver/60 rounded-full planet-glow border-2 border-primary"></div>
                        <span className="mt-2 text-[10px] font-bold text-silver/80">L2: Active Node</span>
                    </div>

                    {/* Level 1 Planets */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-32 -translate-y-20 flex flex-col items-center">
                        <div className="size-14 gold-gradient-bg rounded-full planet-glow border-4 border-primary shadow-xl"></div>
                        <span className="mt-2 text-[10px] font-bold text-gold-start">L1: 24 Users (10%)</span>
                    </div>

                    {/* Central SUN */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="size-24 gold-gradient-bg rounded-full sun-glow border-[6px] border-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary !text-4xl font-black">person</span>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm font-black gold-gradient-text uppercase tracking-widest">YOU</p>
                            <p className="text-[10px] text-silver/40">Node Controller</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Referrals Table */}
            <div className="glass-card rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Recent Network Activity</h3>
                    <button className="text-xs text-silver/60 hover:text-gold-start transition-colors font-bold uppercase tracking-widest flex items-center gap-2">
                        View All Activity
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] text-silver/40 uppercase tracking-[0.2em] bg-white/[0.02]">
                                <th className="px-8 py-4 font-black">Wallet Address</th>
                                <th className="px-8 py-4 font-black">Tier Level</th>
                                <th className="px-8 py-4 font-black">Status</th>
                                <th className="px-8 py-4 font-black">Date Joined</th>
                                <th className="px-8 py-4 font-black text-right">Potential APY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { address: '0x8a2...3b1f', level: 'LEVEL 1', status: 'ACTIVE', color: 'gold-start', date: '2 mins ago', apy: '14.2%' },
                                { address: '0x1c4...e892', level: 'LEVEL 2', status: 'ACTIVE', color: 'silver', date: '1 hour ago', apy: '8.5%' },
                                { address: '0x5f2...a1c9', level: 'LEVEL 3', status: 'INACTIVE', color: 'gray-700', date: '5 hours ago', apy: '--' }
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-8 rounded-full bg-gradient-to-br from-${row.color} to-transparent opacity-30`}></div>
                                            <span className="text-sm font-mono text-silver group-hover:text-white transition-colors">{row.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.level === 'LEVEL 1' ? 'bg-gold-start/10 text-gold-start border border-gold-start/20' : 'bg-white/5 text-silver border border-white/10'}`}>
                                            {row.level}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`flex items-center gap-2 text-[10px] font-bold ${row.status === 'ACTIVE' ? 'text-green-400' : 'text-silver/40'}`}>
                                            <span className={`size-1.5 rounded-full ${row.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-silver/20'}`}></span>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs text-silver/60 font-medium">{row.date}</td>
                                    <td className="px-8 py-5 text-right font-bold text-white">{row.apy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReferralDashboard;

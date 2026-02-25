import React from 'react';

const ReferralDashboard = () => {
    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-1 sm:p-0">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-gold-start/10 transition-colors">
                        <span className="material-symbols-outlined !text-4xl sm:!text-5xl">person_add</span>
                    </div>
                    <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Direct Referrals</p>
                    <div className="mt-2 sm:mt-4 flex items-end gap-2 sm:gap-3">
                        <h3 className="text-xl sm:text-2xl font-black">124</h3>
                        <span className="text-green-400 text-[10px] font-bold mb-0.5 sm:mb-1">+12%</span>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-gold-start/10 transition-colors">
                        <span className="material-symbols-outlined !text-4xl sm:!text-5xl">groups_3</span>
                    </div>
                    <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Total Team Size</p>
                    <div className="mt-2 sm:mt-4 flex items-end gap-2 sm:gap-3">
                        <h3 className="text-xl sm:text-2xl font-black">1,450</h3>
                        <span className="text-green-400 text-[10px] font-bold mb-0.5 sm:mb-1">+5%</span>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-gold-start/10 transition-colors">
                        <span className="material-symbols-outlined !text-4xl sm:!text-5xl">bolt</span>
                    </div>
                    <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Referral Earnings</p>
                    <div className="mt-2 sm:mt-4 flex items-end gap-2 sm:gap-3">
                        <h3 className="text-xl sm:text-2xl font-black gold-gradient-text">12,850.50</h3>
                        <span className="text-silver text-[9px] font-bold mb-1 ml-0.5">NRJ</span>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border-gold-start/20 flex flex-col justify-between group/card hover:border-gold-start/40 transition-colors">
                    <div>
                        <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Referral Link</p>
                        <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/5 group-hover/card:border-gold-start/20 transition-all">
                            <p className="text-[10px] font-mono text-silver truncate">refer.network/user/0x7...f92</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText('refer.network/user/0x71c...4f92');
                            // Add toast or feedback here if available
                        }}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gold-start/30 text-gold-start text-[9px] sm:text-[10px] font-bold hover:bg-gold-start hover:text-primary transition-all active:scale-95 shadow-lg shadow-gold-start/5"
                    >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                        Copy Link
                    </button>
                </div>
            </div>

            {/* Orbital Section */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-start/5 blur-[100px] -z-10"></div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-3">
                    <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 sm:gap-3">
                        <span className="material-symbols-outlined text-gold-start text-base sm:text-xl">star</span>
                        <span className="truncate">NETWORK ARCHITECTURE</span>
                    </h2>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-gold-start/10 rounded-full text-[8px] sm:text-[10px] text-gold-start border border-gold-start/20 uppercase tracking-widest font-bold flex items-center gap-1.5">
                            <span className="size-1 bg-gold-start rounded-full animate-pulse"></span>
                            Real-time Visualization
                        </span>
                    </div>
                </div>

                <div className="relative h-[320px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
                    <div className="orbit-container scale-[0.45] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 flex items-center justify-center transition-transform duration-500 absolute inset-0 m-auto">
                        {/* Orbit Rings */}
                        <div className="orbit-ring w-[180px] h-[180px] orbit-rotate-fast opacity-40"></div>
                        <div className="orbit-ring w-[320px] h-[320px] orbit-rotate-medium opacity-30"></div>
                        <div className="orbit-ring w-[460px] h-[460px] orbit-rotate-slow opacity-20"></div>

                        {/* Level 3 Planets */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center group/planet">
                            <div className="size-6 bg-silver rounded-full planet-glow border-2 border-primary cursor-help"></div>
                            <span className="mt-2 text-[10px] font-bold text-silver/60 whitespace-nowrap opacity-0 group-hover/planet:opacity-100 transition-opacity">L3: 1,306 Users (2%)</span>
                        </div>

                        {/* Level 2 Planets */}
                        <div className="absolute top-1/4 left-16 flex flex-col items-center group/planet">
                            <div className="size-10 bg-silver/80 rounded-full planet-glow border-2 border-primary cursor-help"></div>
                            <span className="mt-2 text-[10px] font-bold text-silver/80 whitespace-nowrap opacity-0 group-hover/planet:opacity-100 transition-opacity">L2: 120 Users (5%)</span>
                        </div>
                        <div className="absolute bottom-1/4 right-20 flex flex-col items-center group/planet">
                            <div className="size-10 bg-silver/60 rounded-full planet-glow border-2 border-primary cursor-help"></div>
                            <span className="mt-2 text-[10px] font-bold text-silver/80 whitespace-nowrap opacity-0 group-hover/planet:opacity-100 transition-opacity">L2: Active Node</span>
                        </div>

                        {/* Level 1 Planets */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-32 -translate-y-24 flex flex-col items-center group/planet">
                            <div className="size-14 gold-gradient-bg rounded-full planet-glow border-4 border-primary shadow-xl cursor-help"></div>
                            <span className="mt-2 text-[10px] font-bold text-gold-start whitespace-nowrap opacity-0 group-hover/planet:opacity-100 transition-opacity">L1: 24 Users (10%)</span>
                        </div>

                        {/* Central SUN */}
                        <div className="relative z-10 flex flex-col items-center group/sun">
                            <div className="size-20 sm:size-24 gold-gradient-bg rounded-full sun-glow border-[4px] sm:border-[6px] border-primary flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95">
                                <span className="material-symbols-outlined text-primary !text-3xl sm:!text-4xl font-black">person</span>
                            </div>
                            <div className="mt-3 sm:mt-5 text-center transition-transform group-hover/sun:-translate-y-1">
                                <p className="text-xs sm:text-sm font-black gold-gradient-text uppercase tracking-[0.2em]">YOU</p>
                                <p className="text-[9px] sm:text-[10px] text-silver/40 font-bold mt-0.5">NODE CONTROLLER</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Recent Referrals Table */}
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
        </div>
    );
};

export default ReferralDashboard;

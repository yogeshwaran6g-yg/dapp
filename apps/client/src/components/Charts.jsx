import React from 'react';

const Charts = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Royalty Chart */}
            <div className="glass-panel p-6 rounded-xl border border-white/5 lg:col-span-1">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <h3 className="text-base font-bold">Monthly Royalty</h3>
                        <span className="text-xs text-gray-500">Income trends last 30 days</span>
                    </div>
                    <span className="text-green-400 text-sm font-bold">+15%</span>
                </div>
                <div className="relative h-48 w-full">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.5"></stop>
                                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <path d="M0,40 L0,30 Q10,25 20,28 T40,20 T60,25 T80,10 T100,15 L100,40 Z" fill="url(#chartGradient)"></path>
                        <path d="M0,30 Q10,25 20,28 T40,20 T60,25 T80,10 T100,15" fill="none" stroke="#D4AF37" strokeWidth="0.5"></path>
                    </svg>
                    <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                    </div>
                </div>
            </div>

            {/* Referral Growth Bar Chart */}
            <div className="glass-panel p-6 rounded-xl border border-white/5 lg:col-span-1">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <h3 className="text-base font-bold">Referral Growth</h3>
                        <span className="text-xs text-gray-500">Team expansion progress</span>
                    </div>
                    <span className="text-accent-gold text-sm font-bold">+148 Total</span>
                </div>
                <div className="flex items-end justify-between h-48 w-full gap-2 pb-2">
                    {[60, 85, 45, 70, 100, 80].map((height, idx) => (
                        <div key={idx} className="w-full bg-white/5 rounded-t-sm relative group overflow-hidden" style={{ height: `${height}%` }}>
                            <div className="absolute inset-0 action-gradient-gold opacity-40 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
            </div>

            {/* Daily Staking Profit Chart */}
            <div className="glass-panel p-6 rounded-xl border border-white/5 lg:col-span-1">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <h3 className="text-base font-bold">Daily Profit</h3>
                        <span className="text-xs text-gray-500">24h staking returns</span>
                    </div>
                    <span className="text-white text-sm font-bold">+15.4 LX</span>
                </div>
                <div className="relative h-48 w-full">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                        <path d="M0,35 L10,32 L20,34 L30,25 L40,28 L50,15 L60,20 L70,10 L80,18 L90,8 L100,5" fill="none" stroke="#D4AF37" strokeDasharray="2,1" strokeWidth="1"></path>
                        <circle cx="0" cy="35" fill="#D4AF37" r="1"></circle>
                        <circle cx="50" cy="15" fill="#D4AF37" r="1"></circle>
                        <circle cx="100" cy="5" fill="#D4AF37" r="1"></circle>
                    </svg>
                    <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        <span>00:00</span><span>08:00</span><span>16:00</span><span>24:00</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;

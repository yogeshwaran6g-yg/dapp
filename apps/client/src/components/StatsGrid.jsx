import React from 'react';

const StatsGrid = () => {
    const stats = [
        { label: 'Total Earnings', value: '$ 0.00', trend: '---', trendColor: 'text-gray-500' },
        { label: 'Active Slot', value: 'Level 1', special: 'CURRENT' },
        { label: 'Royalty Income', value: '$ 0.00', trend: '---', trendColor: 'text-gray-500' },
        { label: 'Referrals', value: '0', trend: '0 New', trendColor: 'text-gray-500' },
        { label: 'Staked', value: '0 LX', trend: '0% Change', trendColor: 'text-gray-500' },
        { label: 'Energy Bal.', value: '0.00', trend: '---', trendColor: 'text-gray-500' },
        { label: 'Pending Rewards', value: '$ 0.00', special: '---' },
    ];

    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="glass-panel gold-glow-border p-4 rounded-xl flex flex-col gap-1">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                    <p className="text-lg font-bold text-white tracking-tight">{stat.value}</p>
                    {stat.trend && (
                        <p className={`text-[10px] font-bold flex items-center gap-1 ${stat.trendColor}`}>
                            {stat.trendIcon && <span className="material-symbols-outlined text-xs">{stat.trendIcon}</span>}
                            {stat.trend}
                        </p>
                    )}
                    {stat.special && (
                        <p className={`text-[10px] font-bold ${stat.special === 'CLAIM NOW' ? 'text-accent-gold-light' : 'text-accent-gold'}`}>
                            {stat.special}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;
